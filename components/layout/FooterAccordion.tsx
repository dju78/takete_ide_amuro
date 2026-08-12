"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { navGroups } from "@/lib/site-config";
import { cn } from "@/lib/utils";

/** Mobile-only footer accordion — desktop keeps the condensed heading row in Footer.tsx. */
export function FooterAccordion() {
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  return (
    <div className="lg:hidden">
      {navGroups.map((group) => {
        const isOpen = openGroup === group.heading;
        return (
          <div key={group.heading} className="border-b border-white/10 first:border-t">
            <button
              type="button"
              onClick={() => setOpenGroup(isOpen ? null : group.heading)}
              aria-expanded={isOpen}
              className="flex min-h-12 w-full items-center justify-between py-3.5 text-left text-sm font-semibold uppercase tracking-wide text-gold-300"
            >
              {group.heading}
              <ChevronDown className={cn("h-4 w-4 text-gold-300/70 transition-transform", isOpen && "rotate-180")} aria-hidden="true" />
            </button>
            {isOpen && (
              <ul className="flex flex-col gap-1 pb-4">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="flex min-h-10 items-center text-[15px] text-white/75 hover:text-white">
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
  );
}
