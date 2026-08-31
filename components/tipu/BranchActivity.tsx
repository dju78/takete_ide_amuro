import Link from "next/link";
import { CalendarDays, Newspaper } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getBranchUpdates } from "@/lib/data/tipu-branches";
import { getNewsForBranch } from "@/lib/data/news";
import { formatDate } from "@/lib/utils";

/**
 * A branch's own record: published updates entered through the admin area, plus
 * any news article tagged as relating to this branch.
 *
 * Renders nothing at all when a branch has neither. An empty "Branch activity"
 * heading would imply the branch is inactive, which is a claim about the branch
 * rather than about the archive — and the two are not the same thing.
 *
 * Only `status = 'published'` updates are fetched (see getBranchUpdates), so a
 * draft entered by an administrator stays private.
 */
export async function BranchActivity({ branchSlug }: { branchSlug: string }) {
  const [updatesMap, news] = await Promise.all([getBranchUpdates(), getNewsForBranch(branchSlug, 3)]);
  const updates = updatesMap.get(branchSlug) ?? [];

  if (updates.length === 0 && news.length === 0) return null;

  const today = new Date().toISOString().slice(0, 10);

  return (
    <section className="mt-16">
      <SectionHeading eyebrow="From this branch" title="Branch Activity" align="left" className="mx-0" />

      {updates.length > 0 && (
        <ul className="mt-8 flex flex-col gap-3">
          {updates.map((u) => {
            const upcoming = u.kind === "event" && u.occurs_on !== null && u.occurs_on >= today;
            return (
              <li
                key={u.id}
                className="rounded-2xl border border-purple-600/10 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      u.kind === "event"
                        ? "bg-community-green/10 text-community-green"
                        : "bg-purple-50 text-purple-600"
                    }`}
                  >
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                    {u.kind === "event" ? (upcoming ? "Upcoming event" : "Event") : "News"}
                  </span>
                  {u.occurs_on && (
                    <time dateTime={u.occurs_on} className="text-xs text-charcoal/55">
                      {formatDate(u.occurs_on)}
                    </time>
                  )}
                </div>
                <h3 className="mt-2 font-serif text-lg font-bold text-purple-600">{u.title}</h3>
                {u.body && <p className="mt-1 text-sm leading-relaxed text-charcoal/75">{u.body}</p>}
              </li>
            );
          })}
        </ul>
      )}

      {news.length > 0 && (
        <div className="mt-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-charcoal/50">
            <Newspaper className="h-4 w-4" aria-hidden="true" />
            In the newsroom
          </h3>
          <ul className="mt-3 flex flex-col gap-2">
            {news.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/news/${a.slug}`}
                  className="flex flex-wrap items-baseline gap-x-3 rounded-xl border border-purple-600/10 bg-white px-4 py-3 text-sm transition-colors hover:border-purple-600/30"
                >
                  <span className="font-semibold text-purple-600">{a.title}</span>
                  {a.published_at && (
                    <time dateTime={a.published_at} className="text-xs text-charcoal/50">
                      {formatDate(a.published_at)}
                    </time>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
