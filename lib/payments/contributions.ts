import "server-only";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { verifyTransaction } from "@/lib/payments/paystack";
import {
  CONTRIBUTION_PURPOSES,
  CONTRIBUTION_STATUSES,
  toMajor,
  toMinor,
  type ContributionStatus,
} from "@/lib/payments/constants";
import { decideVerification } from "@/lib/payments/verification";

// Re-exported so server callers have one import site for the whole payment API.
export { CONTRIBUTION_PURPOSES, CONTRIBUTION_STATUSES, toMajor, toMinor };
export type { ContributionStatus, ContributionPurpose } from "@/lib/payments/constants";

/**
 * The contributions ledger.
 *
 * Every write here goes through the service-role client. That is deliberate:
 * migration 0019 gives `contributions` no anonymous policy at all, so the only
 * way a row can be created is this module, after validation. A public INSERT
 * policy would let anyone forge a row and choose its amount — the very value
 * verification later compares against.
 */

export interface ContributionRecord {
  id: string;
  reference: string;
  email: string;
  contributor_name: string | null;
  amount_minor: number;
  currency: string;
  purpose: string;
  provider: string;
  provider_reference: string | null;
  status: ContributionStatus;
  channel: string | null;
  paid_at: string | null;
  verified_at: string | null;
  created_at: string;
}

/**
 * Creates the pending row before the contributor is sent to Paystack.
 *
 * If this fails there is no redirect: sending someone to pay when we cannot
 * record what they are paying for would leave a payment we can never reconcile.
 */
export async function createPendingContribution(input: {
  reference: string;
  email: string;
  contributorName: string | null;
  message: string | null;
  amountMinor: number;
  currency: string;
  purpose: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = createAdminClient();
  if (!supabase) return { ok: false, error: "Contribution records are not available." };

  const { error } = await supabase.from("contributions").insert({
    reference: input.reference,
    email: input.email,
    contributor_name: input.contributorName,
    message: input.message,
    amount_minor: input.amountMinor,
    currency: input.currency,
    purpose: input.purpose,
    provider: "paystack",
    status: "pending",
  });

  if (error) return { ok: false, error: "Could not record the contribution." };
  return { ok: true };
}

export async function getContributionByReference(reference: string): Promise<ContributionRecord | null> {
  const supabase = createAdminClient();
  if (!supabase) return null;
  const { data } = await supabase.from("contributions").select("*").eq("reference", reference).maybeSingle();
  return (data as ContributionRecord) ?? null;
}

export type SettleOutcome =
  | { outcome: "successful"; contribution: ContributionRecord }
  | { outcome: "already_processed"; contribution: ContributionRecord }
  | { outcome: "pending"; contribution: ContributionRecord; reason: string }
  | { outcome: "failed"; contribution: ContributionRecord | null; reason: string }
  | { outcome: "unknown_reference"; reason: string };

/**
 * The single place a contribution is allowed to become successful.
 *
 * Both the browser callback and the webhook funnel through here, so the rules
 * cannot drift between them. A contribution is marked successful only when
 * Paystack itself reports success AND the reference, amount and currency all
 * match the row we stored before redirecting.
 *
 * Idempotent: a row already marked successful is returned as
 * `already_processed` without being written again, so a redelivered webhook or a
 * refreshed callback page cannot double-count.
 */
export async function settleContribution(reference: string): Promise<SettleOutcome> {
  const supabase = createAdminClient();
  if (!supabase) return { outcome: "unknown_reference", reason: "Contribution records are not available." };

  const contribution = await getContributionByReference(reference);
  if (!contribution) {
    return { outcome: "unknown_reference", reason: "No contribution matches that reference." };
  }

  if (contribution.status === "successful") {
    return { outcome: "already_processed", contribution };
  }

  const verification = await verifyTransaction(reference);
  if (!verification.ok) {
    return { outcome: "pending", contribution, reason: verification.error };
  }

  const v = verification.data;

  // The rules themselves live in verification.ts as a pure function, so each
  // branch below is testable without a live provider or database.
  const decision = decideVerification({
    expected: {
      reference: contribution.reference,
      amountMinor: contribution.amount_minor,
      currency: contribution.currency,
    },
    provider: {
      reference: v.reference,
      status: v.status,
      amountMinor: v.amountMinor,
      currency: v.currency,
    },
  });

  if (decision.kind === "reference_mismatch") {
    await recordEvent({
      contributionId: contribution.id,
      eventType: "verification.reference_mismatch",
      providerEventId: `mismatch-ref-${reference}-${Date.now()}`,
      reference,
      note: "Provider reference did not match the stored reference.",
    });
    return { outcome: "failed", contribution, reason: "Payment could not be matched to this contribution." };
  }

  if (decision.kind === "open" || decision.kind === "closed") {
    await supabase
      .from("contributions")
      .update({ status: decision.status, channel: v.channel, provider_reference: v.reference })
      .eq("id", contribution.id)
      .neq("status", "successful");

    await recordEvent({
      contributionId: contribution.id,
      eventType: `verification.${v.status}`,
      providerEventId: `verify-${reference}-${v.status}`,
      reference,
      amountMinor: v.amountMinor,
      currency: v.currency,
      status: v.status,
      channel: v.channel,
      note: v.gatewayResponse,
    });

    return decision.kind === "open"
      ? { outcome: "pending", contribution, reason: v.gatewayResponse ?? "Payment not yet completed." }
      : { outcome: "failed", contribution, reason: v.gatewayResponse ?? "Payment was not completed." };
  }

  if (decision.kind === "amount_mismatch") {
    await recordEvent({
      contributionId: contribution.id,
      eventType: "verification.amount_mismatch",
      providerEventId: `mismatch-amt-${reference}`,
      reference,
      amountMinor: v.amountMinor,
      currency: v.currency,
      status: v.status,
      note: decision.note,
    });
    return {
      outcome: "failed",
      contribution,
      reason: "The amount confirmed by the payment provider did not match this contribution.",
    };
  }

  // `.neq("status", "successful")` makes the write itself idempotent: two
  // concurrent settlements (callback and webhook arriving together) cannot both
  // transition the row.
  const { data: updated } = await supabase
    .from("contributions")
    .update({
      status: "successful",
      channel: v.channel,
      provider_reference: v.reference,
      paid_at: v.paidAt,
      verified_at: new Date().toISOString(),
    })
    .eq("id", contribution.id)
    .neq("status", "successful")
    .select("*")
    .maybeSingle();

  await recordEvent({
    contributionId: contribution.id,
    eventType: "verification.success",
    providerEventId: `verify-${reference}-success`,
    reference,
    amountMinor: v.amountMinor,
    currency: v.currency,
    status: v.status,
    channel: v.channel,
  });

  return {
    outcome: "successful",
    contribution: (updated as ContributionRecord) ?? { ...contribution, status: "successful" },
  };
}

/**
 * Appends a payment event.
 *
 * `provider_event_id` is unique, so a duplicate insert is rejected by the
 * database rather than by application logic — which is what makes replay safe
 * even if two deliveries are processed concurrently. A conflict is expected and
 * therefore swallowed.
 *
 * Only operational fields are stored. No authorization payload, card metadata or
 * anything that could identify a payment instrument.
 */
export async function recordEvent(input: {
  contributionId?: string | null;
  eventType: string;
  providerEventId: string;
  reference?: string | null;
  amountMinor?: number | null;
  currency?: string | null;
  status?: string | null;
  channel?: string | null;
  note?: string | null;
}): Promise<{ inserted: boolean }> {
  const supabase = createAdminClient();
  if (!supabase) return { inserted: false };

  const { error } = await supabase.from("payment_events").insert({
    contribution_id: input.contributionId ?? null,
    provider: "paystack",
    event_type: input.eventType,
    provider_event_id: input.providerEventId,
    reference: input.reference ?? null,
    amount_minor: input.amountMinor ?? null,
    currency: input.currency ?? null,
    status: input.status ?? null,
    channel: input.channel ?? null,
    note: input.note ?? null,
  });

  // 23505 = unique_violation: this event has already been recorded.
  return { inserted: !error };
}

/** Whether this provider event has already been handled. */
export async function hasProcessedEvent(providerEventId: string): Promise<boolean> {
  const supabase = createAdminClient();
  if (!supabase) return false;
  const { data } = await supabase
    .from("payment_events")
    .select("id")
    .eq("provider_event_id", providerEventId)
    .maybeSingle();
  return Boolean(data);
}

export interface ContributionFilters {
  status?: string;
  purpose?: string;
  channel?: string;
  from?: string;
  to?: string;
}

/**
 * The admin ledger. Uses the *session* client, not the service-role client, so
 * the caller's own RLS applies — a reader without a financial role gets nothing
 * back even if an application-layer guard were ever missed.
 */
export async function listContributions(filters: ContributionFilters = {}): Promise<ContributionRecord[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  let query = supabase.from("contributions").select("*").order("created_at", { ascending: false }).limit(200);
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.purpose) query = query.eq("purpose", filters.purpose);
  if (filters.channel) query = query.eq("channel", filters.channel);
  if (filters.from) query = query.gte("created_at", filters.from);
  if (filters.to) query = query.lte("created_at", `${filters.to}T23:59:59.999Z`);

  const { data, error } = await query;
  if (error || !data) return [];
  return data as ContributionRecord[];
}

/** Totals for the admin summary. Successful contributions only. */
export function summarise(rows: ContributionRecord[]) {
  const successful = rows.filter((r) => r.status === "successful");
  const totalMinor = successful.reduce((sum, r) => sum + r.amount_minor, 0);
  return {
    count: rows.length,
    successfulCount: successful.length,
    pendingCount: rows.filter((r) => r.status === "pending").length,
    totalMajor: toMajor(totalMinor),
  };
}
