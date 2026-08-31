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

/**
 * A same-site redirect with a relative `Location`.
 *
 * `NextResponse.redirect` requires an absolute URL, which would have to be built
 * from either the configured site URL or `request.url` — and `request.url` is
 * derived from the `Host` header, which the client controls. A relative
 * `Location` is valid under RFC 7231 §7.1.2 and is resolved by the browser
 * against the address it actually requested, so the destination cannot be
 * influenced by a forged header and cannot be broken by a misconfigured site
 * URL either. Neither input is consulted.
 *
 * Only our own fixed paths reach this function, and the reference is
 * percent-encoded, so no caller-supplied string can escape the path.
 */
function seeOther(path: string) {
  return new NextResponse(null, {
    status: 303,
    headers: { Location: path, "Cache-Control": "no-store" },
  });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  // Paystack sends `reference`; `trxref` is the legacy alias it also includes.
  const reference = url.searchParams.get("reference") ?? url.searchParams.get("trxref") ?? "";

  if (!reference) {
    return seeOther("/support/payment/failed?reason=missing_reference");
  }

  const result = await settleContribution(reference);

  // Only our own reference travels onward, and only so the result page can show
  // the contributor something to quote. No provider payload, authorization code,
  // signature or key is ever placed in a redirect URL.
  const ref = encodeURIComponent(reference);

  switch (result.outcome) {
    case "successful":
    case "already_processed":
      // A refreshed callback lands on already_processed, which is the same good
      // news — not an error, and not a second contribution.
      return seeOther(`/support/payment/success?reference=${ref}`);

    case "pending":
      // Some methods — a bank transfer the payer has not completed — verify as
      // ongoing. Telling someone to pay again here risks a duplicate payment.
      return seeOther(`/support/payment/pending?reference=${ref}`);

    case "failed":
      return seeOther(`/support/payment/failed?reference=${ref}`);

    case "unknown_reference":
    default:
      return seeOther("/support/payment/failed?reason=unknown_reference");
  }
}
