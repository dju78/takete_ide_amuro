"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, Gamepad2 } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { MobileNav } from "@/components/layout/MobileNav";
import { MegaMenuGroup } from "@/components/layout/MegaMenuGroup";
import { ButtonLink } from "@/components/ui/Button";
import { navGroups } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function Header({ weatherSlot }: { weatherSlot?: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-purple-600/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 min-[1320px]:h-20 lg:px-8">
          <Logo />

          <nav aria-label="Primary" className="hidden items-center gap-1 min-[1320px]:flex">
            <Link
              href="/"
              className={cn(
                "flex items-center rounded-full px-3 py-2 text-sm font-medium text-charcoal/80 transition-colors hover:bg-purple-50 hover:text-purple-600",
                pathname === "/" && "bg-purple-50 text-purple-600 font-semibold",
              )}
            >
              Home
            </Link>
            {navGroups.map((group) => (
              <div key={group.heading} className="flex items-center gap-1">
                <MegaMenuGroup
                  group={group}
                  isActive={pathname.startsWith(group.href) || group.items.some((i) => pathname.startsWith(i.href))}
                />
                {group.heading === "Explore" && (
                  <Link
                    href="/kogi-quest"
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
                      pathname === "/kogi-quest"
                        ? "bg-purple-100 font-bold text-purple-900 ring-1 ring-purple-600/40 shadow-xs"
                        : "bg-gold-50/80 text-purple-900 ring-1 ring-gold-400/50 hover:bg-gold-100 hover:text-purple-950",
                    )}
                  >
                    <Gamepad2 className="h-4 w-4 text-purple-700 shrink-0" aria-hidden="true" />
                    <span>Play Kogi Quest</span>
                  </Link>
                )}
              </div>
            ))}
            <Link
              href="/weather"
              className={cn(
                "flex items-center rounded-full px-3 py-2 text-sm font-medium text-charcoal/80 transition-colors hover:bg-purple-50 hover:text-purple-600",
                pathname === "/weather" && "bg-purple-50 text-purple-600 font-semibold",
              )}
            >
              Weather
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {weatherSlot}
            <Link
              href="/search"
              aria-label="Search the site"
              className="hidden rounded-full p-2 text-charcoal/70 hover:bg-purple-50 hover:text-purple-600 min-[1320px]:inline-flex"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </Link>
            <ButtonLink href="/get-involved" size="sm" className="hidden sm:inline-flex">
              Get Involved
            </ButtonLink>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="rounded-full p-2 text-purple-600 hover:bg-purple-50 min-[1320px]:hidden"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && <MobileNav onClose={() => setMobileOpen(false)} />}
    </>
  );
}
