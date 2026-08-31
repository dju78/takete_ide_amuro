import Link from "next/link";
import { HeritageImage } from "@/components/ui/HeritageImage";
import { BranchMediaPlaceholder } from "@/components/tipu/BranchMediaPlaceholder";
import type { ResolvedBranch } from "@/lib/data/tipu-branches";

/**
 * Compact branch tiles for the homepage.
 *
 * A deliberately small selection — the full network belongs on /tipu/branches.
 * The point of the strip is that a visitor grasps in one glance that Takete-Ide
 * is not only a place in Kogi State but a community spread across Nigeria and
 * the diaspora. Tiles with photographs and tiles with placeholder artwork are
 * the same shape and weight, so the row reads evenly.
 */
export function BranchStrip({ branches }: { branches: ResolvedBranch[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {branches.map((branch) => {
        // Skip the location line when it just repeats the label above it
        // (e.g. "North America" / "North America").
        const regionLine =
          branch.location && !branch.location.startsWith(branch.shortName) ? branch.location : null;
        const tile = (
          <>
            <span className="absolute inset-0">
              {branch.image ? (
                <HeritageImage
                  src={branch.image}
                  alt=""
                  label={branch.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <BranchMediaPlaceholder
                  branchName={branch.name}
                  acronym={branch.acronym}
                  size="compact"
                />
              )}
            </span>
            {/* Photographs need a scrim for legible text; the placeholder is already dark. */}
            {branch.image && (
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-900/30 to-transparent"
              />
            )}
            <span className="relative mt-auto block p-3">
              <span className="block font-serif text-sm font-bold leading-tight text-white">
                {branch.shortName}
              </span>
              {regionLine && (
                <span className="mt-0.5 block truncate text-[0.7rem] text-gold-300/90">{regionLine}</span>
              )}
            </span>
          </>
        );

        return (
          <li key={branch.slug}>
            {branch.href ? (
              <Link
                href={branch.href}
                className="group relative flex aspect-[4/3] flex-col overflow-hidden rounded-2xl bg-purple-700 shadow-sm"
              >
                {tile}
              </Link>
            ) : (
              <span className="group relative flex aspect-[4/3] flex-col overflow-hidden rounded-2xl bg-purple-700 shadow-sm">
                {tile}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
