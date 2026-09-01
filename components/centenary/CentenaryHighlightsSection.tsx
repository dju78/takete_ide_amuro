import { SectionHeading } from "@/components/ui/SectionHeading";
import type { CentenaryHighlight } from "@/lib/media/community-programme";
import { Sparkles, Music4, Landmark, BookOpen, Award } from "lucide-react";

const ICON_MAP = {
  "cultural-display": Sparkles,
  "traditional-music-dance": Music4,
  "community-exhibition": Landmark,
  "historical-reflections": BookOpen,
  "awards-recognitions": Award,
};

interface CentenaryHighlightsSectionProps {
  highlights: CentenaryHighlight[];
}

export function CentenaryHighlightsSection({ highlights }: CentenaryHighlightsSectionProps) {
  return (
    <section id="highlights" className="scroll-mt-20">
      <SectionHeading
        eyebrow="Celebration Features"
        title="Event Highlights"
        align="left"
        className="mx-0"
        description="Key cultural, historical and civic celebrations confirmed for the 2026 Centenary."
      />

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {highlights.map((item) => {
          const Icon = ICON_MAP[item.id as keyof typeof ICON_MAP] ?? Sparkles;
          return (
            <div
              key={item.id}
              className="flex flex-col rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm transition hover:border-purple-600/25 hover:shadow-md sm:p-7"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/10">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>

              <h3 className="mt-5 font-serif text-lg font-bold text-purple-950 sm:text-xl">
                {item.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-charcoal/75">
                {item.description}
              </p>

              <div className="mt-auto pt-4">
                <span className="inline-block rounded-full bg-gold-100 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-gold-900">
                  {item.category}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
