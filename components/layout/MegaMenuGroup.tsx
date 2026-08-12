"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ChevronDown, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavGroup } from "@/lib/site-config";

export function MegaMenuGroup({ group, isActive }: { group: NavGroup; isActive: boolean }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const featured = group.items.filter((i) => i.featured);
  const rest = group.items.filter((i) => !i.featured);
  const wide = group.items.length > 5;

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className={cn(
          "flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-charcoal/80 transition-colors hover:bg-purple-50 hover:text-purple-600",
          isActive && "bg-purple-50 text-purple-600 font-semibold",
        )}
      >
        {group.heading}
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>

      {open && (
        <div
          className={cn(
            "absolute left-0 top-full z-50 mt-1 rounded-2xl border border-purple-600/10 bg-white p-4 shadow-2xl animate-fade-in",
            wide ? "w-[560px]" : "w-72",
          )}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          {featured.length > 0 && (
            <div className="mb-3 grid gap-2 sm:grid-cols-2">
              {featured.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-2 rounded-xl border border-gold-500/40 bg-gold-100/50 p-3 transition-colors hover:bg-gold-100"
                >
                  <Star className="mt-0.5 h-4 w-4 shrink-0 text-gold-700" aria-hidden="true" />
                  <span>
                    <span className="block text-sm font-semibold text-purple-600">{item.label}</span>
                    {item.description && <span className="block text-xs text-charcoal/60">{item.description}</span>}
                  </span>
                </Link>
              ))}
            </div>
          )}
          <div className={cn("grid gap-0.5", wide && "sm:grid-cols-2")}>
            {rest.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-2.5 text-sm hover:bg-purple-50"
              >
                <span className="font-medium text-charcoal">{item.label}</span>
                {item.description && <span className="block text-xs text-charcoal/60">{item.description}</span>}
              </Link>
            ))}
          </div>
          <Link
            href={group.href}
            onClick={() => setOpen(false)}
            className="mt-3 block border-t border-purple-600/10 pt-3 text-sm font-semibold text-community-green hover:underline"
          >
            View all {group.heading} →
          </Link>
        </div>
      )}
    </div>
  );
}
