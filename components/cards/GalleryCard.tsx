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
  if (item.is_placeholder) {
    return (
      <div
        className={cn(
          "relative flex aspect-square w-full flex-col items-center justify-center overflow-hidden rounded-xl bg-purple-700 p-4 text-center text-white shadow-sm",
          className,
        )}
      >
        {/* Woven diagonal texture */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, var(--color-gold-500) 0 1px, transparent 1px 14px)",
          }}
        />
        {/* Centre glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 15%, rgba(232,199,102,0.22) 0%, rgba(42,15,73,0) 62%)",
          }}
        />
        {/* Inset gold frame */}
        <div
          aria-hidden="true"
          className="absolute inset-2.5 rounded-lg border border-gold-500/35"
        />
        {/* Footing */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-community-green" />

        <div className="relative z-10 flex flex-col items-center gap-1.5 px-2">
          <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-ivory/95 ring-1 ring-gold-500/50">
            <Image
              src="/images/takete-ide/tipu-emblem.png"
              alt=""
              fill
              sizes="32px"
              className="object-contain p-0.5"
            />
          </span>
          <span className="font-serif text-sm font-bold leading-tight text-white sm:text-base">
            {item.placeholder_title ?? item.title ?? "Takete-Ide Archive"}
          </span>
          <span className="rounded-full bg-ivory/10 px-2 py-0.5 text-[0.65rem] font-medium text-gold-300 ring-1 ring-inset ring-ivory/15">
            {item.placeholder_subtitle ?? "Authentic photograph coming soon"}
          </span>
        </div>
      </div>
    );
  }

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
        style={{ objectPosition: item.object_position ?? "center" }}
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
