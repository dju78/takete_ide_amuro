import Link from "next/link";
import { HeritageImage } from "@/components/ui/HeritageImage";
import type { ResolvedBranch } from "@/lib/data/tipu-branches";

/**
 * The homepage's view of the branch network.
 *
 * Deliberately mixed. Only three branches have photographs, so a uniform grid of
 * ten tiles would be seven placeholders — and a page that is mostly placeholders
 * reads as unfinished however well the placeholder is drawn. So the photographed
 * branches lead at full size, and the rest appear as compact typographic tiles:
 * still branded, still legible, but not pretending to be pictures.
 *
 * The complete placeholder grid belongs on /tipu/branches, where it is the point.
 */
export function HomeBranchShowcase({ branches }: { branches: ResolvedBranch[] }) {
  const withPhotos = branches.filter((b) => b.image).slice(0, 3);
  const photoSlugs = new Set(withPhotos.map((b) => b.slug));
  const rest = branches.filter((b) => !photoSlugs.has(b.slug));

  return (
    <div>
      {withPhotos.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {withPhotos.map((branch) => (
            <li key={branch.slug}>
              <Link
                href={branch.href ?? "/tipu/branches"}
                className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-3xl bg-purple-700 shadow-sm"
              >
                <span className="absolute inset-0">
                  <HeritageImage
                    src={branch.image!}
                    alt=""
                    label={branch.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </span>
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-900/25 to-transparent"
                />
                <span className="relative p-5">
                  <span className="block font-serif text-lg font-bold text-white">{branch.shortName}</span>
                  {branch.location && (
                    <span className="mt-0.5 block text-xs text-gold-300/90">{branch.location}</span>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {rest.length > 0 && (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {rest.map((branch) => (
            <li key={branch.slug}>
              {/* Compact typographic tile — no media block, so it reads as a
                  place name rather than a missing photograph. */}
              <Link
                href="/tipu/branches"
                className="group flex h-full items-center gap-3 rounded-2xl border border-purple-600/10 bg-white p-3.5 shadow-sm transition-colors hover:border-purple-600/30"
              >
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-700 font-serif text-sm font-bold tracking-wider text-gold-300"
                >
                  {branch.acronym}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-charcoal group-hover:text-purple-600">
                    {branch.shortName}
                  </span>
                  {branch.location && (
                    <span className="block truncate text-xs text-charcoal/55">{branch.location}</span>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
