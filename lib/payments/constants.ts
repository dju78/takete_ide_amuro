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
