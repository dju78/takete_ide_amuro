import Image from "next/image";
import { cn } from "@/lib/utils";
import type { GalleryItem } from "@/types/content";

export function GalleryCard({
  item,
  onSelect,
  className,
  sizes = "(min-width: 1024px) 25vw, 50vw",
}: {
  item: GalleryItem;
  onSelect?: () => void;
  className?: string;
  sizes?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group relative aspect-square w-full overflow-hidden rounded-xl bg-purple-50 focus-visible:outline-offset-4",
        className,
      )}
      aria-label={item.caption ?? item.title ?? "View photograph"}
    >
      <Image
        src={item.image_url}
        alt={item.alt_text}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {item.caption && (
        <span className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/70 to-transparent p-3 text-left text-xs text-white transition-transform duration-200 group-hover:translate-y-0">
          {item.caption}
        </span>
      )}
    </button>
  );
}
