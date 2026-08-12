"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { MobileNav } from "@/components/layout/MobileNav";
import { ButtonLink } from "@/components/ui/Button";
import { primaryNav, moreNav } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function Header({ weatherSlot }: { weatherSlot?: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-purple-600/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-3 py-2 text-sm font-medium text-charcoal/80 transition-colors hover:bg-purple-50 hover:text-purple-600",
                isActive(item.href) && "text-purple-600 font-semibold",
              )}
            >
              {item.label}
            </Link>
          ))}

          <div
            className="relative"
            onMouseEnter={() => setMoreOpen(true)}
            onMouseLeave={() => setMoreOpen(false)}
          >
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              aria-expanded={moreOpen}
              className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-charcoal/80 transition-colors hover:bg-purple-50 hover:text-purple-600"
            >
              More
              <ChevronDown className={cn("h-4 w-4 transition-transform", moreOpen && "rotate-180")} aria-hidden="true" />
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-full w-72 rounded-2xl border border-purple-600/10 bg-white p-2 shadow-xl animate-fade-in">
                {moreNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-xl px-4 py-2.5 text-sm hover:bg-purple-50"
                  >
                    <span className="font-medium text-charcoal">{item.label}</span>
                    {item.description && (
                      <span className="block text-xs text-charcoal/60">{item.description}</span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-3">
          {weatherSlot}
          <ButtonLink href="/get-involved" size="sm" className="hidden sm:inline-flex">
            Get Involved
          </ButtonLink>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="rounded-full p-2 text-purple-600 hover:bg-purple-50 lg:hidden"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>

      {mobileOpen && <MobileNav onClose={() => setMobileOpen(false)} />}
    </header>
  );
}
