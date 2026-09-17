import type { Metadata } from "next";
import { Compass, UsersRound, ScrollText } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ResearchDisclaimer } from "@/components/heritage/ResearchDisclaimer";
import { SourcedSection } from "@/components/heritage/SourcedSection";
import { siteConfig } from "@/lib/site-config";
import { BOOK_SOURCE_NOTE, BOOK_SOURCE_TITLE } from "@/content/history/web/from-hilltops-to-valley";

export const metadata: Metadata = {
  title: "Amuro, Yagba & Okun Context",
  description:
    "The wider Amuro, Yagba and Okun historical context recorded in the Takete-Ide community manuscript.",
  alternates: {
    canonical: `${siteConfig.url}/heritage/amuro-okun-context`,
  },
};

const okunGroups = ["Owe", "Iyagba / Yagba", "Bunu / Abunu", "Ijumu", "Kiri", "Gbede", "Oworo"];

export default function AmuroOkunContextPage() {
  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white sm:py-16">
        <Container>
          <Breadcrumb
            items={[
              { label: "Culture & Heritage", href: "/heritage" },
              { label: "Amuro, Yagba & Okun Context" },
            ]}
          />
          <div className="mt-5 flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
              <Compass className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-300">Wider historical setting</p>
              <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">Amuro, Yagba &amp; Okun Context</h1>
              <p className="mt-3 max-w-3xl text-white/85">
                Takete-Ide’s history sits inside the wider story of Amuro, Yagba and the Okun Yoruba communities of the confluence region.
              </p>
            </div>
          </div>
        </Container>
      </div>

      <Container className="max-w-5xl py-14 sm:py-16">
        <ResearchDisclaimer />

        <div className="mt-12">
          <SourcedSection
            title="Amuro in the manuscript"
            status="community_tradition"
            sourceNote={`${BOOK_SOURCE_TITLE}, Chapter One. ${BOOK_SOURCE_NOTE}`}
          >
            <p>
              The manuscript explains the name <strong>Amuro</strong> through the traditional expression <em>Amu Oro</em>,
              which it interprets as a pot associated with poisons. It also remembers an old community symbol as a large
              pot containing seven arrows, representing the seven Amuro settlements and recalling an era of warfare and defence.
            </p>
            <p>
              The source describes the seven settlements as maintaining their own traditional councils while sharing a wider
              Amuro identity and traditional structure. These descriptions are preserved here as community historical tradition.
            </p>
          </SourcedSection>
        </div>

        <section className="mt-12 rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <UsersRound className="h-5 w-5 text-purple-600" aria-hidden="true" />
            <h2 className="font-serif text-2xl font-bold text-purple-950">Okun identity</h2>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-charcoal/80">
            The manuscript places Amuro people within the Iyagba or Yagba branch of the wider Okun Yoruba population.
            It describes Okun identity as bringing together related communities with strong linguistic and cultural affinities,
            including the following groups:
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {okunGroups.map((group) => (
              <span key={group} className="rounded-full bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-950">
                {group}
              </span>
            ))}
          </div>
          <p className="mt-5 text-sm leading-relaxed text-charcoal/75">
            The source also links the word <em>Okun</em> with the salutation widely used among these communities and notes
            its associations with strength, vitality and goodwill.
          </p>
        </section>

        <section className="mt-12">
          <div className="flex items-center gap-3">
            <ScrollText className="h-5 w-5 text-gold-700" aria-hidden="true" />
            <h2 className="font-serif text-2xl font-bold text-purple-950">Two Yagba origin traditions preserved</h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-charcoal/70">
            The manuscript does not present a single uncontested origin story. It preserves two oral traditions and treats
            their shared themes — migration and Yoruba ancestry — as the important point of convergence.
          </p>
          <div className="mt-7 grid gap-6 md:grid-cols-2">
            <article className="rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold-700">Tradition one</p>
              <h3 className="mt-2 font-serif text-xl font-bold text-purple-950">Ile-Ife ancestry</h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/80">
                One account associates Yagba ancestry with a prince from Ile-Ife whose expedition and later explanation
                about the absence of an elder adviser became connected in oral memory with the name Iyagba.
              </p>
            </article>
            <article className="rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold-700">Tradition two</p>
              <h3 className="mt-2 font-serif text-xl font-bold text-purple-950">Old-Oyo ancestry</h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/80">
                A second account links the name to <em>Iya-agba</em>, an elder woman or princess from Oyo-Ile who is
                remembered as leading a migration in search of peace and economic wellbeing.
              </p>
            </article>
          </div>
        </section>
      </Container>
    </div>
  );
}
