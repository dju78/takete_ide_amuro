"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, Eye, Mountain, Users, Camera, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export interface SettlementPhoto {
  id: string;
  src: string;
  title: string;
  alt: string;
  caption: string;
}

interface SettlementProgressGalleryProps {
  heroPhoto: SettlementPhoto;
  changingEnvironmentPhotos: SettlementPhoto[];
  residentialPhotosRow1: SettlementPhoto[];
  residentialPhotosRow2: SettlementPhoto[];
}

export function SettlementProgressGallery({
  heroPhoto,
  changingEnvironmentPhotos,
  residentialPhotosRow1,
  residentialPhotosRow2,
}: SettlementProgressGalleryProps) {
  // Ordered list of all unique photos for the lightbox
  const allPhotos = useMemo<SettlementPhoto[]>(
    () => [
      heroPhoto,
      ...changingEnvironmentPhotos,
      ...residentialPhotosRow1,
      ...residentialPhotosRow2,
    ],
    [heroPhoto, changingEnvironmentPhotos, residentialPhotosRow1, residentialPhotosRow2],
  );

  const [activeId, setActiveId] = useState<string | null>(null);

  const activeIndex = activeId !== null ? allPhotos.findIndex((p) => p.id === activeId) : -1;
  const active = activeIndex !== -1 ? allPhotos[activeIndex] : null;

  const close = useCallback(() => setActiveId(null), []);
  const showPrev = useCallback(() => {
    if (activeIndex === -1 || allPhotos.length === 0) return;
    const prevIdx = (activeIndex - 1 + allPhotos.length) % allPhotos.length;
    setActiveId(allPhotos[prevIdx].id);
  }, [activeIndex, allPhotos]);

  const showNext = useCallback(() => {
    if (activeIndex === -1 || allPhotos.length === 0) return;
    const nextIdx = (activeIndex + 1) % allPhotos.length;
    setActiveId(allPhotos[nextIdx].id);
  }, [activeIndex, allPhotos]);

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
  }, [active, close, showPrev, showNext]);

  return (
    <div className="bg-[#FCFBF8] text-charcoal">
      {/* 1. HERO SECTION */}
      <section className="pt-6 pb-12 sm:pt-8 sm:pb-16">
        <Container className="max-w-6xl">
          {/* Breadcrumb row */}
          <Breadcrumb
            items={[
              { label: "Development", href: "/development" },
              { label: "Settlement & Community Progress" },
            ]}
          />

          {/* Split Hero Layout */}
          <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Text (approx 40%) */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="w-12 h-1 bg-gold-500 rounded-full mb-3.5" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-600">
                TAKETE-IDE TODAY
              </p>
              <h1 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-purple-950 leading-[1.15]">
                Settlement &amp;
                <br className="hidden sm:inline" /> Community Progress
              </h1>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-charcoal/80">
                Documenting the changing built environment of Takete-Ide, from contemporary residential
                development to the evolving community landscape.
              </p>
              <p className="mt-3 text-xs sm:text-sm italic text-charcoal/70">
                Our community continues to grow, building on our heritage for tomorrow.
              </p>
            </div>

            {/* Right Column: Large Landscape Photograph (approx 60%) */}
            <div className="lg:col-span-7">
              <button
                type="button"
                onClick={() => setActiveId(heroPhoto.id)}
                className="group relative block w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-purple-900/10 shadow-sm transition-all duration-300 hover:shadow-md text-left"
                aria-label={`View ${heroPhoto.title}`}
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-purple-50">
                  <Image
                    src={heroPhoto.src}
                    alt={heroPhoto.alt}
                    fill
                    priority
                    sizes="(min-width: 1280px) 700px, (min-width: 1024px) 60vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-102"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 inline-flex items-center gap-1.5 rounded-lg bg-black/65 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-xs">
                    <Eye className="h-3.5 w-3.5 text-gold-300" aria-hidden="true" />
                    <span>A modern residential development in Takete-Ide</span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. SECTION — A CHANGING BUILT ENVIRONMENT */}
      <section className="border-t border-purple-900/5 bg-white py-12 sm:py-16">
        <Container className="max-w-6xl">
          <div className="w-12 h-1 bg-gold-500 rounded-full mb-3" />
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-purple-950">
            A Changing Built Environment
          </h2>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left column: Narrative body */}
            <div className="lg:col-span-5 text-charcoal/80 space-y-4">
              <p className="text-sm sm:text-base leading-relaxed">
                Takete-Ide continues to evolve as its physical settlement develops. New residential
                buildings, improved building materials and changing housing styles can be seen across
                different parts of the community.
              </p>
              <p className="text-sm sm:text-base leading-relaxed">
                These developments provide a visible record of how the built environment is changing within
                Takete-Ide, while complementing its rich history and heritage.
              </p>
            </div>

            {/* Right column: Two side-by-side photographs */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {changingEnvironmentPhotos.map((photo) => (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => setActiveId(photo.id)}
                    className="group flex flex-col overflow-hidden rounded-xl border border-purple-900/10 bg-white text-left shadow-xs transition hover:shadow-md"
                    aria-label={`View ${photo.title}`}
                  >
                    <div className="relative aspect-[16/11] w-full overflow-hidden bg-purple-50">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        loading="lazy"
                        sizes="(min-width: 1280px) 340px, (min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-103"
                      />
                    </div>
                    <div className="p-3.5 bg-white border-t border-purple-900/5">
                      <p className="text-xs sm:text-sm font-medium text-charcoal/85 leading-snug">
                        {photo.caption}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. SECTION — CONTEMPORARY RESIDENTIAL DEVELOPMENT */}
      <section className="border-t border-purple-900/5 bg-[#F9F7F4] py-12 sm:py-16">
        <Container className="max-w-6xl">
          <div className="w-12 h-1 bg-gold-500 rounded-full mb-3" />
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-purple-950">
            Contemporary Residential Development
          </h2>
          <p className="mt-2 text-sm sm:text-base text-charcoal/80 max-w-3xl">
            A selection of contemporary buildings from across Takete-Ide, showing the variety of
            residential development within the community.
          </p>

          {/* Row 1: 3 equal images */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {residentialPhotosRow1.map((photo) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setActiveId(photo.id)}
                className="group flex flex-col overflow-hidden rounded-xl border border-purple-900/10 bg-white text-left shadow-xs transition hover:shadow-md"
                aria-label={`View ${photo.title}`}
              >
                <div className="relative aspect-[16/11] w-full overflow-hidden bg-purple-50">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    loading="lazy"
                    sizes="(min-width: 1280px) 360px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-103"
                  />
                </div>
                <div className="p-3.5 bg-white border-t border-purple-900/5">
                  <p className="text-xs sm:text-sm font-medium text-charcoal/85 leading-snug">
                    {photo.caption}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Row 2: 3 images / 2 wide + 1 */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {residentialPhotosRow2.map((photo) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setActiveId(photo.id)}
                className="group flex flex-col overflow-hidden rounded-xl border border-purple-900/10 bg-white text-left shadow-xs transition hover:shadow-md"
                aria-label={`View ${photo.title}`}
              >
                <div className="relative aspect-[16/11] w-full overflow-hidden bg-purple-50">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    loading="lazy"
                    sizes="(min-width: 1280px) 360px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-103"
                  />
                </div>
                <div className="p-3.5 bg-white border-t border-purple-900/5">
                  <p className="text-xs sm:text-sm font-medium text-charcoal/85 leading-snug">
                    {photo.caption}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. SECTION — DOCUMENTING COMMUNITY CHANGE & RELATED CARDS */}
      <section className="border-t border-purple-900/5 bg-[#F4EFE6] py-12 sm:py-16">
        <Container className="max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left: Documentary text */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="w-12 h-1 bg-gold-500 rounded-full mb-3" />
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-purple-950">
                Documenting Community Change
              </h2>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-charcoal/80">
                These photographs form part of the Takete-Ide digital archive, recording the physical
                development of our community over time. By documenting the evolving built environment, we
                preserve a visual record for current and future generations, alongside the people, places
                and heritage that make Takete-Ide unique.
              </p>
            </div>

            {/* Right: 3 compact related-page cards */}
            <div className="lg:col-span-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-purple-950 mb-3 text-center sm:text-left">
                Explore Related Pages
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* Card 1: Land & Landscape */}
                <Link
                  href="/heritage/land-and-landscape"
                  className="group flex flex-col items-center justify-between rounded-2xl border border-purple-900/10 bg-white p-4 text-center shadow-xs transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700 transition group-hover:bg-purple-100">
                      <Mountain className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h4 className="mt-2.5 text-sm font-bold text-purple-950">Land &amp; Landscape</h4>
                    <p className="mt-1 text-xs text-charcoal/70 leading-snug">
                      Explore the natural beauty of Takete-Ide
                    </p>
                  </div>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-purple-700 group-hover:text-purple-900">
                    View <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </Link>

                {/* Card 2: Development */}
                <Link
                  href="/development"
                  className="group flex flex-col items-center justify-between rounded-2xl border border-purple-900/10 bg-white p-4 text-center shadow-xs transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700 transition group-hover:bg-purple-100">
                      <Users className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h4 className="mt-2.5 text-sm font-bold text-purple-950">Development</h4>
                    <p className="mt-1 text-xs text-charcoal/70 leading-snug">
                      Community growth and infrastructure
                    </p>
                  </div>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-purple-700 group-hover:text-purple-900">
                    View <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </Link>

                {/* Card 3: Gallery */}
                <Link
                  href="/gallery"
                  className="group flex flex-col items-center justify-between rounded-2xl border border-purple-900/10 bg-white p-4 text-center shadow-xs transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700 transition group-hover:bg-purple-100">
                      <Camera className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h4 className="mt-2.5 text-sm font-bold text-purple-950">Gallery</h4>
                    <p className="mt-1 text-xs text-charcoal/70 leading-snug">
                      More photos from our community
                    </p>
                  </div>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-purple-700 group-hover:text-purple-900">
                    View <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. LIGHTBOX MODAL */}
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
    </div>
  );
}

