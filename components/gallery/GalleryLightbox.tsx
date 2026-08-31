"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { GalleryCard } from "@/components/cards/GalleryCard";
import { cn } from "@/lib/utils";
import type { GalleryItem } from "@/types/content";

/**
 * `variant` controls the grid only — the lightbox behaves identically either way.
 *  - "grid"      — uniform thumbnails, used by the main /gallery page.
 *  - "editorial" — the first photograph leads at 2x2, used by event story pages
 *                  where one image carries the story and the rest support it.
 */
export function GalleryLightbox({
  items,
  variant = "grid",
  columns = 4,
}: {
  items: GalleryItem[];
  variant?: "grid" | "editorial";
  /** Widest-breakpoint column count. Three suits a short set that would otherwise leave a hole. */
  columns?: 3 | 4;
}) {
  const photoItems = items.filter((item) => !item.is_placeholder);
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeIndex = activeId !== null ? photoItems.findIndex((p) => p.id === activeId) : -1;
  const active = activeIndex !== -1 ? photoItems[activeIndex] : null;

  const close = () => setActiveId(null);
  const showPrev = () => {
    if (activeIndex === -1 || photoItems.length === 0) return;
    const prevIdx = (activeIndex - 1 + photoItems.length) % photoItems.length;
    setActiveId(photoItems[prevIdx].id);
  };

  const showNext = () => {
    if (activeIndex === -1 || photoItems.length === 0) return;
    const nextIdx = (activeIndex + 1) % photoItems.length;
    setActiveId(photoItems[nextIdx].id);
  };

  useEffect(() => {
    if (active === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveId(null);
      }
      if (e.key === "ArrowLeft" && activeIndex !== -1 && photoItems.length > 0) {
        const prevIdx = (activeIndex - 1 + photoItems.length) % photoItems.length;
        setActiveId(photoItems[prevIdx].id);
      }
      if (e.key === "ArrowRight" && activeIndex !== -1 && photoItems.length > 0) {
        const nextIdx = (activeIndex + 1) % photoItems.length;
        setActiveId(photoItems[nextIdx].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, activeIndex, photoItems]);

  if (items.length === 0) return null;

  return (
    <>
      <div
        className={cn(
          "mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3",
          columns === 4 && "lg:grid-cols-4",
        )}
      >
        {items.map((item, i) => {
          const isLead = variant === "editorial" && i === 0;
          return (
            <GalleryCard
              key={item.id}
              item={item}
              onSelect={() => setActiveId(item.id)}
              className={isLead ? "col-span-2 row-span-2" : undefined}
              sizes={
                isLead
                  ? "(min-width: 1024px) 50vw, 100vw"
                  : columns === 4
                    ? "(min-width: 1024px) 25vw, 50vw"
                    : "(min-width: 640px) 33vw, 50vw"
              }
            />
          );
        })}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.caption ?? active.title ?? "Photograph"}
          className="fixed inset-0 z-50 flex flex-col bg-black/90 p-4"
        >
          <div className="flex justify-end">
            <button type="button" onClick={close} aria-label="Close" className="rounded-full p-2 text-white hover:bg-white/10">
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="relative flex flex-1 items-center justify-center">
            <button
              type="button"
              onClick={showPrev}
              aria-label="Previous photograph"
              className="absolute left-0 z-10 rounded-full p-2 text-white hover:bg-white/10 sm:left-4"
            >
              <ChevronLeft className="h-8 w-8" aria-hidden="true" />
            </button>
            <div className="relative h-full max-h-[75vh] w-full max-w-4xl">
              <Image src={active.image_url} alt={active.alt_text} fill sizes="90vw" className="object-contain" />
            </div>
            <button
              type="button"
              onClick={showNext}
              aria-label="Next photograph"
              className="absolute right-0 z-10 rounded-full p-2 text-white hover:bg-white/10 sm:right-4"
            >
              <ChevronRight className="h-8 w-8" aria-hidden="true" />
            </button>
          </div>
          {active.caption && <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-white/80">{active.caption}</p>}
        </div>
      )}
    </>
  );
}
