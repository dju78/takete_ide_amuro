import Link from "next/link";
import { CalendarDays, History, Info, MapPin } from "lucide-react";
import { HeritageImage } from "@/components/ui/HeritageImage";
import { BranchMediaPlaceholder } from "@/components/tipu/BranchMediaPlaceholder";
import { formatDate } from "@/lib/utils";
import { branchPlaceholderMessage, branchStatusNote } from "@/lib/media/tipu-branches";
import type { ResolvedBranch, BranchUpdate } from "@/lib/data/tipu-branches";

/**
 * One branch in the network grid.
 *
 * Branches with a photograph and branches with a placeholder use exactly the
 * same card — same frame, same aspect ratio, same information rows — so the
 * grid reads as one design system rather than "the finished ones and the rest".
 * The only difference a visitor should draw is that a photographic archive is
 * still being built for some of them.
 */
export function BranchCard({
  branch,
  latest,
  upcoming,
}: {
  branch: ResolvedBranch;
  latest?: BranchUpdate;
  upcoming?: BranchUpdate;
}) {
  const regionLine = branch.location;
  const statusNote = branchStatusNote(branch);
  const placeholderNote = branchPlaceholderMessage(branch);
  // Forming branches use the same wording for both; print it once, as the pill.
  const showPlaceholderNote = branch.needsPlaceholder && placeholderNote !== statusNote;

  // Editor-supplied updates win over the baseline activity recorded in the registry.
  const latestLabel = latest?.title ?? branch.latestActivity;
  const latestDate = latest?.occurs_on ?? branch.latestActivityDate;
  const upcomingLabel = upcoming?.title ?? branch.upcomingEvent;
  const upcomingDate = upcoming?.occurs_on ?? branch.upcomingEventDate;

  const body = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden bg-purple-700">
        {branch.image ? (
          <HeritageImage
            src={branch.image}
            alt={branch.imageAlt ?? ""}
            label={branch.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <BranchMediaPlaceholder
            branchName={branch.name}
            region={regionLine}
            acronym={branch.acronym}
            statusMessage={placeholderNote}
            showLabel={false}
          />
        )}
        {branch.status === "inactive" && (
          <span className="absolute right-3 top-3 rounded-full bg-charcoal/80 px-2.5 py-1 text-xs font-semibold text-white">
            Inactive
          </span>
        )}
        {branch.status === "forming" && (
          <span className="absolute right-3 top-3 rounded-full bg-gold-500 px-2.5 py-1 text-xs font-semibold text-purple-900">
            Forming
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif text-lg font-bold text-purple-600 group-hover:text-purple-400">
          {branch.name}
        </h3>
        {regionLine && (
          <p className="mt-1 flex items-center gap-1.5 text-sm text-charcoal/60">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {regionLine}
          </p>
        )}
        {showPlaceholderNote && (
          <p className="mt-1.5 text-xs italic text-charcoal/45">{placeholderNote}</p>
        )}
        <p className="mt-3 flex-1 text-sm leading-relaxed text-charcoal/75">{branch.description}</p>

        {(branch.establishedLabel || latestLabel || upcomingLabel) && (
          <dl className="mt-4 space-y-1.5 border-t border-purple-600/10 pt-4 text-xs">
            {branch.establishedLabel && (
              <div className="flex gap-2">
                <dt className="font-semibold text-charcoal/50">Established</dt>
                <dd className="text-charcoal/70">{branch.establishedLabel}</dd>
              </div>
            )}
            {latestLabel && (
              <div className="flex items-start gap-1.5 text-charcoal/70">
                <History className="mt-0.5 h-3.5 w-3.5 shrink-0 text-purple-600/50" aria-hidden="true" />
                <span>
                  <span className="sr-only">Latest activity: </span>
                  {latestLabel}
                  {latestDate && ` — ${formatDate(latestDate)}`}
                </span>
              </div>
            )}
            {upcomingLabel && (
              <div className="flex items-start gap-1.5 text-community-green">
                <CalendarDays className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>
                  <span className="sr-only">Upcoming: </span>
                  {upcomingLabel}
                  {upcomingDate && ` — ${formatDate(upcomingDate)}`}
                </span>
              </div>
            )}
          </dl>
        )}

        {/* Neutral by design: a branch whose paperwork is catching up is not a
            lesser branch, so this reads as an update in progress, never a warning. */}
        {statusNote && (
          <p className="mt-4 flex items-center gap-1.5 rounded-lg bg-purple-50 px-2.5 py-1.5 text-xs font-medium text-purple-600">
            <Info className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {statusNote}
          </p>
        )}

        {branch.href && <span className="mt-4 text-sm font-semibold text-community-green">View branch →</span>}
      </div>
    </>
  );

  const shell =
    "group flex flex-col overflow-hidden rounded-3xl border border-purple-600/10 bg-white shadow-sm";

  // Only branches with somewhere to go become links — no empty routes.
  return branch.href ? (
    <Link href={branch.href} className={`${shell} transition-shadow hover:shadow-xl`}>
      {body}
    </Link>
  ) : (
    <article className={shell}>{body}</article>
  );
}
