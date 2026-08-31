import Image from "next/image";
import { cn } from "@/lib/utils";
import { BRANCH_PLACEHOLDER_MESSAGE } from "@/lib/media/tipu-branches";

interface BranchMediaPlaceholderProps {
  /** Branch name, e.g. "TIPU Kaduna Branch". */
  branchName: string;
  /** Town/state and country as far as the record supports. */
  region?: string;
  /** Two-letter monogram. Falls back to the branch's initials. */
  acronym?: string;
  /** Overrides the default "Community archive image coming soon". */
  statusMessage?: string;
  /** "card" fills a branch card; "compact" suits the homepage strip. */
  size?: "card" | "compact";
  /**
   * Print the branch name, region and status inside the artwork. On by default
   * so the component is self-describing anywhere it is dropped; BranchCard
   * turns it off because the card already prints all three directly beneath,
   * and saying it twice in one card reads as a bug rather than a design.
   */
  showLabel?: boolean;
  className?: string;
}

function initials(name: string) {
  return name
    .replace(/^TIPU\s+/i, "")
    .replace(/\bBranch\b|\bChapter\b/gi, "")
    .trim()
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Stands in for a branch photograph that doesn't exist yet.
 *
 * This is deliberately *not* a grey box. A branch without a photograph is a
 * real branch whose archive is simply still being built, and the card has to
 * say that without looking broken or unfinished. So the placeholder is drawn in
 * the community's own identity — purple ground, gold rule, the TIPU emblem, an
 * ivory monogram — and occupies exactly the same frame as a photograph would.
 *
 * It never uses stock photography or a generated city skyline: nothing here can
 * be mistaken for a picture of the actual branch.
 */
export function BranchMediaPlaceholder({
  branchName,
  region,
  acronym,
  statusMessage = BRANCH_PLACEHOLDER_MESSAGE,
  size = "card",
  showLabel = true,
  className,
}: BranchMediaPlaceholderProps) {
  const monogram = acronym ?? initials(branchName);
  const compact = size === "compact";
  const labelled = showLabel && !compact;

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-purple-700 text-center",
        className,
      )}
      // Decorative: the branch name and status are announced by the card's own
      // text, so this artwork must not be read out twice.
      role="presentation"
    >
      {/* Woven diagonal texture, echoing the community's striped cloth. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, var(--color-gold-500) 0 1px, transparent 1px 14px)",
        }}
      />
      {/* Warm centre glow so the flat purple doesn't read as a dead panel. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 15%, rgba(232,199,102,0.22) 0%, rgba(42,15,73,0) 62%)",
        }}
      />
      {/* Inset gold hairline frame. */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute rounded-xl border border-gold-500/35",
          compact ? "inset-2" : "inset-3 sm:inset-4",
        )}
      />
      {/* Community-green footing, tying the placeholder to the full palette. */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-community-green" />

      <div className={cn("relative flex flex-col items-center", compact ? "gap-1.5 px-3" : "gap-3 px-6")}>
        <span
          className={cn(
            "relative shrink-0 overflow-hidden rounded-full bg-ivory/95 ring-1 ring-gold-500/50",
            compact ? "h-7 w-7" : "h-11 w-11",
          )}
        >
          <Image
            src="/images/takete-ide/tipu-emblem.png"
            alt=""
            fill
            sizes={compact ? "28px" : "44px"}
            className="object-contain p-0.5"
          />
        </span>

        <span
          className={cn(
            "font-serif font-bold tracking-[0.14em] text-gold-300",
            compact ? "text-base" : "text-2xl sm:text-3xl",
          )}
        >
          {monogram}
        </span>

        {labelled && (
          <>
            <span className="mt-0.5 h-px w-10 bg-gold-500/60" aria-hidden="true" />
            <span className="font-serif text-base font-bold leading-snug text-white sm:text-lg">
              {branchName}
            </span>
            {region && <span className="text-xs font-medium text-gold-300/90">{region}</span>}
            <span className="mt-2 rounded-full bg-ivory/10 px-3 py-1 text-[0.7rem] font-medium text-white/80 ring-1 ring-inset ring-ivory/15">
              {statusMessage}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
