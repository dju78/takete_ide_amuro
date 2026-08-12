import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ dark = false, className }: { dark?: boolean; className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-3 shrink-0", className)}>
      <svg
        viewBox="0 0 48 48"
        aria-hidden="true"
        className="h-11 w-11 shrink-0"
      >
        <circle cx="24" cy="24" r="23" fill={dark ? "#FFF9EF" : "#321357"} stroke="#D4A72C" strokeWidth="2" />
        <path
          d="M24 11c-4 4-9 6-9 12s4 11 9 14c5-3 9-8 9-14s-5-8-9-12Z"
          fill={dark ? "#321357" : "#D4A72C"}
        />
        <circle cx="24" cy="24" r="3.2" fill={dark ? "#FFF9EF" : "#321357"} />
      </svg>
      <span className="flex flex-col leading-tight">
        <span className={cn("font-serif text-lg font-bold sm:text-xl", dark ? "text-white" : "text-purple-600")}>
          Takete-Ide Amuro
        </span>
        <span className={cn("text-[11px] font-medium uppercase tracking-[0.15em] sm:text-xs", dark ? "text-gold-300" : "text-gold-700")}>
          Heritage &middot; Unity &middot; Progress
        </span>
      </span>
    </Link>
  );
}
