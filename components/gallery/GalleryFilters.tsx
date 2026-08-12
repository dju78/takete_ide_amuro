import Link from "next/link";
import { cn } from "@/lib/utils";

export function GalleryFilters({ categories, activeCategory }: { categories: string[]; activeCategory?: string }) {
  if (categories.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter gallery by category">
      <Link
        href="/gallery"
        className={cn(
          "rounded-full px-4 py-2 text-sm font-medium",
          !activeCategory ? "bg-purple-600 text-white" : "bg-white text-charcoal/70 hover:bg-purple-50",
        )}
      >
        All
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat}
          href={`/gallery?category=${encodeURIComponent(cat)}`}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium",
            activeCategory === cat ? "bg-purple-600 text-white" : "bg-white text-charcoal/70 hover:bg-purple-50",
          )}
        >
          {cat}
        </Link>
      ))}
    </div>
  );
}
