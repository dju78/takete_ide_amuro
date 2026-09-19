import { ShieldCheck, TrendingUp, Calendar, AlertCircle } from "lucide-react";
import { VerificationBadge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { DevelopmentProject } from "@/types/content";

export function ProjectTransparency({ project }: { project: DevelopmentProject }) {
  const {
    currency,
    funding_target,
    amount_raised,
    amount_spent,
    progress_percentage,
    last_financial_update,
    expenditure_notes,
    source_name,
    verification_status,
  } = project;

  const hasTarget = funding_target != null && funding_target > 0;
  const hasRaised = amount_raised != null;
  const hasSpent = amount_spent != null;
  const hasFinancialData = hasTarget || hasRaised || hasSpent;

  const targetVal = funding_target ?? 0;
  const raisedVal = amount_raised ?? 0;
  const spentVal = amount_spent ?? 0;

  // Outstanding balance needed towards target (if target is set)
  const balanceNeeded = hasTarget && hasRaised ? Math.max(0, targetVal - raisedVal) : null;
  // Available remaining funds from contributions received (if raised & spent are set)
  const unspentFunds = hasRaised && hasSpent ? raisedVal - spentVal : null;

  // Percentage calculation
  const fundingPercent = hasTarget && hasRaised && targetVal > 0 ? Math.min(100, Math.round((raisedVal / targetVal) * 100)) : null;
  const displayProgress = progress_percentage != null ? progress_percentage : fundingPercent;

  return (
    <div className="rounded-3xl border border-gold-500/30 bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 p-6 text-white shadow-md sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-500/20 text-gold-300 ring-1 ring-gold-400/30">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h3 className="font-serif text-lg font-bold text-white">Community Transparency &amp; Accountability</h3>
            <p className="text-xs text-white/70">Verified reporting directly from the community register</p>
          </div>
        </div>
        <VerificationBadge status={verification_status} />
      </div>

      {/* Progress Bar (if verified progress exists) */}
      {displayProgress != null && (
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-gold-300 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
              Project Progress
            </span>
            <span className="text-white font-serif text-sm">{displayProgress}%</span>
          </div>
          <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-white/10 ring-1 ring-white/15">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, displayProgress))}%` }}
              role="progressbar"
              aria-valuenow={displayProgress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      )}

      {/* Financial Details — only render fields that have verified data */}
      {hasFinancialData ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hasTarget && (
            <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
              <span className="text-xs font-medium uppercase tracking-wider text-white/70">Funding Target</span>
              <p className="mt-1 font-serif text-xl font-bold text-gold-300">
                {currency} {targetVal.toLocaleString()}
              </p>
            </div>
          )}

          {hasRaised && (
            <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
              <span className="text-xs font-medium uppercase tracking-wider text-white/70">Contributions Received</span>
              <p className="mt-1 font-serif text-xl font-bold text-emerald-300">
                {currency} {raisedVal.toLocaleString()}
              </p>
            </div>
          )}

          {hasSpent && (
            <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
              <span className="text-xs font-medium uppercase tracking-wider text-white/70">Expenditure</span>
              <p className="mt-1 font-serif text-xl font-bold text-white">
                {currency} {spentVal.toLocaleString()}
              </p>
            </div>
          )}

          {balanceNeeded != null && balanceNeeded > 0 && (
            <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <span className="text-xs font-medium uppercase tracking-wider text-white/60">Outstanding Balance Needed</span>
              <p className="mt-1 font-serif text-lg font-semibold text-white/90">
                {currency} {balanceNeeded.toLocaleString()}
              </p>
            </div>
          )}

          {unspentFunds != null && (
            <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <span className="text-xs font-medium uppercase tracking-wider text-white/60">Balance on Hand</span>
              <p className="mt-1 font-serif text-lg font-semibold text-white/90">
                {currency} {unspentFunds.toLocaleString()}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl bg-white/5 p-4 text-xs text-white/70 ring-1 ring-white/10">
          <p className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-gold-400" aria-hidden="true" />
            Financial accounting and contribution reconciliation for this project are currently being updated by union project coordinators.
          </p>
        </div>
      )}

      {expenditure_notes && (
        <p className="mt-4 text-xs text-white/80 leading-relaxed bg-white/5 p-3 rounded-xl ring-1 ring-white/10">
          <strong className="text-gold-300">Note:</strong> {expenditure_notes}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-4 text-xs text-white/70">
        {last_financial_update ? (
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-gold-400" aria-hidden="true" />
            Last financial update: {formatDate(last_financial_update)}
          </span>
        ) : (
          <span>Financial updates confirmed through union secretariat records.</span>
        )}

        {source_name && (
          <span className="text-white/80">Source: {source_name}</span>
        )}
      </div>
    </div>
  );
}
