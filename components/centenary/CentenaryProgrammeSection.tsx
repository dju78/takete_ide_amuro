import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProgrammeCountdownBadge } from "@/components/centenary/ProgrammeCountdownBadge";
import type { CentenaryProgrammeItem } from "@/lib/media/community-programme";
import { CalendarDays, MapPin, Clock, Award, Sparkles } from "lucide-react";

interface CentenaryProgrammeSectionProps {
  programmes: CentenaryProgrammeItem[];
}

export function CentenaryProgrammeSection({ programmes }: CentenaryProgrammeSectionProps) {
  return (
    <section id="programme" className="scroll-mt-20">
      <SectionHeading
        eyebrow="Official Schedule"
        title="Centenary Programme"
        align="left"
        className="mx-0"
        description="Three historic days celebrating a century of Takete-Ide's heritage, unity and progress."
      />

      <div className="mt-10 space-y-8">
        {programmes.map((item) => {
          if (item.isGrandCelebration) {
            return (
              <div
                key={item.id}
                className="relative overflow-hidden rounded-3xl border-2 border-gold-500/40 bg-gradient-to-br from-purple-800 via-purple-700 to-purple-900 p-6 text-white shadow-lg sm:p-8 lg:p-10"
              >
                {/* Gold Accent Corner Tag */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-gold-400/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-gold-300 ring-1 ring-inset ring-gold-400/40">
                    <Sparkles className="h-3.5 w-3.5 text-gold-300" aria-hidden="true" />
                    {item.dayLabel}
                  </div>

                  <ProgrammeCountdownBadge item={item} variant="prominent" />
                </div>

                <div className="mt-5">
                  <h3 className="font-serif text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                    {item.title}
                  </h3>

                  {item.theme && (
                    <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-gold-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-200">
                      Theme: {item.theme}
                    </div>
                  )}

                  {item.description && (
                    <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">
                      {item.description}
                    </p>
                  )}

                  <div className="mt-6 grid gap-3 border-t border-white/15 pt-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="flex items-center gap-2.5 text-sm text-white/90">
                      <CalendarDays className="h-4 w-4 shrink-0 text-gold-300" aria-hidden="true" />
                      <span className="font-medium">{item.dateLabel}</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-sm text-white/90">
                      <Clock className="h-4 w-4 shrink-0 text-gold-300" aria-hidden="true" />
                      <span className="font-medium">{item.timeLabel ?? "Time to be confirmed"}</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-sm text-white/90 sm:col-span-2 lg:col-span-1">
                      <MapPin className="h-4 w-4 shrink-0 text-gold-300" aria-hidden="true" />
                      <span className="font-medium">{item.venue}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={item.id}
              className="relative rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm sm:p-8 lg:p-9"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-purple-700 ring-1 ring-inset ring-purple-600/15">
                  <Award className="h-3.5 w-3.5 text-purple-600" aria-hidden="true" />
                  {item.dayLabel}
                </span>

                <ProgrammeCountdownBadge item={item} />
              </div>

              <div className="mt-4">
                <h3 className="font-serif text-xl font-bold text-purple-900 sm:text-2xl">
                  {item.title}
                </h3>

                {item.description && (
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/75 sm:text-base">
                    {item.description}
                  </p>
                )}

                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-purple-600/10 pt-4 text-xs text-charcoal/70 sm:text-sm">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-purple-600" aria-hidden="true" />
                    <span className="font-medium text-charcoal/90">{item.dateLabel}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-600" aria-hidden="true" />
                    <span>{item.timeLabel ?? "Time to be confirmed"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-purple-600" aria-hidden="true" />
                    <span>{item.venue}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
