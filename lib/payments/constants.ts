/**
 * Payment values shared by server and client code.
 *
 * Deliberately a separate module with no `server-only` import and no Supabase or
 * secret access. lib/payments/contributions.ts is server-only, so a Client
 * Component importing these constants from there would drag the secret-bearing
 * module into the browser bundle — a build error, and the reason this file
 * exists.
 */

export const CONTRIBUTION_STATUSES = [
  "pending",
  "successful",
  "failed",
  "abandoned",
  "reversed",
] as const;
export type ContributionStatus = (typeof CONTRIBUTION_STATUSES)[number];

/**
 * Purposes a contributor may choose. These describe what the union directs
 * support towards; they are not separately ring-fenced legal funds, and the
 * Support page says so rather than implying otherwise.
 */
export const CONTRIBUTION_PURPOSES = [
  "General Community Development",
  "Centenary 2026",
  "Education",
  "Security",
  "Roads & Infrastructure",
  "Heritage & Culture",
] as const;
export type ContributionPurpose = (typeof CONTRIBUTION_PURPOSES)[number];

/** Naira (or other major unit) from the stored minor unit. */
export function toMajor(amountMinor: number) {
  return amountMinor / 100;
}

/**
 * Minor unit from a major-unit amount. Rounded because Paystack expects an
 * integer number of kobo and floating-point naira would otherwise arrive as
 * something like 499999.99999.
 */
export function toMinor(amountMajor: number) {
  return Math.round(amountMajor * 100);
}

/**
 * Deterministic idempotency key for a provider webhook delivery.
 *
 * Paystack's documented `charge.success` payload carries an event name, a
 * transaction `data.id` and a `data.reference`. It does *not* document a
 * per-delivery event UUID, so there is nothing to key on that is unique to one
 * delivery — which is exactly right: the key must be identical across retries of
 * the same event, or the unique constraint on payment_events.provider_event_id
 * would let a retry settle a contribution twice.
 *
 * The provider is included because the key namespaces a shared table, and
 * `contributions.provider` already anticipates a second processor. `data.id` is
 * included when present because it distinguishes two transactions that somehow
 * share a reference; it is omitted rather than stubbed when absent, so a payload
 * without it still produces a stable key instead of one containing "undefined".
 *
 * Nothing here is read from an undocumented field.
 */
export function paymentEventKey(input: {
  provider?: string;
  eventType: string;
  transactionId?: string | number | null;
  reference: string;
}) {
  const provider = input.provider ?? "paystack";
  const id =
    input.transactionId === null || input.transactionId === undefined || input.transactionId === ""
      ? null
      : String(input.transactionId);

  return id
    ? `${provider}:${input.eventType}:${id}:${input.reference}`
    : `${provider}:${input.eventType}:${input.reference}`;
}
