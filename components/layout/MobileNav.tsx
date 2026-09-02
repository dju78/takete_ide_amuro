"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, ChevronDown, Star } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { navGroups } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function MobileNav({ onClose }: { onClose: () => void }) {
  const [openGroup, setOpenGroup] = useState<string | null>(navGroups[0]?.heading ?? null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white min-[1320px]:hidden" role="dialog" aria-modal="true" aria-label="Site navigation">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-purple-600/10 px-5">
        <Logo />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex h-11 w-11 items-center justify-center rounded-full text-purple-600 hover:bg-purple-50"
        >
          <X className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-6">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            onClick={onClose}
            className="flex min-h-11 flex-1 items-center rounded-xl px-3 text-base font-semibold text-purple-600 hover:bg-purple-50"
          >
            Home
          </Link>
          <Link
            href="/weather"
            onClick={onClose}
            className="flex min-h-11 flex-1 items-center rounded-xl px-3 text-base font-semibold text-purple-600 hover:bg-purple-50"
          >
            Weather
          </Link>
        </div>

        <div className="mt-4 flex flex-col gap-1">
          {navGroups.map((group) => {
            const isOpen = openGroup === group.heading;
            return (
              <div key={group.heading} className="border-b border-purple-600/8 last:border-0">
                <button
                  type="button"
                  onClick={() => setOpenGroup(isOpen ? null : group.heading)}
                  aria-expanded={isOpen}
                  className="flex min-h-12 w-full items-center justify-between px-3 py-3 text-left text-base font-semibold text-charcoal"
                >
                  {group.heading}
                  <ChevronDown className={cn("h-5 w-5 text-charcoal/40 transition-transform", isOpen && "rotate-180")} aria-hidden="true" />
                </button>
                {isOpen && (
                  <ul className="flex flex-col gap-1 pb-4 pl-1">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className={cn(
                            "flex min-h-11 items-center gap-2 rounded-xl px-3 text-[15px] text-charcoal/75 hover:bg-purple-50",
                            item.featured && "font-semibold text-purple-600",
                          )}
                        >
                          {item.featured && <Star className="h-3.5 w-3.5 shrink-0 text-gold-700" aria-hidden="true" />}
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        <ButtonLink href="/get-involved" onClick={onClose} className="mt-8 w-full justify-center">
          Get Involved
        </ButtonLink>
      </nav>
    </div>
  );
}
