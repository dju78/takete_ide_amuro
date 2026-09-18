"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Eye } from "lucide-react";

export interface SettlementPhoto {
  id: string;
  src: string;
  title: string;
  alt: string;
  caption: string;
}

export function SettlementProgressGallery({
  editorialPhotos,
  gridPhotos,
}: {
  editorialPhotos: SettlementPhoto[];
  gridPhotos: SettlementPhoto[];
}) {
  const allPhotos = [...editorialPhotos, ...gridPhotos];
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeIndex = activeId !== null ? allPhotos.findIndex((p) => p.id === activeId) : -1;
  const active = activeIndex !== -1 ? allPhotos[activeIndex] : null;

  const close = () => setActiveId(null);
  const showPrev = () => {
    if (activeIndex === -1 || allPhotos.length === 0) return;
    const prevIdx = (activeIndex - 1 + allPhotos.length) % allPhotos.length;
    setActiveId(allPhotos[prevIdx].id);
  };
  const showNext = () => {
    if (activeIndex === -1 || allPhotos.length === 0) return;
    const nextIdx = (activeIndex + 1) % allPhotos.length;
    setActiveId(allPhotos[nextIdx].id);
  };

  useEffect(() => {
    if (active === null) return;
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
  }, [active, activeIndex, allPhotos]);

  return (
    <>
      {/* SECTION 1: Editorial Layout */}
      <section>
        <div className="border-b border-purple-100 pb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-gold-700">Section 01</p>
          <h2 className="mt-1 font-serif text-2xl font-bold text-purple-950 sm:text-3xl">
            A Changing Built Environment
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-charcoal/80 sm:text-base">
            The built environment of Takete-Ide reflects both continuity and change. Alongside
            long-established homes and community spaces, newer residential buildings are becoming
            part of the settlement landscape.
          </p>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-charcoal/80 sm:text-base">
            These developments provide a visible record of how housing styles, construction materials
            and residential spaces are changing within the community.
          </p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Lead Photo: spans 2 cols on lg */}
          {editorialPhotos[0] && (
            <button
              type="button"
              onClick={() => setActiveId(editorialPhotos[0].id)}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-purple-600/10 bg-white text-left shadow-sm transition hover:shadow-md sm:col-span-2 lg:col-span-2"
              aria-label={`View ${editorialPhotos[0].title}`}
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-purple-50">
                <Image
                  src={editorialPhotos[0].src}
                  alt={editorialPhotos[0].alt}
                  fill
                  priority
                  sizes="(min-width: 1280px) 760px, (min-width: 1024px) 66vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-950/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-xs">
                  <Eye className="h-3.5 w-3.5" aria-hidden="true" /> Click to enlarge
                </span>
              </div>
              <div className="p-6">
                <span className="inline-block rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700">
                  Featured Residential Development
                </span>
                <h3 className="mt-2 font-serif text-lg font-bold text-purple-950 sm:text-xl">
                  {editorialPhotos[0].title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-charcoal/75 sm:text-sm">
                  {editorialPhotos[0].caption}
                </p>
              </div>
            </button>
          )}

          {/* Supporting editorial photos */}
          {editorialPhotos.slice(1).map((photo) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setActiveId(photo.id)}
              className="group flex flex-col overflow-hidden rounded-3xl border border-purple-600/10 bg-white text-left shadow-sm transition hover:shadow-md"
              aria-label={`View ${photo.title}`}
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-purple-50">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 1280px) 380px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-103"
                />
              </div>
              <div className="p-5">
                <h3 className="font-serif text-base font-bold text-purple-950">{photo.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-charcoal/75">{photo.caption}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* SECTION 2: Contemporary Residential Development Grid */}
      <section className="mt-16">
        <div className="border-b border-purple-100 pb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-gold-700">Section 02</p>
          <h2 className="mt-1 font-serif text-2xl font-bold text-purple-950 sm:text-3xl">
            Contemporary Residential Development
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-charcoal/80 sm:text-base">
            Modern residential buildings now form part of the visual character of Takete-Ide.
            The photographs below document examples of contemporary housing within the community.
          </p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gridPhotos.map((photo) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setActiveId(photo.id)}
              className="group flex flex-col overflow-hidden rounded-3xl border border-purple-600/10 bg-white text-left shadow-sm transition hover:shadow-md"
              aria-label={`View ${photo.title}`}
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-purple-50">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1280px) 380px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-103"
                />
              </div>
              <div className="p-5">
                <h3 className="font-serif text-base font-bold text-purple-950">{photo.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-charcoal/75">{photo.caption}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          className="fixed inset-0 z-50 flex flex-col bg-black/92 p-4 backdrop-blur-xs"
        >
          <div className="flex items-center justify-between px-2 pt-2 sm:px-6">
            <span className="text-xs font-semibold text-white/70">
              {activeIndex + 1} of {allPhotos.length}
            </span>
            <button
              type="button"
              onClick={close}
              aria-label="Close lightbox"
              className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center">
            <button
              type="button"
              onClick={showPrev}
              aria-label="Previous photograph"
              className="absolute left-2 z-10 rounded-full bg-black/50 p-2.5 text-white transition hover:bg-black/80 sm:left-6"
            >
              <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" aria-hidden="true" />
            </button>

            <div className="relative aspect-[16/9] max-h-[72vh] w-full max-w-5xl">
              <Image
                src={active.src}
                alt={active.alt}
                fill
                sizes="(min-width: 1280px) 1024px, 95vw"
                className="object-contain"
              />
            </div>

            <button
              type="button"
              onClick={showNext}
              aria-label="Next photograph"
              className="absolute right-2 z-10 rounded-full bg-black/50 p-2.5 text-white transition hover:bg-black/80 sm:right-6"
            >
              <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" aria-hidden="true" />
            </button>
          </div>

          <div className="mx-auto max-w-2xl px-4 py-3 text-center text-white">
            <h3 className="font-serif text-base font-bold sm:text-lg">{active.title}</h3>
            <p className="mt-1 text-xs text-white/80 sm:text-sm">{active.caption}</p>
          </div>
        </div>
      )}
    </>
  );
}
