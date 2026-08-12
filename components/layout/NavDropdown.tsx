"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/site-config";

export function NavDropdown({ label, items, align = "left" }: { label: string; items: NavItem[]; align?: "left" | "right" }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-charcoal/80 transition-colors hover:bg-purple-50 hover:text-purple-600"
      >
        {label}
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>
      {open && (
        <div
          className={cn(
            "absolute top-full w-72 rounded-2xl border border-purple-600/10 bg-white p-2 shadow-xl animate-fade-in",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {items.map((item) => (
            <Link key={item.href} href={item.href} className="block rounded-xl px-4 py-2.5 text-sm hover:bg-purple-50">
              <span className="font-medium text-charcoal">{item.label}</span>
              {item.description && <span className="block text-xs text-charcoal/60">{item.description}</span>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
