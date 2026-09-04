import React from "react";
import { Clock, Compass, Church, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { VerificationBadge } from "@/components/ui/Badge";
import type { ReligiousTimelineEntry } from "@/content/heritage/faith/timeline";

interface FaithTimelineProps {
  entries: ReligiousTimelineEntry[];
  className?: string;
}

export function FaithTimeline({ entries, className }: FaithTimelineProps) {
  return (
    <div className={cn("relative", className)} aria-label="Religious heritage timeline of Takete-Ide">
      {/* Central connector line for desktop / left connector for mobile */}
      <div
        className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-purple-300 via-gold-400 to-purple-600 md:left-1/2 md:-translate-x-1/2"
        aria-hidden="true"
      />

      <div className="space-y-10 md:space-y-12">
        {entries.map((entry, index) => {
          const isEven = index % 2 === 0;

          return (
            <div
              key={entry.id}
              className={cn(
                "relative flex flex-col md:flex-row md:items-center",
                isEven ? "md:flex-row-reverse" : "md:flex-row",
              )}
            >
              {/* Timeline marker node */}
              <div className="absolute left-6 -translate-x-1/2 md:left-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-ivory bg-purple-700 text-gold-300 shadow-md">
                {entry.id === "pre-christian-heritage" ? (
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                ) : entry.regionalContext ? (
                  <Compass className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Church className="h-5 w-5" aria-hidden="true" />
                )}
              </div>

              {/* Content card */}
              <div
                className={cn(
                  "ml-14 md:ml-0 md:w-[calc(50%-2.5rem)]",
                  isEven ? "md:pr-4 md:text-right" : "md:pl-4 md:text-left",
                )}
              >
                <div className="rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:p-7">
                  <div
                    className={cn(
                      "flex flex-wrap items-center gap-2",
                      isEven ? "md:justify-end" : "md:justify-start",
                    )}
                  >
                    <span className="inline-flex items-center gap-1 rounded-full bg-gold-100 px-3 py-0.5 text-xs font-bold text-gold-900">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      {entry.yearLabel}
                    </span>
                    {entry.regionalContext && (
                      <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-800 border border-blue-200">
                        Regional Context (Yagba)
                      </span>
                    )}
                    <VerificationBadge status={entry.status} />
                  </div>

                  <h3 className="mt-3 font-serif text-xl font-bold text-purple-950 sm:text-2xl">
                    {entry.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-charcoal/80">
                    {entry.description}
                  </p>

                  {entry.statusNote && (
                    <p className="mt-3 border-t border-purple-600/10 pt-2.5 text-xs italic text-charcoal/60">
                      <strong>Source:</strong> {entry.statusNote}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
