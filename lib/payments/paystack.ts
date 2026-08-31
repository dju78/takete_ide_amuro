import "server-only";
import { createHmac, timingSafeEqual, randomBytes } from "node:crypto";
import { env, isPaystackConfigured } from "@/lib/env";

/**
 * Server-side Paystack client.
 *
 * `server-only` at the top makes importing this from a Client Component a build
 * error rather than a runtime secret leak — the secret key must never reach the
 * browser, and a stray import is the most realistic way that would happen.
 *
 * The site never sees card data. Paystack's hosted checkout collects the card,
 * PIN and OTP on Paystack's own domain; this module only asks Paystack to open a
 * transaction and later asks it what happened.
 */

const PAYSTACK_API = "https://api.paystack.co";

export interface InitializeResult {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
}

export interface VerifiedTransaction {
  status: string;
  reference: string;
  amountMinor: number;
  currency: string;
  channel: string | null;
  paidAt: string | null;
  gatewayResponse: string | null;
}

function authHeaders() {
  return {
    Authorization: `Bearer ${env.paystackSecretKey}`,
    "Content-Type": "application/json",
  };
}

/**
 * A transaction reference we generate ourselves.
 *
 * Prefixed so it is recognisable in Paystack's dashboard, timestamped for rough
 * ordering, and suffixed with 9 bytes of CSPRNG output — guessing another
 * contributor's reference must not be feasible, because the callback route
 * accepts a reference from the query string.
 */
export function generateReference() {
  return `TIPU-${Date.now().toString(36).toUpperCase()}-${randomBytes(9).toString("hex").toUpperCase()}`;
}

/**
 * Opens a transaction with Paystack.
 *
 * Deliberately does NOT send a `channels` array: Paystack decides which methods
 * to present based on the merchant's dashboard configuration, country, currency
 * and the customer's context. Hard-coding a list here would advertise channels
 * this account may not have enabled.
 */
export async function initializeTransaction(input: {
  email: string;
  amountMinor: number;
  currency: string;
  reference: string;
  callbackUrl: string;
  metadata: Record<string, unknown>;
}): Promise<{ ok: true; data: InitializeResult } | { ok: false; error: string }> {
  if (!isPaystackConfigured) return { ok: false, error: "Online payment is not configured." };

  try {
    const res = await fetch(`${PAYSTACK_API}/transaction/initialize`, {
      method: "POST",
      headers: authHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        email: input.email,
        amount: input.amountMinor,
        currency: input.currency,
        reference: input.reference,
        callback_url: input.callbackUrl,
        metadata: input.metadata,
      }),
    });

    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.status || !json?.data?.authorization_url) {
      // Paystack's message is safe to surface — it describes the request, not
      // the account — but anything unexpected is reduced to a generic string.
      return { ok: false, error: typeof json?.message === "string" ? json.message : "Could not start the payment." };
    }

    return {
      ok: true,
      data: {
        authorizationUrl: json.data.authorization_url,
        accessCode: json.data.access_code,
        reference: json.data.reference,
      },
    };
  } catch {
    return { ok: false, error: "Could not reach the payment provider." };
  }
}

/**
 * Asks Paystack what actually happened to a transaction.
 *
 * This is the only source of truth for whether a contribution succeeded. Neither
 * the browser callback nor the webhook body is trusted on its own.
 */
export async function verifyTransaction(
  reference: string,
): Promise<{ ok: true; data: VerifiedTransaction } | { ok: false; error: string }> {
  if (!isPaystackConfigured) return { ok: false, error: "Online payment is not configured." };

  try {
    const res = await fetch(`${PAYSTACK_API}/transaction/verify/${encodeURIComponent(reference)}`, {
      method: "GET",
      headers: authHeaders(),
      cache: "no-store",
    });

    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.status || !json?.data) {
      return { ok: false, error: typeof json?.message === "string" ? json.message : "Could not verify the payment." };
    }

    const d = json.data;
    return {
      ok: true,
      data: {
        status: String(d.status ?? "unknown"),
        reference: String(d.reference ?? ""),
        amountMinor: Number(d.amount ?? 0),
        currency: String(d.currency ?? ""),
        channel: d.channel ? String(d.channel) : null,
        paidAt: d.paid_at ?? d.paidAt ?? null,
        gatewayResponse: d.gateway_response ? String(d.gateway_response) : null,
      },
    };
  } catch {
    return { ok: false, error: "Could not reach the payment provider." };
  }
}

/**
 * Verifies the `x-paystack-signature` header: HMAC SHA-512 of the raw request
 * body, keyed with the Paystack secret key.
 *
 * Must be given the *unparsed* body — re-serialising parsed JSON changes the
 * bytes and the digest will not match. Comparison is timing-safe, and a
 * length mismatch short-circuits before comparing (timingSafeEqual throws on
 * unequal lengths).
 */
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!signature || !env.paystackSecretKey) return false;

  const expected = createHmac("sha512", env.paystackSecretKey).update(rawBody, "utf8").digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
