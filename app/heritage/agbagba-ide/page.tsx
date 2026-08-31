import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ShieldCheck, Music, FileText, Info } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { AGBAGBA_IDE_TRADITION } from "@/content/history/web/agbagba-ide";

export const metadata: Metadata = {
  title: "Agbagba Ide — Symbol, Memory and Community Tradition | Takete-Ide Amuro",
  description:
    "Explore the sacred cultural memory, praise poetry, and protective symbolism of Agbagba Ide in Takete-Ide heritage.",
};

export default function AgbagbaIdePage() {
  return (
    <div className="bg-ivory">
      {/* Hero */}
      <div className="bg-purple-700 py-16 text-white sm:py-20">
        <Container>
          <Breadcrumb
            items={[
              { label: "Culture & Heritage", href: "/heritage" },
              { label: "Agbagba Ide" },
            ]}
          />
          <p className="mt-4 inline-block rounded-full bg-gold-500/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
            Cultural Tradition &amp; Community Memory
          </p>
          <h1 className="mt-3 font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {AGBAGBA_IDE_TRADITION.title}
          </h1>
          <p className="mt-2 text-xl font-medium text-gold-300 sm:text-2xl">
            {AGBAGBA_IDE_TRADITION.subtitle}
          </p>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/90">
            Revered across generations, Agbagba Ide stands at the heart of Takete-Ide cultural
            identity—a sacred natural sanctuary remembered for deliverance, unity, and resilience.
          </p>
        </Container>
      </div>

      <Container className="py-14 sm:py-16">
        {/* Main Narrative Card */}
        <section className="overflow-hidden rounded-3xl border border-purple-600/10 bg-white p-8 shadow-sm sm:p-10 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-0.5 text-xs font-semibold text-gold-800">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Community Tradition
              </span>
              <h2 className="mt-4 font-serif text-2xl font-bold text-purple-900 sm:text-3xl">
                A Sanctuary in Times of Conflict
              </h2>
              <p className="mt-4 text-base leading-relaxed text-charcoal/85">
                {AGBAGBA_IDE_TRADITION.summary}
              </p>
              <p className="mt-3 text-base leading-relaxed text-charcoal/80">
                During the nineteenth-century regional wars, when cavalry raids threatened communities
                across the confluence uplands, community traditions describe Agbagba Ide as a place of
                refuge and protection. Within community belief, the sanctuary came to symbolise divine
                protection, resilience and unity, inspiring enduring communal solidarity.
              </p>
            </div>

            <div className="rounded-2xl border border-gold-500/30 bg-gold-100/50 p-6 sm:p-7">
              <div className="flex items-start gap-3">
                <Info className="mt-1 h-5 w-5 shrink-0 text-gold-700" aria-hidden="true" />
                <div>
                  <h3 className="font-serif text-base font-bold text-purple-950">Editorial &amp; Cultural Note</h3>
                  <p className="mt-2 text-xs leading-relaxed text-charcoal/80">
                    {AGBAGBA_IDE_TRADITION.editorialSafeguards}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cultural Significance Pillars */}
        <section className="mt-16">
          <SectionHeading
            eyebrow="Heritage"
            title="Pillars of Cultural Significance"
            align="left"
            className="mx-0"
            description="How the memory of Agbagba Ide shaped community institutions, symbols, and oral lore."
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {AGBAGBA_IDE_TRADITION.culturalSignificance.map((item, i) => {
              const [title, desc] = item.split(": ");
              return (
                <div
                  key={i}
                  className="flex flex-col rounded-2xl border border-purple-600/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                    <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-serif text-lg font-bold text-purple-900">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Praise Traditions: Anthem & Oríkì */}
        <section className="mt-16 rounded-3xl border border-purple-600/10 bg-white p-8 shadow-sm sm:p-10">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-0.5 text-xs font-semibold text-purple-800">
                <Music className="h-3.5 w-3.5" aria-hidden="true" />
                Living Oral Heritage
              </span>
              <h3 className="mt-3 font-serif text-2xl font-bold text-purple-900">
                Anthem &amp; Praise Traditions
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/80">
                The cultural memory of Agbagba Ide is commemorated in the preserved <strong>Takete-Ide
                Community Anthem</strong> and the celebrated <strong>Oríkì Agbagba Ide</strong>.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/75">
                The original Yoruba poetry commemorates the protective power of the sanctuary, the
                sweetness and blessing of the land (<em>&ldquo;Ile nghin san ghun wara at’oyin&rdquo;</em>),
                and the collective call for sons and daughters to lift Takete-Ide high in unity.
              </p>
            </div>

            <div className="rounded-2xl border border-purple-600/10 bg-purple-50/60 p-6 sm:p-8">
              <div className="flex items-start gap-3">
                <FileText className="mt-1 h-5 w-5 shrink-0 text-purple-700" aria-hidden="true" />
                <div>
                  <h4 className="font-serif text-base font-bold text-purple-950">Archive Preservation Status</h4>
                  <p className="mt-2 text-xs leading-relaxed text-charcoal/75">
                    {AGBAGBA_IDE_TRADITION.associatedPraiseTraditions.editorialNote}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Link
                      href="/heritage/takete-ide-anthem"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 hover:underline"
                    >
                      Read full verbatim Anthem &amp; Oríkì →
                    </Link>
                    <span className="text-charcoal/30">•</span>
                    <Link
                      href="/archive/takete-history-original"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 hover:underline"
                    >
                      View Archive record →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Return & Explore Navigation */}
        <div className="mt-16 rounded-3xl bg-purple-700 p-8 text-white shadow-sm sm:p-10">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-serif text-2xl font-bold">Explore Our Complete Heritage</h2>
              <p className="mt-2 text-sm text-white/85">
                Discover the migration history, festival calendar, and landscape of Takete-Ide.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/our-story" size="md">
                Our Story &amp; Timeline
              </ButtonLink>
              <ButtonLink
                href="/heritage"
                variant="secondary"
                size="md"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Culture &amp; Heritage
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
