import type { Metadata } from "next";
import { MapPin, Mountain, Waves, Route } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ResearchDisclaimer } from "@/components/heritage/ResearchDisclaimer";
import { SourcedSection } from "@/components/heritage/SourcedSection";
import { siteConfig } from "@/lib/site-config";
import { BOOK_LAND_PROFILE } from "@/content/history/web/from-hilltops-to-valley-expanded";
import {
  BOOK_SOURCE_NOTE,
  BOOK_SOURCE_TITLE,
} from "@/content/history/web/from-hilltops-to-valley";

export const metadata: Metadata = {
  title: "Land & Landscape of Takete-Ide",
  description:
    "The manuscript record of Takete-Ide's location, neighbouring Amuro settlements, hills, rivers and water bodies.",
  alternates: {
    canonical: `${siteConfig.url}/heritage/land-and-landscape`,
  },
};

export default function LandLandscapePage() {
  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white sm:py-16">
        <Container>
          <Breadcrumb
            items={[
              { label: "Culture & Heritage", href: "/heritage" },
              { label: "Land & Landscape" },
            ]}
          />
          <div className="mt-5 flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
              <MapPin className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-300">The land</p>
              <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">Land &amp; Landscape of Takete-Ide</h1>
              <p className="mt-3 max-w-3xl text-white/85">
                Hills, rivers, neighbouring settlements and the physical setting that shaped migration,
                farming, security and everyday life.
              </p>
            </div>
          </div>
        </Container>
      </div>

      <Container className="max-w-6xl py-14 sm:py-16">
        <ResearchDisclaimer />

        <div className="mt-12">
          <SourcedSection
            title="A fertile plain surrounded by uplands"
            status="documentary_evidence"
            sourceNote={`${BOOK_SOURCE_TITLE}, Chapters One and Two. ${BOOK_SOURCE_NOTE}`}
          >
            <p>{BOOK_LAND_PROFILE.note}</p>
            <p>
              The manuscript gives the location as <strong>{BOOK_LAND_PROFILE.coordinates}</strong> and describes
              Takete-Ide as one of the seven historic settlements of Amuro District.
            </p>
          </SourcedSection>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm">
            <Route className="h-5 w-5 text-purple-600" aria-hidden="true" />
            <h2 className="mt-3 font-serif text-xl font-bold text-purple-950">Distance and access</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-charcoal/80">
              {BOOK_LAND_PROFILE.distances.map((item) => (
                <li key={item} className="rounded-xl bg-purple-50/50 px-4 py-3">{item}</li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm">
            <MapPin className="h-5 w-5 text-community-green" aria-hidden="true" />
            <h2 className="mt-3 font-serif text-xl font-bold text-purple-950">Neighbouring boundaries</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-charcoal/80">
              {BOOK_LAND_PROFILE.boundaries.map((item) => (
                <li key={item} className="rounded-xl bg-green-50/60 px-4 py-3">{item}</li>
              ))}
            </ul>
          </article>
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-2xl font-bold text-purple-950">The seven Amuro settlements recorded</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {BOOK_LAND_PROFILE.amuroSettlements.map((place) => (
              <span key={place} className="rounded-full border border-purple-100 bg-white px-4 py-2 text-sm font-semibold text-purple-950 shadow-xs">
                {place}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <Mountain className="h-5 w-5 text-gold-700" aria-hidden="true" />
              <h2 className="font-serif text-2xl font-bold text-purple-950">Hills and uplands</h2>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {BOOK_LAND_PROFILE.hills.map((hill) => (
                <div key={hill} className="rounded-xl bg-gold-50 px-4 py-3 text-sm font-semibold text-purple-950">
                  {hill}
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-charcoal/75">
              The manuscript gives particular prominence to Oke Elegan and remembers the surrounding uplands as
              central to the community’s earlier defensive settlement history.
            </p>
          </article>

          <article className="rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <Waves className="h-5 w-5 text-community-green" aria-hidden="true" />
              <h2 className="font-serif text-2xl font-bold text-purple-950">Rivers, streams and springs</h2>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {BOOK_LAND_PROFILE.waters.map((water) => (
                <div key={water} className="rounded-xl bg-green-50/60 px-4 py-3 text-sm font-semibold text-purple-950">
                  {water}
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-charcoal/75">
              The manuscript links these waters with domestic use, swimming, fishing and the practical experience
              of approaching Takete-Ide from neighbouring communities.
            </p>
          </article>
        </section>
      </Container>
    </div>
  );
}
