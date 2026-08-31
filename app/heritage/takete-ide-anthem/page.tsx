import type { Metadata } from "next";
import Link from "next/link";
import { Music, Sparkles, ArrowRight, Info, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ButtonLink } from "@/components/ui/Button";
import { TAKETE_IDE_ANTHEM, ORIKI_AGBAGBA_IDE } from "@/content/history/web/living-heritage";

export const metadata: Metadata = {
  title: "Takete-Ide Anthem & Living Oral Heritage | Takete-Ide Amuro",
  description:
    "The preserved Takete-Ide Community Anthem and Oríkì Agbagba Ide, recorded verbatim from the canonical community historical account.",
};

export default function TaketeIdeAnthemPage() {
  return (
    <div className="bg-ivory">
      {/* Hero */}
      <div className="bg-purple-700 py-16 text-white sm:py-20">
        <Container>
          <Breadcrumb
            items={[
              { label: "Culture & Heritage", href: "/heritage" },
              { label: "Community Anthem" },
            ]}
          />
          <p className="mt-4 inline-block rounded-full bg-gold-500/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
            Living Oral Heritage
          </p>
          <h1 className="mt-3 font-serif text-4xl font-bold sm:text-5xl lg:text-6xl">
            {TAKETE_IDE_ANTHEM.title}
          </h1>
          <p className="mt-2 text-xl font-medium text-gold-300 sm:text-2xl">
            {TAKETE_IDE_ANTHEM.classification}
          </p>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/90">
            Preserved across generations, the community anthem and praise poetry embody the resilience,
            unity, and cultural memory of the Takete-Ide people.
          </p>
        </Container>
      </div>

      <Container className="py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          {/* Main Column: Verbatim Anthem & Oríkì */}
          <div className="space-y-12">
            {/* Section 1: The Community Anthem */}
            <section className="overflow-hidden rounded-3xl border border-purple-600/10 bg-white p-7 sm:p-10 shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                  <Music className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-700">
                  Original Yoruba Text
                </span>
              </div>

              <h2 className="mt-3 font-serif text-2xl font-bold text-purple-900 sm:text-3xl">
                Takete-Ide Anthem
              </h2>
              <p className="mt-2 text-xs italic text-charcoal/70">
                {TAKETE_IDE_ANTHEM.sourceFraming}
              </p>

              {/* Anthem Lyrics Card */}
              <div className="mt-6 rounded-2xl border border-gold-500/30 bg-gradient-to-br from-gold-100/40 via-purple-50/30 to-gold-100/20 p-6 sm:p-8">
                <div className="space-y-3 font-serif text-base sm:text-lg leading-relaxed text-purple-950 font-medium">
                  {TAKETE_IDE_ANTHEM.originalText.map((line, idx) =>
                    line === "" ? (
                      <div key={idx} className="h-2" />
                    ) : (
                      <p
                        key={idx}
                        className={
                          line.startsWith("Solo/") || line.startsWith("All/")
                            ? "pl-4 text-sm font-sans font-bold text-purple-800"
                            : ""
                        }
                      >
                        {line}
                      </p>
                    ),
                  )}
                </div>

                <div className="mt-6 border-t border-gold-500/20 pt-4 text-xs text-charcoal/70">
                  <p>
                    <strong>Performance Notations:</strong> {TAKETE_IDE_ANTHEM.performanceNotes}
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2: Oríkì Agbagba Ide */}
            <section className="overflow-hidden rounded-3xl border border-purple-600/10 bg-white p-7 sm:p-10 shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-100 text-gold-800">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-gold-800">
                  Preserved Praise Poetry
                </span>
              </div>

              <h2 className="mt-3 font-serif text-2xl font-bold text-purple-900 sm:text-3xl">
                {ORIKI_AGBAGBA_IDE.title}
              </h2>
              <p className="mt-2 text-xs italic text-charcoal/70">
                {ORIKI_AGBAGBA_IDE.sourceFraming}
              </p>

              {/* Oríkì Card */}
              <div className="mt-6 rounded-2xl border border-purple-600/10 bg-purple-50/40 p-6 sm:p-8">
                <div className="space-y-2 font-serif text-base sm:text-lg leading-relaxed text-purple-950 font-medium">
                  {ORIKI_AGBAGBA_IDE.originalText.map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>

                <div className="mt-6 border-t border-purple-200/50 pt-4 text-xs text-charcoal/70">
                  <p>{ORIKI_AGBAGBA_IDE.editorialNote}</p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar Column: Context, Safeguards & Navigation */}
          <aside className="space-y-6">
            {/* Source & Linguistic Safeguards */}
            <div className="rounded-2xl border border-gold-500/30 bg-gold-100/50 p-6 sm:p-7">
              <div className="flex items-start gap-3">
                <Info className="mt-1 h-5 w-5 shrink-0 text-gold-700" aria-hidden="true" />
                <div>
                  <h3 className="font-serif text-base font-bold text-purple-950">Source &amp; Text Integrity</h3>
                  <p className="mt-2 text-xs leading-relaxed text-charcoal/80">
                    The lyrics and poetry are presented verbatim from the supplied community historical
                    manuscript. In accordance with editorial guidelines, original dialectical expressions
                    are preserved faithfully without invented English translations.
                  </p>
                </div>
              </div>
            </div>

            {/* Cultural Significance Card */}
            <div className="rounded-2xl border border-purple-600/10 bg-white p-6 sm:p-7 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-3 font-serif text-lg font-bold text-purple-900">Cultural Significance</h3>
              <p className="mt-2 text-xs leading-relaxed text-charcoal/75">
                The anthem celebrates the renown of Takete-Ide, its elevated placement, and the blessing
                of the land (<em>&ldquo;Ile nghin san ghun wara at’oyin&rdquo;</em>), closing with the
                sacred call for all sons and daughters to lift Takete-Ide high in unity.
              </p>
            </div>

            {/* Related Heritage Links */}
            <div className="rounded-2xl border border-purple-600/10 bg-white p-6 sm:p-7 shadow-sm">
              <h3 className="font-serif text-base font-bold text-purple-900">Related Heritage</h3>
              <ul className="mt-4 space-y-3 text-xs">
                <li>
                  <Link
                    href="/heritage/agbagba-ide"
                    className="group flex items-center justify-between text-charcoal/80 hover:text-purple-700"
                  >
                    <span>Agbagba Ide Tradition</span>
                    <ArrowRight className="h-3.5 w-3.5 text-purple-600 transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/oriki"
                    className="group flex items-center justify-between text-charcoal/80 hover:text-purple-700"
                  >
                    <span>Oríkì Archive</span>
                    <ArrowRight className="h-3.5 w-3.5 text-purple-600 transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/our-story"
                    className="group flex items-center justify-between text-charcoal/80 hover:text-purple-700"
                  >
                    <span>Our Story &amp; Migration Timeline</span>
                    <ArrowRight className="h-3.5 w-3.5 text-purple-600 transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/archive/takete-history-original"
                    className="group flex items-center justify-between text-charcoal/80 hover:text-purple-700"
                  >
                    <span>Canonical Archive Document</span>
                    <ArrowRight className="h-3.5 w-3.5 text-purple-600 transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>

        {/* Return & Explore Banner */}
        <div className="mt-16 rounded-3xl bg-purple-700 p-8 text-white shadow-sm sm:p-10">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-serif text-2xl font-bold">Explore Our Complete Heritage</h2>
              <p className="mt-2 text-sm text-white/85">
                Discover the traditional institution, families, festivals, and landscapes of Takete-Ide.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/heritage" size="md">
                Culture &amp; Heritage
              </ButtonLink>
              <ButtonLink
                href="/heritage/traditional-institution"
                variant="secondary"
                size="md"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Traditional Institution
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
