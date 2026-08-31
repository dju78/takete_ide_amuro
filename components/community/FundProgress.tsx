import { formatCurrency, formatDate } from "@/lib/utils";
import { trustFundProgress, trustFundOutstanding, type TrustFundReport } from "@/lib/media/community-programme";

/**
 * The Security Trust Fund's reported position.
 *
 * Every figure carries the date it was reported. Nothing here is connected to
 * the union's bank account, so calling it a "current balance" or a "live total"
 * would be false — it is a dated community record, and the wording says so
 * plainly. The percentage is computed from the two amounts, never stored, so it
 * cannot drift out of step with them.
 */
export function FundProgress({ fund }: { fund: TrustFundReport }) {
  const percent = trustFundProgress(fund);
  const outstanding = trustFundOutstanding(fund);
  const rounded = Math.round(percent);

  return (
    <div className="rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-serif text-xl font-bold text-purple-600 sm:text-2xl">
          Security Trust Fund
        </h2>
        <p className="text-xs font-medium text-charcoal/55">
          Last reported update: {formatDate(fund.asOf)}
        </p>
      </div>

      <div className="mt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-serif text-2xl font-bold text-community-green sm:text-3xl">
            {formatCurrency(fund.amountPaid, fund.currency)}
          </p>
          <p className="text-sm text-charcoal/60">
            reported towards {formatCurrency(fund.targetAmount, fund.currency)}
          </p>
        </div>

        <div
          role="progressbar"
          aria-valuenow={rounded}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Security Trust Fund: ${rounded}% of the branch levy target reported as paid, as at ${formatDate(fund.asOf)}`}
          className="mt-3 h-3 w-full overflow-hidden rounded-full bg-purple-50"
        >
          <div
            className="h-full rounded-full bg-community-green transition-[width] duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-2 text-sm font-medium text-charcoal/70">
          {rounded}% of the branch levy target reported as paid
        </p>
      </div>

      <dl className="mt-6 grid gap-4 border-t border-purple-600/10 pt-6 sm:grid-cols-3">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-charcoal/50">
            Total branch levy
          </dt>
          <dd className="mt-1 font-semibold text-charcoal">
            {formatCurrency(fund.targetAmount, fund.currency)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-charcoal/50">Reported paid</dt>
          <dd className="mt-1 font-semibold text-charcoal">
            {formatCurrency(fund.amountPaid, fund.currency)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-charcoal/50">Outstanding</dt>
          <dd className="mt-1 font-semibold text-charcoal">
            {formatCurrency(outstanding, fund.currency)}
          </dd>
        </div>
      </dl>

      <p className="mt-5 text-xs leading-relaxed text-charcoal/55">
        These are the figures reported in the union&rsquo;s branch levy status update of{" "}
        {formatDate(fund.asOf)} — a dated community record, not a live account balance. {fund.note}
      </p>
    </div>
  );
}
