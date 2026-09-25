"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Maximize2,
  Minimize2,
  Eye,
  Shield,
  Layers,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import {
  CampaignConfig,
  CelebrationTemplate,
  PersonalisationData,
  PhotoAdjustments,
  PosterFormatId,
} from "@/types/celebration-studio";
import { POSTER_FORMATS } from "@/lib/celebration-studio/templates";
import { renderCelebrationPoster } from "@/lib/celebration-studio/poster-renderer";
import { APPROVED_HERITAGE_BACKGROUNDS } from "@/lib/celebration-studio/heritage-backgrounds";
import { cn } from "@/lib/utils";

interface PosterPreviewProps {
  campaign: CampaignConfig;
  template: CelebrationTemplate;
  personalisation: PersonalisationData;
  photoUrl: string | null;
  photoAdjustments: PhotoAdjustments;
  selectedFormat: PosterFormatId;
  onSelectFormat: (format: PosterFormatId) => void;
  onNext?: () => void;
  onBack?: () => void;
  onStartAgain?: () => void;
  className?: string;
  isStandalonePreview?: boolean;
}

export function PosterPreview({
  campaign,
  template,
  personalisation,
  photoUrl,
  photoAdjustments,
  selectedFormat,
  onSelectFormat,
  onNext,
  onBack,
  onStartAgain,
  className = "",
  isStandalonePreview = false,
}: PosterPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showSafeAreas, setShowSafeAreas] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isRendering, setIsRendering] = useState(true);

  // Cached Image elements
  const photoImgRef = useRef<HTMLImageElement | null>(null);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const bgImgRef = useRef<HTMLImageElement | null>(null);

  const format = POSTER_FORMATS.find((f) => f.id === selectedFormat) || POSTER_FORMATS[0];

  // Helper to load image
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  };

  const redrawPoster = useCallback(async () => {
    if (!canvasRef.current) return;
    setIsRendering(true);

    try {
      // 1. Ensure Logo is loaded
      if (!logoImgRef.current && campaign.logoUrl) {
        try {
          logoImgRef.current = await loadImage(campaign.logoUrl);
        } catch {
          logoImgRef.current = null;
        }
      }

      // 2. Ensure Photo is loaded
      if (photoUrl) {
        try {
          photoImgRef.current = await loadImage(photoUrl);
        } catch {
          photoImgRef.current = null;
        }
      } else {
        photoImgRef.current = null;
      }

      // 3. Ensure Background Photo is loaded (if applicable)
      const activeBgId =
        personalisation.customOptions?.backgroundPhoto || template.defaultBackgroundPhoto;
      if (activeBgId) {
        const bgMeta = APPROVED_HERITAGE_BACKGROUNDS.find((b) => b.id === activeBgId);
        if (bgMeta) {
          try {
            bgImgRef.current = await loadImage(bgMeta.imageSrc);
          } catch {
            bgImgRef.current = null;
          }
        }
      } else {
        bgImgRef.current = null;
      }

      // 4. Render to Canvas
      await renderCelebrationPoster({
        canvas: canvasRef.current,
        campaign,
        template,
        format,
        personalisation,
        photoImage: photoImgRef.current,
        photoAdjustments,
        logoImage: logoImgRef.current,
        backgroundImage: bgImgRef.current,
        showSafeAreas,
      });
    } catch (err) {
      console.error("Failed rendering celebration poster canvas:", err);
    } finally {
      setIsRendering(false);
    }
  }, [
    campaign,
    template,
    format,
    personalisation,
    photoUrl,
    photoAdjustments,
    showSafeAreas,
  ]);

  useEffect(() => {
    redrawPoster();
  }, [redrawPoster]);

  return (
    <div className={`space-y-6 ${className}`}>
      {isStandalonePreview && (
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-1 text-xs font-semibold text-gold-800">
            <Sparkles className="h-3.5 w-3.5 text-gold-700" aria-hidden="true" />
            Step 4: Live Design Preview
          </span>
          <h2 className="mt-2 font-serif text-2xl font-bold text-purple-950 sm:text-3xl">
            Review Your Centenary Poster
          </h2>
          <p className="mt-1 text-sm text-charcoal/75">
            Inspect your finished commemorative design across social post, story and print formats.
          </p>
        </div>
      )}

      {/* Aspect Ratio Format Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-purple-600/15 bg-white p-3.5 shadow-xs">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-purple-700" aria-hidden="true" />
          <span className="text-xs font-bold text-purple-950">Output Format:</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {POSTER_FORMATS.map((fmt) => (
            <button
              key={fmt.id}
              type="button"
              onClick={() => onSelectFormat(fmt.id)}
              className={cn(
                "rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer",
                selectedFormat === fmt.id
                  ? "bg-purple-700 text-white shadow-xs"
                  : "bg-purple-50 text-purple-900 hover:bg-purple-100"
              )}
            >
              {fmt.label} ({fmt.sublabel})
            </button>
          ))}
        </div>
      </div>

      {/* Main Preview Frame Container */}
      <div className="relative flex flex-col items-center justify-center rounded-3xl border border-purple-600/15 bg-gradient-to-b from-stone-900 via-neutral-900 to-stone-950 p-4 sm:p-8 shadow-md">
        {/* Top Preview Toolbar */}
        <div className="flex w-full items-center justify-between pb-4 text-white/80">
          <div className="flex items-center gap-2 text-xs">
            <Eye className="h-3.5 w-3.5 text-gold-300" aria-hidden="true" />
            <span>
              Format: <strong className="text-gold-200">{format.label}</strong> ({format.width} × {format.height}px)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Safe Area Guide Toggle */}
            <button
              type="button"
              onClick={() => setShowSafeAreas(!showSafeAreas)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition cursor-pointer",
                showSafeAreas
                  ? "bg-sky-500 text-white"
                  : "bg-white/10 text-white/80 hover:bg-white/20"
              )}
              title="Toggle Safe Area Bleed Guide"
            >
              <Shield className="h-3.5 w-3.5" aria-hidden="true" />
              Safe Guide
            </button>

            {/* Zoom Inspection */}
            <button
              type="button"
              onClick={() => setIsZoomed(!isZoomed)}
              className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-xs font-medium text-white/80 hover:bg-white/20 transition cursor-pointer"
            >
              {isZoomed ? (
                <>
                  <Minimize2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Fit
                </>
              ) : (
                <>
                  <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Zoom
                </>
              )}
            </button>
          </div>
        </div>

        {/* Dynamic Canvas Element */}
        <div
          className={cn(
            "relative flex items-center justify-center overflow-auto rounded-2xl border-4 border-gold-500/50 shadow-2xl transition-all duration-200",
            isZoomed ? "max-h-[85vh] w-full max-w-4xl" : "max-h-[60vh] max-w-full"
          )}
        >
          <canvas
            ref={canvasRef}
            className="h-auto max-h-[58vh] max-w-full rounded-lg object-contain shadow-2xl"
            style={{
              aspectRatio: `${format.width} / ${format.height}`,
            }}
          />

          {isRendering && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-xs text-white text-xs font-semibold">
              Rendering poster...
            </div>
          )}
        </div>

        {/* Format Recommendations description */}
        <div className="mt-4 text-center text-xs text-white/70">
          Recommended for: <span className="font-semibold text-gold-300">{format.recommendedFor}</span>
        </div>
      </div>

      {/* Navigation Footer for Step 4 */}
      {isStandalonePreview && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-purple-600/10">
          <div className="flex items-center gap-2">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-purple-300 bg-white px-5 py-2.5 text-sm font-semibold text-purple-950 hover:bg-purple-50 transition cursor-pointer"
              >
                ← Edit Details
              </button>
            )}
            {onStartAgain && (
              <button
                type="button"
                onClick={onStartAgain}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-800 hover:bg-red-100 transition cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5 text-red-700" aria-hidden="true" />
                Start Again
              </button>
            )}
          </div>

          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-purple-700 px-6 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-purple-800 cursor-pointer"
            >
              Continue to Download &amp; Share →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
