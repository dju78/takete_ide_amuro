import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ResearchDisclaimer } from "@/components/heritage/ResearchDisclaimer";
import { SourcedSection } from "@/components/heritage/SourcedSection";
import { siteConfig } from "@/lib/site-config";
import {
  BOOK_FESTIVALS,
  BOOK_SOURCE_NOTE,
  BOOK_SOURCE_TITLE,
} from "@/content/history/web/from-hilltops-to-valley";
import { BOOK_FESTIVAL_DETAILS } from "@/content/history/web/from-hilltops-to-valley-expanded";

export const metadata: Metadata = {
  title: "Festivals of Takete-Ide",
  description:
    "A community-manuscript account of Christmas, New Year, Easter, New Yam, Egungun/Epa, Ogun, Imole and Takete-Ide Day.",
  alternates: {
    canonical: `${siteConfig.url}/heritage/festivals`,
  },
};

export default function FestivalsPage() {
  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb
            items={[
              { label: "Culture & Heritage", href: "/heritage" },
              { label: "Festivals" },
            ]}
          />
          <div className="mt-4 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
              <CalendarDays className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h1 className="font-serif text-4xl font-bold sm:text-5xl">Festivals of Takete-Ide</h1>
              <p className="mt-2 max-w-3xl text-white/85">
                Religious, cultural and community celebrations recorded in the supplied historical manuscript.
              </p>
            </div>
          </div>
        </Container>
      </div>

      <Container className="max-w-5xl py-14 sm:py-16">
        <ResearchDisclaimer />

        <div className="mt-12">
          <SourcedSection
            title="A calendar of faith, harvest and community"
            status="documentary_evidence"
            sourceNote={`${BOOK_SOURCE_TITLE}. ${BOOK_SOURCE_NOTE}`}
          >
            <p>
              Chapter Twelve describes festivals as moments when people gather, renew social bonds and
              preserve cultural memory through worship, food, music, dress, dance and communal celebration.
              The summaries below follow that account and do not replace current event announcements.
            </p>
          </SourcedSection>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {BOOK_FESTIVALS.map((festival) => {
            const expanded = BOOK_FESTIVAL_DETAILS.find((item) => item.name === festival.name);
            return (
              <article
                key={festival.name}
                className="rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm"
              >
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold-700">
                  {festival.timing}
                </p>
                <h2 className="mt-2 font-serif text-xl font-bold text-purple-950">{festival.name}</h2>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/80">{festival.summary}</p>
                {expanded && (
                  <ul className="mt-4 space-y-2 border-t border-purple-100 pt-4 text-sm leading-relaxed text-charcoal/75">
                    {expanded.details.map((detail) => (
                      <li key={detail} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" aria-hidden="true" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl border border-purple-200 bg-purple-50/60 p-6 text-sm leading-relaxed text-charcoal/80">
          <strong className="text-purple-950">Living tradition:</strong> Dates and practices can evolve. Where
          the manuscript gives a specific date — such as 7 July for the New Yam Festival — this page records
          the manuscript&rsquo;s statement. Current community programmes should be checked against contemporary
          announcements.
        </div>
      </Container>
    </div>
  );
}
