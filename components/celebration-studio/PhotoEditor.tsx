"use client";

import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  RefreshCw,
  Trash2,
  Sliders,
  Move,
  Sparkles,
} from "lucide-react";
import { PhotoAdjustments, CelebrationTemplate } from "@/types/celebration-studio";
import { cn } from "@/lib/utils";

interface PhotoEditorProps {
  photoUrl: string;
  template: CelebrationTemplate;
  adjustments: PhotoAdjustments;
  onChangeAdjustments: (newAdjustments: PhotoAdjustments) => void;
  onReplacePhoto: () => void;
  onRemovePhoto: () => void;
  onNext: () => void;
  onBack: () => void;
}

export function PhotoEditor({
  photoUrl,
  template,
  adjustments,
  onChangeAdjustments,
  onReplacePhoto,
  onRemovePhoto,
  onNext,
  onBack,
}: PhotoEditorProps) {
  const updateZoom = (delta: number) => {
    const newZoom = Math.min(3.0, Math.max(1.0, Number((adjustments.zoom + delta).toFixed(2))));
    onChangeAdjustments({ ...adjustments, zoom: newZoom });
  };

  const handleRotate = () => {
    const nextRotation = (adjustments.rotation + 90) % 360;
    onChangeAdjustments({ ...adjustments, rotation: nextRotation });
  };

  const resetAdjustments = () => {
    onChangeAdjustments({
      zoom: 1.0,
      panX: 0,
      panY: 0,
      rotation: 0,
      filter: "original",
      removeBackground: false,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-1 text-xs font-semibold text-gold-800">
          <Sparkles className="h-3.5 w-3.5 text-gold-700" aria-hidden="true" />
          Step 2: Adjust &amp; Crop Your Photograph
        </span>
        <h2 className="mt-2 font-serif text-2xl font-bold text-purple-950 sm:text-3xl">
          Fine-tune Photo Placement
        </h2>
        <p className="mt-1 text-sm text-charcoal/75">
          Position your face centrally within the framed safe zone. Use zoom, pan and rotation controls.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] items-start">
        {/* Photo Interactive Framing View */}
        <div className="flex flex-col items-center justify-center rounded-3xl border border-purple-600/15 bg-gradient-to-b from-purple-950 via-purple-900 to-purple-950 p-6 text-white shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gold-300">
            Framed Mask Preview ({template.photoConfig.shape})
          </span>

          <div className="relative my-4 flex h-64 w-64 items-center justify-center overflow-hidden rounded-2xl bg-black/40 border-2 border-gold-500/40 p-2 shadow-inner">
            <div
              className={cn(
                "relative h-56 w-56 overflow-hidden border-4 border-gold-400 shadow-lg bg-purple-950",
                template.photoConfig.shape === "circle"
                  ? "rounded-full"
                  : template.photoConfig.shape === "arch"
                  ? "rounded-t-full rounded-b-xl"
                  : "rounded-2xl"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoUrl}
                alt="Celebrant upload preview"
                className="h-full w-full object-cover transition-transform duration-100"
                style={{
                  transform: `scale(${adjustments.zoom}) translate(${adjustments.panX}%, ${adjustments.panY}%) rotate(${adjustments.rotation}deg)`,
                  filter:
                    adjustments.filter === "warm"
                      ? "sepia(0.2) contrast(1.05) saturate(1.15)"
                      : adjustments.filter === "vibrant"
                      ? "saturate(1.25) contrast(1.08)"
                      : adjustments.filter === "classic-bw"
                      ? "grayscale(1) contrast(1.15)"
                      : "none",
                }}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={onReplacePhoto}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5 text-gold-300" aria-hidden="true" />
              Replace Photo
            </button>
            <button
              type="button"
              onClick={onRemovePhoto}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/20 transition cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              Remove
            </button>
          </div>
        </div>

        {/* Adjustments Controls */}
        <div className="space-y-5 rounded-3xl border border-purple-600/15 bg-white p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-purple-600/10 pb-3">
            <h3 className="font-serif text-base font-bold text-purple-950 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-purple-700" aria-hidden="true" />
              Adjustments
            </h3>
            <button
              type="button"
              onClick={resetAdjustments}
              className="text-xs font-medium text-purple-700 hover:underline cursor-pointer"
            >
              Reset to default
            </button>
          </div>

          {/* Zoom Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-charcoal">
              <span className="flex items-center gap-1.5">
                <ZoomIn className="h-4 w-4 text-purple-700" aria-hidden="true" />
                Zoom Scale:
              </span>
              <span className="rounded-md bg-purple-50 px-2 py-0.5 text-purple-900 font-mono">
                {adjustments.zoom.toFixed(1)}x
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => updateZoom(-0.1)}
                disabled={adjustments.zoom <= 1.0}
                aria-label="Zoom out"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-200 bg-purple-50 text-purple-900 hover:bg-purple-100 disabled:opacity-40 cursor-pointer"
              >
                <ZoomOut className="h-4 w-4" aria-hidden="true" />
              </button>
              <input
                type="range"
                min="1.0"
                max="3.0"
                step="0.05"
                value={adjustments.zoom}
                onChange={(e) =>
                  onChangeAdjustments({ ...adjustments, zoom: parseFloat(e.target.value) })
                }
                className="h-2 w-full accent-purple-700 bg-purple-100 rounded-lg cursor-pointer"
                aria-label="Zoom slider"
              />
              <button
                type="button"
                onClick={() => updateZoom(0.1)}
                disabled={adjustments.zoom >= 3.0}
                aria-label="Zoom in"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-200 bg-purple-50 text-purple-900 hover:bg-purple-100 disabled:opacity-40 cursor-pointer"
              >
                <ZoomIn className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Pan Horizontal (X) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-charcoal">
              <span className="flex items-center gap-1.5">
                <Move className="h-4 w-4 text-purple-700" aria-hidden="true" />
                Reposition Horizontal (Left / Right):
              </span>
              <span className="text-[11px] text-charcoal/60">{adjustments.panX}%</span>
            </div>
            <input
              type="range"
              min="-40"
              max="40"
              step="1"
              value={adjustments.panX}
              onChange={(e) =>
                onChangeAdjustments({ ...adjustments, panX: parseInt(e.target.value, 10) })
              }
              className="h-2 w-full accent-purple-700 bg-purple-100 rounded-lg cursor-pointer"
              aria-label="Horizontal position"
            />
          </div>

          {/* Pan Vertical (Y) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-charcoal">
              <span className="flex items-center gap-1.5">
                <Move className="h-4 w-4 text-purple-700" aria-hidden="true" />
                Reposition Vertical (Up / Down):
              </span>
              <span className="text-[11px] text-charcoal/60">{adjustments.panY}%</span>
            </div>
            <input
              type="range"
              min="-40"
              max="40"
              step="1"
              value={adjustments.panY}
              onChange={(e) =>
                onChangeAdjustments({ ...adjustments, panY: parseInt(e.target.value, 10) })
              }
              className="h-2 w-full accent-purple-700 bg-purple-100 rounded-lg cursor-pointer"
              aria-label="Vertical position"
            />
          </div>

          {/* Rotate & Filter Options */}
          <div className="space-y-3 pt-1">
            <div className="text-xs font-semibold text-charcoal">Rotation &amp; Tone Filter:</div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleRotate}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-purple-300 bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-900 hover:bg-purple-100 transition cursor-pointer"
              >
                <RotateCw className="h-3.5 w-3.5 text-purple-700" aria-hidden="true" />
                Rotate 90° ({adjustments.rotation}°)
              </button>

              <div className="flex items-center gap-1">
                {(["original", "warm", "vibrant", "classic-bw"] as const).map((filterName) => (
                  <button
                    key={filterName}
                    type="button"
                    onClick={() => onChangeAdjustments({ ...adjustments, filter: filterName })}
                    className={cn(
                      "rounded-lg px-2.5 py-1.5 text-[11px] font-semibold capitalize transition cursor-pointer",
                      adjustments.filter === filterName
                        ? "bg-purple-700 text-white"
                        : "bg-purple-50 text-purple-900 hover:bg-purple-100"
                    )}
                  >
                    {filterName === "classic-bw" ? "B&W" : filterName}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-purple-600/10">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-purple-300 bg-white px-5 py-2.5 text-sm font-semibold text-purple-950 hover:bg-purple-50 transition cursor-pointer"
        >
          ← Back to Templates
        </button>
        <button
          type="button"
          onClick={onNext}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-purple-700 px-6 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-purple-800 cursor-pointer"
        >
          Continue to Personalise →
        </button>
      </div>
    </div>
  );
}
