import { NextResponse } from "next/server";
import { settleContribution } from "@/lib/payments/contributions";

/**
 * Where Paystack returns the contributor after checkout.
 *
 * The query string is not evidence. Anyone can visit this URL with any
 * reference, so the only thing that happens here is a server-side verification
 * against Paystack, followed by a redirect to a page that reports the *verified*
 * outcome. Nothing is trusted from the browser.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  // Paystack sends `reference`; `trxref` is the legacy alias it also includes.
  const reference = url.searchParams.get("reference") ?? url.searchParams.get("trxref") ?? "";

  // Redirect relative to the origin the request actually arrived on, rather than
  // the configured site URL. Paystack needs an absolute callback_url, but once
  // the payer is back here their own origin is by definition correct — so a
  // misconfigured NEXT_PUBLIC_SITE_URL can never strand someone who has just
  // paid on a host that does not resolve.
  const base = url.origin;

  if (!reference) {
    return NextResponse.redirect(`${base}/support/payment/failed?reason=missing_reference`, 303);
  }

  const result = await settleContribution(reference);
  const ref = encodeURIComponent(reference);

  switch (result.outcome) {
    case "successful":
    case "already_processed":
      // A refreshed callback lands on already_processed, which is the same good
      // news — not an error, and not a second contribution.
      return NextResponse.redirect(`${base}/support/payment/success?reference=${ref}`, 303);

    case "pending":
      // Some methods — a bank transfer the payer has not completed — verify as
      // ongoing. Telling someone to pay again here risks a duplicate payment.
      return NextResponse.redirect(`${base}/support/payment/pending?reference=${ref}`, 303);

    case "failed":
      return NextResponse.redirect(`${base}/support/payment/failed?reference=${ref}`, 303);

    case "unknown_reference":
    default:
      return NextResponse.redirect(`${base}/support/payment/failed?reason=unknown_reference`, 303);
  }
}
