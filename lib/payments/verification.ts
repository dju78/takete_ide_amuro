import type { ContributionStatus } from "./constants";

/**
 * The rules that decide whether a verified transaction may settle a
 * contribution.
 *
 * Kept as a pure function, separate from the database and HTTP work in
 * contributions.ts, because these are the rules that decide whether money is
 * treated as received. Expressed this way they can be exercised directly —
 * a short payment, a currency swap, a mismatched reference — instead of being
 * reachable only through a live provider and a live database, which is exactly
 * the situation where such rules go untested and quietly rot.
 *
 * No secrets and no I/O, so it is safe to import anywhere.
 */

/**
 * Provider statuses that mean "not finished yet" rather than "failed".
 *
 * Paystack reports these for methods that complete out of band — notably a bank
 * transfer the payer has not yet made. Treating them as failure would tell
 * someone their payment did not work while it is still in flight, and invite a
 * second payment.
 */
export const OPEN_PROVIDER_STATUSES = ["ongoing", "pending", "processing"] as const;

export interface ExpectedTransaction {
  reference: string;
  amountMinor: number;
  currency: string;
}

export interface ProviderTransaction {
  reference: string;
  status: string;
  amountMinor: number;
  currency: string;
}

export type VerificationDecision =
  /** Everything matches and the provider reports success. */
  | { kind: "settle" }
  /** The provider's response is about a different transaction. */
  | { kind: "reference_mismatch" }
  /** Not finished; leave it pending and do not prompt a second payment. */
  | { kind: "open"; status: ContributionStatus }
  /** Finished unsuccessfully. */
  | { kind: "closed"; status: ContributionStatus }
  /** Right transaction, wrong money. */
  | { kind: "amount_mismatch"; note: string };

export function decideVerification(input: {
  expected: ExpectedTransaction;
  provider: ProviderTransaction;
}): VerificationDecision {
  const { expected, provider } = input;

  // Checked first: a response for another transaction must never be applied to
  // this row, whatever it says about amounts or status.
  if (provider.reference !== expected.reference) {
    return { kind: "reference_mismatch" };
  }

  if (provider.status !== "success") {
    if ((OPEN_PROVIDER_STATUSES as readonly string[]).includes(provider.status)) {
      return { kind: "open", status: "pending" };
    }
    return { kind: "closed", status: provider.status === "abandoned" ? "abandoned" : "failed" };
  }

  // Both must match, and exactly. A short payment is not a successful
  // contribution, and the same integer in a different currency is not the same
  // amount of money — checking only the number would settle a ₦50,000 pledge
  // against 50,000 of some cheaper unit.
  if (provider.amountMinor !== expected.amountMinor || provider.currency !== expected.currency) {
    return {
      kind: "amount_mismatch",
      note: `Expected ${expected.amountMinor} ${expected.currency}, provider reported ${provider.amountMinor} ${provider.currency}.`,
    };
  }

  return { kind: "settle" };
}
