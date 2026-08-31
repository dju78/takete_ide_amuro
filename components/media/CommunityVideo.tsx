"use client";

import { useState } from "react";
import { Film, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CommunityVideoProps {
  src: string;
  /** Poster frame. Without one a `preload="none"` player renders as a black box. */
  poster?: string;
  title: string;
  description?: string;
  /** e.g. "About 2 minutes" — sets expectations before anyone spends the bandwidth. */
  durationLabel?: string;
  /** Shown as a caveat when part of the record is still unconfirmed. */
  verificationNote?: string;
  orientation?: "landscape" | "portrait";
  /** Renders the title as an <h2> instead of the default <h3>. */
  headingLevel?: 2 | 3;
  className?: string;
}

/**
 * Accessible community video player.
 *
 * Performance: `preload="none"` plus a real poster means the page costs one
 * small JPEG until a visitor actually presses play — several of these clips are
 * multi-megabyte, so nothing is fetched speculatively.
 *
 * Accessibility: native controls (keyboard-operable, correctly labelled by the
 * browser), a visible heading, a written description, and an explicit statement
 * that captions are unavailable. Captions are never invented for a recording
 * nobody has transcribed — see docs/DECISIONS.md.
 */
export function CommunityVideo({
  src,
  poster,
  title,
  description,
  durationLabel,
  verificationNote,
  orientation = "landscape",
  headingLevel = 3,
  className,
}: CommunityVideoProps) {
  const [failed, setFailed] = useState(false);
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const isPortrait = orientation === "portrait";

  return (
    <figure className={cn("flex flex-col", className)}>
      <div
        className={cn(
          "overflow-hidden rounded-3xl bg-black shadow-lg",
          isPortrait ? "mx-auto aspect-[9/16] w-full max-w-xs sm:max-w-sm" : "aspect-video w-full",
        )}
      >
        {failed ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-purple-50 px-4 text-center text-purple-600/60">
            <Film className="h-8 w-8" aria-hidden="true" />
            <span className="text-xs font-medium">{title} — video unavailable</span>
          </div>
        ) : (
          <video
            controls
            playsInline
            preload="none"
            poster={poster}
            aria-label={title}
            onError={() => setFailed(true)}
            className="h-full w-full object-contain"
          >
            <source src={src} type="video/mp4" />
            <p className="p-4 text-sm text-white">
              Your browser cannot play this video.{" "}
              <a href={src} className="underline">
                Open the video file directly
              </a>
              .
            </p>
          </video>
        )}
      </div>

      <figcaption className="mt-4">
        <Heading className="font-serif text-xl font-bold text-purple-600">{title}</Heading>
        {description && <p className="mt-2 text-base leading-relaxed text-charcoal/75">{description}</p>}
        <p className="mt-2 text-xs text-charcoal/55">
          {durationLabel ? `${durationLabel}. ` : ""}
          Captions are not available for this recording.
        </p>
        {verificationNote && (
          <p className="mt-3 flex gap-2 rounded-xl border border-gold-500/30 bg-gold-100/60 p-3 text-xs leading-relaxed text-charcoal/75">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-700" aria-hidden="true" />
            <span>{verificationNote}</span>
          </p>
        )}
      </figcaption>
    </figure>
  );
}
