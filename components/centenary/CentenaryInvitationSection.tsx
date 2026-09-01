"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Maximize2, X, Download, Eye, FileText, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CentenaryInvitationSectionProps {
  className?: string;
}

export function CentenaryInvitationSection({ className }: CentenaryInvitationSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <section id="invitation" className={cn("scroll-mt-20", className)}>
      <SectionHeading
        eyebrow="Official Materials"
        title="Official Invitation"
        align="left"
        className="mx-0"
        description="Official Takete-Ide Progressive Union invitation announcing the 2026 Centenary Celebration & Development Fundraising."
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
        {/* Preview Card */}
        <div className="group relative overflow-hidden rounded-3xl border border-purple-600/15 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-6">
          <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden rounded-2xl bg-purple-950/5">
            <Image
              src="/images/takete-ide/centenary-invitation.jpg"
              alt="Official Takete-Ide Day & Centenary Celebration 2026 Invitation flyer showing celebration theme Faith, Unity and Progress, event dates 29-31 October 2026 and venue UBE School Field"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain transition duration-300 group-hover:scale-[1.02]"
              priority={false}
            />

            {/* Hover overlay with button */}
            <div className="absolute inset-0 flex items-center justify-center bg-purple-950/40 opacity-0 backdrop-blur-[2px] transition group-hover:opacity-100">
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-purple-950 shadow-lg transition hover:bg-gold-400"
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
                Enlarge Invitation
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-purple-700">
                Official Centenary Invitation
              </p>
              <p className="text-xs text-charcoal/70">
                The Takete-Ide Progressive Union · 2026 Edition
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-purple-600/20 bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-800 transition hover:bg-purple-100"
              >
                <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
                View Fullscreen
              </button>

              <a
                href="/images/takete-ide/centenary-invitation.jpg"
                download="Takete-Ide-Centenary-2026-Invitation.jpg"
                className="inline-flex items-center gap-1.5 rounded-xl border border-charcoal/20 bg-white px-3 py-1.5 text-xs font-semibold text-charcoal/80 transition hover:bg-charcoal/5"
              >
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                Download
              </a>
            </div>
          </div>
        </div>

        {/* Supporting Context & Specifications */}
        <div className="flex flex-col gap-5 rounded-3xl border border-gold-500/30 bg-gold-100/40 p-6 sm:p-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-900">
            <FileText className="h-4 w-4 text-gold-700" aria-hidden="true" />
            Official Publication Record
          </div>

          <h3 className="font-serif text-xl font-bold text-purple-950 sm:text-2xl">
            2026 Centenary Celebration & Development Fundraising
          </h3>

          <p className="text-sm leading-relaxed text-charcoal/80">
            The official invitation issued by The Takete-Ide Progressive Union (TIPU) presents the
            programme period, theme, celebration highlights, and official roster of dignitaries, traditional
            rulers, hosts and launchers.
          </p>

          <ul className="space-y-2.5 text-xs text-charcoal/80">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-community-green" aria-hidden="true" />
              <span><strong>Issuing Authority:</strong> The Takete-Ide Progressive Union, Takete-Ide, Mopamuro L.G.A., Kogi State</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-community-green" aria-hidden="true" />
              <span><strong>Event Period:</strong> 29–31 October 2026 · Main Celebration: Saturday, 31 October 2026</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-community-green" aria-hidden="true" />
              <span><strong>Official Venue:</strong> UBE School Field, Takete-Ide, Mopamuro L.G.A., Kogi State</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-community-green" aria-hidden="true" />
              <span><strong>Official Theme:</strong> FAITH, UNITY AND PROGRESS · <em>AGBAGBA IDE AGBE WA O</em></span>
            </li>
          </ul>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Official Centenary Invitation Viewer"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-6 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative flex max-h-[95vh] max-w-5xl flex-col items-center overflow-hidden rounded-3xl bg-purple-950 p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header controls */}
            <div className="flex w-full items-center justify-between border-b border-white/10 pb-3 text-white">
              <span className="font-serif text-sm font-semibold sm:text-base">
                Official Centenary Invitation — Takete-Ide 2026
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="/images/takete-ide/centenary-invitation.jpg"
                  download="Takete-Ide-Centenary-2026-Invitation.jpg"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  Save
                </a>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                  aria-label="Close enlarged invitation viewer"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Main Image */}
            <div className="relative mt-3 h-[75vh] w-full max-w-4xl">
              <Image
                src="/images/takete-ide/centenary-invitation.jpg"
                alt="Enlarged view of official Takete-Ide Centenary 2026 Invitation artwork"
                fill
                sizes="95vw"
                className="object-contain"
                priority
              />
            </div>

            {/* Footer caption */}
            <p className="mt-2 text-center text-xs text-white/70">
              Press <kbd className="rounded bg-white/10 px-1 py-0.5 text-[0.65rem] font-mono">Esc</kbd> or click outside to close
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
