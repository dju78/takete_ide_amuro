import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  const allCrumbs: Crumb[] = [{ label: "Home", href: "/" }, ...items];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allCrumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.label,
      ...(crumb.href ? { item: `${siteConfig.url}${crumb.href === "/" ? "" : crumb.href}` } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* min-h-6 on each link: breadcrumbs are standalone navigation, not links
          inside a sentence, so they are not exempt from the minimum target size.

          Colour is inherited from the surrounding text rather than fixed, so the
          trail stays legible both on the ivory page background (charcoal text)
          and inside the purple hero banners (white text) — most pages place it
          in a hero. Muting uses opacity, which keeps AA contrast in both
          contexts; see tests/e2e/breadcrumb-contrast.spec.ts. */}
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className="inline-flex min-h-6 items-center py-0.5 opacity-80 underline-offset-4 transition-opacity hover:underline hover:opacity-100">
            Home
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
            {item.href && i !== items.length - 1 ? (
              <Link href={item.href} className="inline-flex min-h-6 items-center py-0.5 opacity-80 underline-offset-4 transition-opacity hover:underline hover:opacity-100">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-semibold">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
