"use client";

import { useState, useRef } from "react";
import {
  Download,
  Share2,
  Check,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Smartphone,
  Copy,
  AlertCircle,
} from "lucide-react";
import {
  CampaignConfig,
  CelebrationTemplate,
  PersonalisationData,
  PhotoAdjustments,
  PosterFormatId,
} from "@/types/celebration-studio";
import { POSTER_FORMATS } from "@/lib/celebration-studio/templates";
import { generateExportFilename } from "@/lib/celebration-studio/validation";
import { renderCelebrationPoster } from "@/lib/celebration-studio/poster-renderer";
import { APPROVED_HERITAGE_BACKGROUNDS } from "@/lib/celebration-studio/heritage-backgrounds";
import { PrivacyNotice } from "./PrivacyNotice";
import { cn } from "@/lib/utils";

interface ExportControlsProps {
  campaign: CampaignConfig;
  template: CelebrationTemplate;
  personalisation: PersonalisationData;
  photoUrl: string | null;
  photoAdjustments: PhotoAdjustments;
  selectedFormat: PosterFormatId;
  onSelectFormat: (format: PosterFormatId) => void;
  onCreateAnother: () => void;
  onBackToEdit: () => void;
}

export function ExportControls({
  campaign,
  template,
  personalisation,
  photoUrl,
  photoAdjustments,
  selectedFormat,
  onSelectFormat,
  onCreateAnother,
  onBackToEdit,
}: ExportControlsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [shareStatus, setShareStatus] = useState<"idle" | "shared" | "copied" | "unsupported">("idle");
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);

  const format = POSTER_FORMATS.find((f) => f.id === selectedFormat) || POSTER_FORMATS[0];
  const celebrantName = template.category === "family" ? personalisation.familyName : personalisation.name;
  const filename = generateExportFilename(campaign.filenamePrefix, celebrantName || "celebrant", "png");

  const generateBlob = async (): Promise<Blob> => {
    // Create dedicated offscreen high-res canvas
    const canvas = hiddenCanvasRef.current || document.createElement("canvas");

    const loadImage = (src: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load ${src}`));
        img.src = src;
      });

    let logoImg: HTMLImageElement | null = null;
    let photoImg: HTMLImageElement | null = null;
    let bgImg: HTMLImageElement | null = null;

    if (campaign.logoUrl) {
      try {
        logoImg = await loadImage(campaign.logoUrl);
      } catch {
        logoImg = null;
      }
    }

    if (photoUrl) {
      try {
        photoImg = await loadImage(photoUrl);
      } catch {
        photoImg = null;
      }
    }

    const activeBgId = personalisation.customOptions?.backgroundPhoto || template.defaultBackgroundPhoto;
    if (activeBgId) {
      const bgMeta = APPROVED_HERITAGE_BACKGROUNDS.find((b) => b.id === activeBgId);
      if (bgMeta) {
        try {
          bgImg = await loadImage(bgMeta.imageSrc);
        } catch {
          bgImg = null;
        }
      }
    }

    await renderCelebrationPoster({
      canvas,
      campaign,
      template,
      format,
      personalisation,
      photoImage: photoImg,
      photoAdjustments,
      logoImage: logoImg,
      backgroundImage: bgImg,
      showSafeAreas: false,
    });

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas blob conversion failed"));
      }, "image/png", 1.0);
    });
  };

  const handleDownload = async () => {
    setIsExporting(true);
    setDownloadSuccess(false);

    try {
      const blob = await generateBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(url), 4000);
      setDownloadSuccess(true);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    setShareStatus("idle");

    try {
      const blob = await generateBlob();
      const file = new File([blob], filename, { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Takete-Ide Centenary Celebration Poster",
          text: `Celebrating 100 Years of Takete-Ide Heritage (1926–2026)! Create your own poster at https://takete-ide.org/centenary/celebration-studio`,
        });
        setShareStatus("shared");
      } else if (navigator.share) {
        await navigator.share({
          title: "Takete-Ide Centenary Celebration Poster",
          text: `Celebrating 100 Years of Takete-Ide Heritage (1926–2026)! Create your own poster at https://takete-ide.org/centenary/celebration-studio`,
          url: "https://takete-ide.org/centenary/celebration-studio",
        });
        setShareStatus("shared");
      } else {
        // Fallback: copy link
        await navigator.clipboard.writeText("https://takete-ide.org/centenary/celebration-studio");
        setShareStatus("copied");
      }
    } catch (err) {
      // If user cancelled sharing, do not claim it was shared
      if ((err as Error).name !== "AbortError") {
        try {
          await navigator.clipboard.writeText("https://takete-ide.org/centenary/celebration-studio");
          setShareStatus("copied");
        } catch {
          setShareStatus("unsupported");
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <canvas ref={hiddenCanvasRef} className="hidden" aria-hidden="true" />

      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-1 text-xs font-semibold text-gold-800">
          <Sparkles className="h-3.5 w-3.5 text-gold-700" aria-hidden="true" />
          Step 5: Download &amp; Celebrate
        </span>
        <h2 className="mt-2 font-serif text-2xl font-bold text-purple-950 sm:text-3xl">
          Your Poster is Ready!
        </h2>
        <p className="mt-1 text-sm text-charcoal/75">
          Download your high-resolution PNG poster to share on WhatsApp, Facebook, Instagram, or print.
        </p>
      </div>

      {/* Export Ready Hero Card */}
      <div className="rounded-3xl border border-gold-400/40 bg-gradient-to-b from-white via-gold-50/20 to-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-500/20 text-gold-800 ring-2 ring-gold-400/40">
            <ShieldCheck className="h-8 w-8 text-gold-700" aria-hidden="true" />
          </div>

          <div className="space-y-1">
            <h3 className="font-serif text-xl font-bold text-purple-950">
              {celebrantName || "Takete-Ide Centenary Celebrant"}
            </h3>
            <p className="text-xs font-mono text-charcoal/60 bg-purple-50 px-3 py-1 rounded-md inline-block">
              Filename: {filename}
            </p>
          </div>

          {/* Quick Format Selector */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
            {POSTER_FORMATS.map((fmt) => (
              <button
                key={fmt.id}
                type="button"
                onClick={() => onSelectFormat(fmt.id)}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-medium transition cursor-pointer",
                  selectedFormat === fmt.id
                    ? "bg-purple-700 text-white font-bold shadow-xs"
                    : "bg-purple-50 text-purple-900 hover:bg-purple-100"
                )}
              >
                {fmt.label}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 w-full max-w-md">
            <button
              type="button"
              onClick={handleDownload}
              disabled={isExporting}
              className="flex min-h-12 w-full sm:w-auto flex-1 items-center justify-center gap-2 rounded-xl bg-purple-700 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-purple-800 disabled:opacity-50 cursor-pointer"
            >
              {isExporting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-gold-300" aria-hidden="true" />
                  Generating High-Res PNG...
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="h-4 w-4 text-gold-300 stroke-[3]" aria-hidden="true" />
                  Downloaded Successfully!
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 text-gold-300" aria-hidden="true" />
                  Download High-Res PNG
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-purple-600 bg-purple-50 px-5 py-3 text-sm font-bold text-purple-900 hover:bg-purple-100 transition cursor-pointer"
            >
              <Share2 className="h-4 w-4 text-purple-700" aria-hidden="true" />
              Share Poster
            </button>
          </div>

          {/* Share Feedback Alerts */}
          {shareStatus === "shared" && (
            <div className="inline-flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-2 text-xs font-semibold text-green-800">
              <Check className="h-3.5 w-3.5 text-green-600" aria-hidden="true" />
              Poster shared successfully!
            </div>
          )}

          {shareStatus === "copied" && (
            <div className="inline-flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-200 px-4 py-2 text-xs font-semibold text-blue-800">
              <Copy className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
              Celebration Studio link copied to clipboard!
            </div>
          )}

          {shareStatus === "unsupported" && (
            <div className="inline-flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2 text-xs text-amber-800">
              <AlertCircle className="h-3.5 w-3.5 text-amber-600" aria-hidden="true" />
              Direct sharing is not supported by your browser. Please tap &ldquo;Download High-Res PNG&rdquo; to save and share manually.
            </div>
          )}
        </div>
      </div>

      {/* Social Media Sharing Tips */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-purple-600/10 bg-white p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-950">
            <Smartphone className="h-4 w-4 text-purple-700" aria-hidden="true" />
            WhatsApp Status
          </div>
          <p className="mt-1 text-xs text-charcoal/70">
            Select the &ldquo;Status / Story&rdquo; format (1080×1920) for a perfect full-screen WhatsApp status update.
          </p>
        </div>

        <div className="rounded-2xl border border-purple-600/10 bg-white p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-950">
            <Share2 className="h-4 w-4 text-purple-700" aria-hidden="true" />
            Instagram &amp; Facebook
          </div>
          <p className="mt-1 text-xs text-charcoal/70">
            Use &ldquo;Social Portrait&rdquo; (1080×1350) for maximum feed engagement without cropping.
          </p>
        </div>

        <div className="rounded-2xl border border-purple-600/10 bg-white p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-950">
            <Download className="h-4 w-4 text-purple-700" aria-hidden="true" />
            Print Keepsake
          </div>
          <p className="mt-1 text-xs text-charcoal/70">
            Use the &ldquo;Printable Portrait&rdquo; format (1200×1600) to frame at home or display during centenary week.
          </p>
        </div>
      </div>

      {/* Privacy Guarantee Reminder */}
      <PrivacyNotice />

      {/* Footer Options */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-purple-600/10">
        <button
          type="button"
          onClick={onBackToEdit}
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-purple-300 bg-white px-5 py-2.5 text-sm font-semibold text-purple-950 hover:bg-purple-50 transition cursor-pointer"
        >
          ← Edit Design
        </button>

        <button
          type="button"
          onClick={onCreateAnother}
          className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-gold-500 px-6 py-2.5 text-sm font-bold text-purple-950 shadow-xs hover:bg-gold-400 transition cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Create Another Poster
        </button>
      </div>
    </div>
  );
}
