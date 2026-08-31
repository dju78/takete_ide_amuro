import React from "react";
import { MapPin, Compass, ShieldCheck, Mountain, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TimelineEntry } from "@/content/history/web/migration-timeline";

interface MigrationTimelineProps {
  entries: TimelineEntry[];
  className?: string;
}

const STEP_ICONS = [
  Compass,      // Amuro-Odo
  MapPin,       // Igbo Ide
  Mountain,     // Ilu-Oke
  ShieldCheck,  // Okeata
  Home,         // Present Takete-Ide
];

export function MigrationTimeline({ entries, className }: MigrationTimelineProps) {
  return (
    <div className={cn("relative", className)} aria-label="Historical migration timeline of Takete-Ide">
      {/* Central connector line for desktop / left connector for mobile */}
      <div
        className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-purple-300 via-gold-400 to-purple-600 md:left-1/2 md:-translate-x-1/2"
        aria-hidden="true"
      />

      <div className="space-y-10 md:space-y-12">
        {entries.map((entry, index) => {
          const Icon = STEP_ICONS[index % STEP_ICONS.length];
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
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>

              {/* Content card */}
              <div
                className={cn(
                  "ml-14 md:ml-0 md:w-[calc(50%-2.5rem)]",
                  isEven ? "md:pr-4 md:text-right" : "md:pl-4 md:text-left",
                )}
              >
                <div className="rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm sm:p-7 transition-shadow hover:shadow-md">
                  <div
                    className={cn(
                      "flex flex-wrap items-center gap-2",
                      isEven ? "md:justify-end" : "md:justify-start",
                    )}
                  >
                    <span className="inline-flex items-center rounded-full bg-gold-100 px-3 py-0.5 text-xs font-bold text-gold-800">
                      Stage {entry.stepNumber}
                    </span>
                    <span className="rounded-full bg-purple-50 px-3 py-0.5 text-xs font-semibold text-purple-700">
                      {entry.period}
                    </span>
                  </div>

                  <h3 className="mt-3 font-serif text-xl font-bold text-purple-900 sm:text-2xl">
                    {entry.place}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-gold-700">
                    {entry.title}
                  </p>

                  <p className="mt-3 text-sm leading-relaxed text-charcoal/80">
                    {entry.description}
                  </p>

                  {entry.significance && (
                    <p className="mt-3 text-xs italic text-charcoal/60 border-t border-purple-600/10 pt-2.5">
                      <strong>Significance:</strong> {entry.significance}
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
