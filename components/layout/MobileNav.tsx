"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { primaryNav, moreNav } from "@/lib/site-config";

export function MobileNav({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const allItems = [...primaryNav, ...moreNav];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden" role="dialog" aria-modal="true">
      <div className="flex h-20 items-center justify-between border-b border-purple-600/10 px-4">
        <Logo />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="rounded-full p-2 text-purple-600 hover:bg-purple-50"
        >
          <X className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-4 py-6">
        <ul className="flex flex-col gap-1">
          {allItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onClose}
                className="block rounded-xl px-4 py-3 text-base font-medium text-charcoal hover:bg-purple-50 hover:text-purple-600"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <ButtonLink href="/get-involved" onClick={onClose} className="mt-6 w-full justify-center">
          Get Involved
        </ButtonLink>
      </nav>
    </div>
  );
}
