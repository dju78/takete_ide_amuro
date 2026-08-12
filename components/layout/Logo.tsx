import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ dark = false, className }: { dark?: boolean; className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-3 shrink-0", className)}>
      <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-white ring-2 ring-gold-500/60">
        <Image
          src="/images/takete-ide/tipu-emblem.png"
          alt=""
          aria-hidden="true"
          fill
          sizes="44px"
          className="object-contain p-0.5"
        />
      </span>
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
