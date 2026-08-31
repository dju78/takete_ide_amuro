import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Compass, BookOpen, MapPin, Sparkles, HelpCircle, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Kogi Quest — Interactive Knowledge & Learning Experience",
  description:
    "Explore Kogi State through an interactive knowledge and learning experience covering history, culture, places and community knowledge.",
};

const learningAreas = [
  {
    icon: Compass,
    title: "History & Heritage",
    description: "Discover historical events, traditions, and cultural landmarks across Kogi State.",
  },
  {
    icon: MapPin,
    title: "Places & Geography",
    description: "Learn about local government areas, towns, natural features, and communities.",
  },
  {
    icon: BookOpen,
    title: "Community Knowledge",
    description: "Test your understanding of people, institutions, and civic life in the Confluence State.",
  },
  {
    icon: HelpCircle,
    title: "Interactive Quiz Format",
    description: "Engage with questions designed to educate, test knowledge, and celebrate shared history.",
  },
];

export default function KogiQuestPage() {
  return (
    <div className="bg-ivory">
      {/* Page Header */}
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "Community", href: "/tipu" }, { label: "Kogi Quest" }]} />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
            Community Learning Resource
          </p>
          <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">Kogi Quest</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/90">
            Explore Kogi State through an interactive knowledge and learning experience. Kogi Quest
            offers questions covering history, culture, places and community knowledge.
          </p>
        </Container>
      </div>

      <Container className="py-14 sm:py-16">
        {/* Launch Card */}
        <section className="overflow-hidden rounded-3xl border border-purple-600/10 bg-white p-8 shadow-sm sm:p-10 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3.5 py-1 text-xs font-semibold text-gold-800">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                External Learning Tool
              </span>
              <h2 className="mt-4 font-serif text-2xl font-bold text-purple-600 sm:text-3xl">
                Test Your Knowledge of Kogi State
              </h2>
              <p className="mt-3 text-base leading-relaxed text-charcoal/75">
                Kogi Quest is an interactive educational tool where learners, youth, and community members
                can explore questions spanning the Confluence State&rsquo;s diverse communities, geography,
                and heritage.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="https://dju78.github.io/kogiqest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-base font-semibold text-purple-900 shadow-sm transition-colors duration-200 hover:bg-gold-300 focus-visible:bg-gold-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                  aria-label="Launch Kogi Quest (opens in a new tab)"
                >
                  Launch Kogi Quest
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
                <span className="text-xs text-charcoal/60">Opens external site in a new tab</span>
              </div>
            </div>

            <div className="rounded-2xl border border-purple-600/10 bg-purple-50/50 p-6 sm:p-8">
              <h3 className="font-serif text-lg font-bold text-purple-900">About the Resource</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-charcoal/75">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" aria-hidden="true" />
                  <span>Free interactive learning experience accessible in any web browser</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" aria-hidden="true" />
                  <span>Curated questions celebrating the culture, places, and history of Kogi State</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" aria-hidden="true" />
                  <span>Safe and family-friendly community educational project</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Learning Areas */}
        <section className="mt-16">
          <SectionHeading
            eyebrow="Coverage"
            title="What You Will Explore"
            align="left"
            className="mx-0"
            description="Kogi Quest features diverse question categories exploring the heritage and landscape of Kogi State."
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {learningAreas.map((area) => {
              const Icon = area.icon;
              return (
                <div
                  key={area.title}
                  className="flex flex-col rounded-2xl border border-purple-600/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-serif text-lg font-bold text-purple-600">{area.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{area.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Community & Heritage Links */}
        <div className="mt-16 rounded-3xl bg-white p-8 shadow-sm sm:p-10">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-serif text-xl font-bold text-purple-600">
                Explore More of Takete-Ide
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-charcoal/75">
                Discover our community history, oral traditions, and the Takete-Ide Progressive Union&rsquo;s
                development programmes.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/heritage"
                className="inline-flex items-center gap-1.5 rounded-full border-2 border-purple-600 px-5 py-2.5 text-sm font-semibold text-purple-600 transition-colors hover:bg-purple-600 hover:text-white"
              >
                Culture & Heritage
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/tipu"
                className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-5 py-2.5 text-sm font-semibold text-purple-700 transition-colors hover:bg-purple-100"
              >
                TIPU Overview
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
