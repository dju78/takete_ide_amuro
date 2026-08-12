"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { GalleryCard } from "@/components/cards/GalleryCard";
import type { GalleryItem } from "@/types/content";

export function GalleryLightbox({ items }: { items: GalleryItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const showPrev = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length)),
    [items.length],
  );
  const showNext = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i + 1) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (activeIndex === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [activeIndex, close, showPrev, showNext]);

  if (items.length === 0) return null;
  const active = activeIndex !== null ? items[activeIndex] : null;

  return (
    <>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item, i) => (
          <GalleryCard key={item.id} item={item} onSelect={() => setActiveIndex(i)} />
        ))}
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
