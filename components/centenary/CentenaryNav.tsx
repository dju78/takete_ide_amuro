import Link from "next/link";
import { cn } from "@/lib/utils";

interface CentenaryNavProps {
  className?: string;
}

const NAV_LINKS = [
  { label: "Overview", href: "#overview" },
  { label: "Programme", href: "#programme" },
  { label: "Guests & Hosts", href: "#guests" },
  { label: "Highlights", href: "#highlights" },
  { label: "Official Invitation", href: "#invitation" },
  { label: "Why 2026 Matters", href: "#history" },
  { label: "Centenary Attire", href: "#attire" },
  { label: "Homecoming", href: "#diaspora" },
  { label: "Gallery", href: "#gallery" },
  { label: "RSVP & Enquiries", href: "#rsvp" },
  { label: "Support & Contribution", href: "#support" },
];

export function CentenaryNav({ className }: CentenaryNavProps) {
  return (
    <nav
      aria-label="Centenary sections"
      className={cn(
        "sticky top-16 z-20 -mx-4 overflow-x-auto border-b border-purple-600/10 bg-white/95 px-4 py-3 backdrop-blur-md sm:mx-0 sm:rounded-2xl sm:border sm:px-6 sm:shadow-sm",
        className,
      )}
    >
      <ul className="flex items-center gap-1.5 min-w-max text-xs font-semibold sm:gap-2 sm:text-sm">
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-block rounded-xl px-3 py-1.5 text-charcoal/80 transition hover:bg-purple-50 hover:text-purple-700 active:bg-purple-100"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
