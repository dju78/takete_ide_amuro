"use client";

import { useState } from "react";
import { Sparkles, Users, Award, Landmark, Palette, Check } from "lucide-react";
import { CelebrationTemplate, TemplateCategory } from "@/types/celebration-studio";
import { cn } from "@/lib/utils";

interface TemplateGalleryProps {
  templates: CelebrationTemplate[];
  selectedTemplateId: string;
  onSelectTemplate: (templateId: string) => void;
  onNext: () => void;
}

const CATEGORY_TABS: Array<{ id: "all" | TemplateCategory; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: "all", label: "All Templates", icon: Sparkles },
  { id: "personal", label: "Personal", icon: Sparkles },
  { id: "family", label: "Family", icon: Users },
  { id: "leadership", label: "Leadership", icon: Award },
  { id: "heritage", label: "Heritage Scenery", icon: Landmark },
  { id: "custom", label: "Create Your Own", icon: Palette },
];

export function TemplateGallery({
  templates,
  selectedTemplateId,
  onSelectTemplate,
  onNext,
}: TemplateGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<"all" | TemplateCategory>("all");

  const filteredTemplates = templates.filter(
    (t) => activeCategory === "all" || t.category === activeCategory
  );

  return (
    <div className="space-y-6">
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-1 text-xs font-semibold text-gold-800">
          <Sparkles className="h-3.5 w-3.5 text-gold-700" aria-hidden="true" />
          Step 1: Choose Your Celebration Template
        </span>
        <h2 className="mt-2 font-serif text-2xl font-bold text-purple-950 sm:text-3xl">
          Select a Commemorative Design
        </h2>
        <p className="mt-1 text-sm text-charcoal/75">
          Pick a layout tailored for your personal portrait, family tribute, leadership felicitations, or Takete-Ide heritage landscapes.
        </p>
      </div>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap gap-2 pt-1">
        {CATEGORY_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategory(tab.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all",
                isActive
                  ? "bg-purple-700 text-white shadow-xs"
                  : "bg-white text-purple-900 border border-purple-200/80 hover:bg-purple-50"
              )}
            >
              <Icon className={cn("h-3.5 w-3.5", isActive ? "text-gold-300" : "text-purple-600")} aria-hidden="true" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Templates Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((tpl) => {
          const isSelected = tpl.id === selectedTemplateId;
          return (
            <div
              key={tpl.id}
              onClick={() => onSelectTemplate(tpl.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectTemplate(tpl.id);
                }
              }}
              className={cn(
                "group relative flex flex-col justify-between rounded-2xl border-2 p-5 text-left transition-all duration-200 cursor-pointer",
                isSelected
                  ? "border-purple-600 bg-white shadow-md ring-4 ring-purple-600/10"
                  : "border-purple-600/10 bg-white hover:border-gold-500/60 hover:shadow-xs"
              )}
            >
              {/* Badge */}
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-gold-500/15 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-gold-800">
                  {tpl.badgeText || tpl.category}
                </span>
                <div
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full border transition-colors",
                    isSelected
                      ? "border-purple-700 bg-purple-700 text-white"
                      : "border-charcoal/20 bg-white group-hover:border-purple-400"
                  )}
                >
                  {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" aria-hidden="true" />}
                </div>
              </div>

              {/* Visual Card Representation */}
              <div className="my-4 overflow-hidden rounded-xl border border-purple-900/10 bg-gradient-to-b from-purple-950 via-purple-900 to-purple-950 p-3 text-white shadow-inner">
                <div className="flex items-center justify-between border-b border-gold-500/30 pb-1.5 text-[9px] font-bold tracking-widest text-gold-300">
                  <span>CENTENARY 2026</span>
                  <span>100 YEARS</span>
                </div>
                <div className="my-3 flex items-center justify-center">
                  <div
                    className={cn(
                      "flex h-16 w-16 items-center justify-center border-2 border-gold-400 bg-purple-900/80 shadow-xs",
                      tpl.photoConfig.shape === "circle"
                        ? "rounded-full"
                        : tpl.photoConfig.shape === "arch"
                        ? "rounded-t-full rounded-b-md"
                        : "rounded-lg"
                    )}
                  >
                    <span className="text-[9px] font-bold text-gold-200/90">PHOTO</span>
                  </div>
                </div>
                <div className="text-center space-y-0.5">
                  <div className="text-[10px] font-bold text-white truncate">{tpl.name}</div>
                  <div className="text-[8px] text-gold-200/80 line-clamp-1">
                    {tpl.defaultSalutation || "Takete-Ide Centenary Celebration"}
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="font-serif text-base font-bold text-purple-950 group-hover:text-purple-700">
                  {tpl.name}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-charcoal/70">
                  {tpl.description}
                </p>
              </div>

              {/* Selection Indicator */}
              <div className="mt-4 pt-3 border-t border-purple-600/10 flex items-center justify-between">
                <span className="text-[11px] font-medium text-charcoal/60">
                  Frame: <strong className="capitalize text-purple-950">{tpl.photoConfig.shape}</strong>
                </span>
                <span
                  className={cn(
                    "text-xs font-bold transition-colors",
                    isSelected ? "text-purple-700" : "text-charcoal/50 group-hover:text-purple-600"
                  )}
                >
                  {isSelected ? "Selected ✓" : "Select Layout →"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={onNext}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-purple-700 px-6 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-purple-800 focus-visible:outline-2 focus-visible:outline-purple-700 cursor-pointer"
        >
          Continue to Upload Photo →
        </button>
      </div>
    </div>
  );
}
