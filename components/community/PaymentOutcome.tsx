import Link from "next/link";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toMajor } from "@/lib/payments/constants";
import type { ContributionRecord } from "@/lib/payments/contributions";

type Outcome = "success" | "pending" | "failed";

const CHROME: Record<Outcome, { icon: typeof CheckCircle2; tone: string; ring: string }> = {
  success: { icon: CheckCircle2, tone: "text-community-green", ring: "bg-community-green/10" },
  pending: { icon: Clock, tone: "text-gold-700", ring: "bg-gold-100" },
  failed: { icon: XCircle, tone: "text-red-600", ring: "bg-red-100" },
};

/**
 * The confirmation a contributor sees after checkout.
 *
 * Called a "contribution acknowledgement", not a receipt: TIPU's charitable and
 * tax status has not been confirmed for this site, so nothing here claims the
 * contribution is tax deductible or issues a legally framed receipt.
 *
 * Only the fields a contributor needs are shown. No Paystack internals, no
 * authorization data, no email address echoed back into a page whose URL carries
 * a reference anyone could visit.
 */
export function PaymentOutcome({
  outcome,
  title,
  message,
  contribution,
  reference,
}: {
  outcome: Outcome;
  title: string;
  message: string;
  contribution: ContributionRecord | null;
  reference?: string;
}) {
  const { icon: Icon, tone, ring } = CHROME[outcome];

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-3xl border border-purple-600/10 bg-white p-8 text-center shadow-sm sm:p-10">
        <span className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${ring}`}>
          <Icon className={`h-8 w-8 ${tone}`} aria-hidden="true" />
        </span>

        <h1 className="mt-6 font-serif text-2xl font-bold text-purple-600 sm:text-3xl">{title}</h1>
        <p className="mt-3 leading-relaxed text-charcoal/80">{message}</p>

        {(contribution || reference) && (
          <dl className="mt-8 divide-y divide-purple-600/10 rounded-2xl bg-ivory text-left">
            {contribution && (
              <>
                <Row label="Amount">
                  {formatCurrency(toMajor(contribution.amount_minor), contribution.currency)}
                </Row>
                <Row label="Purpose">{contribution.purpose}</Row>
                <Row label="Status">
                  <span className="capitalize">{contribution.status}</span>
                </Row>
                {contribution.channel && <Row label="Payment method">{contribution.channel}</Row>}
                <Row label="Date">
                  {formatDate(contribution.paid_at ?? contribution.created_at)}
                </Row>
              </>
            )}
            <Row label="Reference">
              <code className="break-all text-sm">{contribution?.reference ?? reference}</code>
            </Row>
          </dl>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {outcome === "failed" ? (
            <>
              <ButtonLink href="/support">Try again</ButtonLink>
              <ButtonLink href="/contact" variant="outline">
                Contact the union
              </ButtonLink>
            </>
          ) : (
            <>
              <ButtonLink href="/support" variant={outcome === "success" ? "outline" : "primary"}>
                Return to Support
              </ButtonLink>
              {outcome === "success" && <ButtonLink href="/">Back to the homepage</ButtonLink>}
            </>
          )}
        </div>

        {outcome === "success" && (
          <p className="mt-6 text-xs leading-relaxed text-charcoal/55">
            This is a confirmation of payment, not a tax receipt. Please keep your reference for your
            records. If you need anything further,{" "}
            <Link href="/contact" className="underline underline-offset-2">
              contact the union
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-3">
      <dt className="text-sm font-medium text-charcoal/55">{label}</dt>
      <dd className="text-sm font-semibold text-charcoal">{children}</dd>
    </div>
  );
}
