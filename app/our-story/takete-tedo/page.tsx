import type { Metadata } from "next";
import { MapPinned, Hammer, UsersRound } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ResearchDisclaimer } from "@/components/heritage/ResearchDisclaimer";
import { SourcedSection } from "@/components/heritage/SourcedSection";
import { siteConfig } from "@/lib/site-config";
import {
  BOOK_TAKETE_TEDO,
} from "@/content/history/web/from-hilltops-to-valley-expanded";
import {
  BOOK_SOURCE_NOTE,
  BOOK_SOURCE_TITLE,
} from "@/content/history/web/from-hilltops-to-valley";

export const metadata: Metadata = {
  title: "Takete-Tedo, Okegada — Further Migration",
  description:
    "The manuscript account of the further migration from Takete-Ide to Takete-Tedo at Okegada from 1949 onward.",
  alternates: {
    canonical: `${siteConfig.url}/our-story/takete-tedo`,
  },
};

export default function TaketeTedoPage() {
  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white sm:py-16">
        <Container>
          <Breadcrumb
            items={[
              { label: "Our Story", href: "/our-story" },
              { label: "Takete-Tedo, Okegada" },
            ]}
          />
          <div className="mt-5 flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
              <MapPinned className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-300">Further Migration</p>
              <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">Takete-Tedo, Okegada</h1>
              <p className="mt-3 max-w-3xl text-white/85">
                A later chapter in Takete-Ide migration history, beginning in the late 1940s and growing
                through kinship, road access and communal labour.
              </p>
            </div>
          </div>
        </Container>
      </div>

      <Container className="max-w-5xl py-14 sm:py-16">
        <ResearchDisclaimer />

        <div className="mt-12">
          <SourcedSection
            title="A second settlement, one Takete-Ide community"
            status="oral_history"
            sourceNote={`${BOOK_SOURCE_TITLE}, Chapter Six. ${BOOK_TAKETE_TEDO.sourceNote} ${BOOK_SOURCE_NOTE}`}
          >
            <p>{BOOK_TAKETE_TEDO.introduction}</p>
            <p>
              The account does not treat Takete-Tedo as a separate people. Its central theme is continuity:
              families moved for practical reasons while maintaining their identity, farms, kinship and ties
              with the main Takete-Ide settlement.
            </p>
          </SourcedSection>
        </div>

        <section className="mt-12">
          <h2 className="font-serif text-2xl font-bold text-purple-950">Migration milestones</h2>
          <div className="mt-7 space-y-4">
            {BOOK_TAKETE_TEDO.milestones.map((item) => (
              <article key={`${item.period}-${item.title}`} className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-gold-700">{item.period}</p>
                <h3 className="mt-1 font-serif text-lg font-bold text-purple-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/80">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <UsersRound className="h-5 w-5 text-purple-600" aria-hidden="true" />
              <h2 className="font-serif text-xl font-bold text-purple-950">Earliest recorded neighbours at Okegada</h2>
            </div>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-charcoal/80">
              {BOOK_TAKETE_TEDO.firstRecordedNeighbours.map((name) => (
                <li key={name} className="rounded-xl bg-purple-50/50 px-3 py-2">{name}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Hammer className="h-5 w-5 text-community-green" aria-hidden="true" />
              <h2 className="font-serif text-xl font-bold text-purple-950">Building through communal labour</h2>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-charcoal/80">
              The manuscript remembers Overseer Cornelius Maiye as a local builder who supervised several
              early houses with help from builders in neighbouring communities. Labour was communal: people
              carried sand and water and worked together to establish homes for incoming families.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-2xl font-bold text-purple-950">Takete-Ide settlers recorded in the manuscript</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-charcoal/70">
            The following names are reproduced as a structured community record. They follow the spelling
            in the manuscript as closely as possible and remain open to family corrections and additions.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {BOOK_TAKETE_TEDO.recordedSettlers.map((name) => (
              <div key={name} className="rounded-xl border border-purple-100 bg-white px-4 py-3 text-sm font-medium text-purple-950 shadow-xs">
                {name}
              </div>
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
