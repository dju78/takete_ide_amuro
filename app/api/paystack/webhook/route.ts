import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/payments/paystack";
import { hasProcessedEvent, recordEvent, settleContribution } from "@/lib/payments/contributions";
import { isPaystackConfigured } from "@/lib/env";

/**
 * Paystack webhook.
 *
 * Runs on the Node runtime because signature verification needs node:crypto, and
 * is forced dynamic so the body is never cached or pre-rendered. Both are
 * required for this to work as a Netlify server function.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Paystack does not always include an event id, so idempotency is keyed on a
 * deterministic value derived from the event type and the transaction
 * reference. Two deliveries of the same charge.success therefore collide on the
 * unique constraint in `payment_events` and the second is a no-op.
 */
function eventKey(eventType: string, reference: string, providerId: unknown) {
  return providerId ? `pk-${providerId}` : `${eventType}:${reference}`;
}

export async function POST(request: Request) {
  // The raw body is required: HMAC is computed over the exact bytes Paystack
  // sent, so parsing and re-serialising would change the digest.
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!isPaystackConfigured) {
    // Nothing to verify against. Do not acknowledge — an unconfigured endpoint
    // silently returning 200 would let Paystack believe events were handled.
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  if (!verifyWebhookSignature(rawBody, signature)) {
    // Never reveal why. An attacker probing the endpoint learns nothing beyond
    // "rejected", and nothing is written for an unauthenticated request.
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  let event: { event?: string; id?: unknown; data?: Record<string, unknown> };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const eventType = String(event.event ?? "");
  const data = event.data ?? {};
  const reference = typeof data.reference === "string" ? data.reference : "";

  if (!reference) {
    // Acknowledged: a malformed or irrelevant event should not be retried
    // forever, but nothing is changed.
    return NextResponse.json({ received: true, handled: false }, { status: 200 });
  }

  const key = eventKey(eventType, reference, event.id);

  // Fast path for a redelivery. The unique constraint is still the real guard —
  // this only avoids re-verifying with Paystack unnecessarily.
  if (await hasProcessedEvent(key)) {
    return NextResponse.json({ received: true, duplicate: true }, { status: 200 });
  }

  if (eventType === "charge.success") {
    // The webhook body is not proof of payment. settleContribution re-verifies
    // with Paystack server-side and checks reference, amount and currency
    // against the pending row before anything is marked successful.
    const result = await settleContribution(reference);

    await recordEvent({
      contributionId: "contribution" in result ? (result.contribution?.id ?? null) : null,
      eventType,
      providerEventId: key,
      reference,
      amountMinor: typeof data.amount === "number" ? data.amount : null,
      currency: typeof data.currency === "string" ? data.currency : null,
      status: typeof data.status === "string" ? data.status : null,
      channel: typeof data.channel === "string" ? data.channel : null,
      note: result.outcome === "successful" ? null : result.outcome,
    });

    return NextResponse.json({ received: true, outcome: result.outcome }, { status: 200 });
  }

  // Transfer and reversal events are recorded so a treasurer can see them, but
  // none of them marks a contribution successful — only verified charge success
  // does that.
  await recordEvent({
    eventType,
    providerEventId: key,
    reference,
    status: typeof data.status === "string" ? data.status : null,
    note: "Recorded; no status change applied.",
  });

  return NextResponse.json({ received: true, handled: false }, { status: 200 });
}

/** Paystack only POSTs here; anything else is a misconfiguration or a probe. */
export async function GET() {
  return NextResponse.json({ error: "method_not_allowed" }, { status: 405 });
}
