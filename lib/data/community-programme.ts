import { createClient } from "@/lib/supabase/server";
import {
  OFFICIAL_SUPPORT_ACCOUNT,
  CENTENARY,
  SECURITY_TRUST_FUND,
  type SupportAccount,
  type CentenaryDetails,
  type TrustFundReport,
} from "@/lib/media/community-programme";
import { formatCurrency } from "@/lib/utils";

/**
 * The active public contribution account.
 *
 * Falls back to the checked-in official account when there is no database, but
 * an administrator who *deactivates* every account gets exactly that — no
 * account shown. A row explicitly marked inactive must never be papered over by
 * the baseline, or deactivating an account would silently fail.
 */
export async function getSupportAccount(): Promise<SupportAccount | null> {
  const supabase = await createClient();
  if (!supabase) return OFFICIAL_SUPPORT_ACCOUNT;

  const { data, error } = await supabase
    .from("support_accounts")
    .select("account_name, bank_name, account_number, purpose, is_active")
    .order("sort_order")
    .limit(50);

  // No table rows at all: the community hasn't customised anything, so publish
  // the account the site ships with.
  if (error || !data || data.length === 0) return OFFICIAL_SUPPORT_ACCOUNT;

  const active = data.find((a) => a.is_active);
  if (!active) return null;

  return {
    accountName: active.account_name,
    bankName: active.bank_name,
    accountNumber: active.account_number,
    purpose: active.purpose ?? undefined,
    isActive: true,
  };
}

/** Every account row, active or not — admin only. */
export async function getAllSupportAccounts() {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase.from("support_accounts").select("*").order("sort_order");
  return data ?? [];
}

export async function getCentenary(): Promise<CentenaryDetails> {
  const supabase = await createClient();
  if (!supabase) return CENTENARY;
  const { data, error } = await supabase.from("centenary_settings").select("*").eq("id", true).maybeSingle();
  if (error || !data) return CENTENARY;

  return {
    ...CENTENARY,
    headline: data.headline || CENTENARY.headline,
    intro: data.intro || CENTENARY.intro,
    eventDate: data.event_date || CENTENARY.eventDate,
    eventDateLabel: data.event_time_label || formatEventDate(data.event_date) || CENTENARY.eventDateLabel,
    venue: data.venue || CENTENARY.venue,
    programmeStatus: data.programme_status || CENTENARY.programmeStatus,
    attireStatus: data.attire_status || CENTENARY.attireStatus,
  };
}

function formatEventDate(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function getSecurityTrustFund(): Promise<TrustFundReport> {
  const supabase = await createClient();
  if (!supabase) return SECURITY_TRUST_FUND;
  const { data, error } = await supabase.from("security_trust_fund").select("*").eq("id", true).maybeSingle();
  if (error || !data || data.target_amount == null) return SECURITY_TRUST_FUND;

  return {
    targetAmount: Number(data.target_amount),
    amountPaid: Number(data.amount_paid ?? 0),
    currency: data.currency ?? SECURITY_TRUST_FUND.currency,
    asOf: data.as_of ?? SECURITY_TRUST_FUND.asOf,
    note: data.note || SECURITY_TRUST_FUND.note,
  };
}

/** Naira formatting for fund figures, shared by the public page and the admin screen. */
export function formatNaira(amount: number, currency = "NGN") {
  return formatCurrency(amount, currency);
}
