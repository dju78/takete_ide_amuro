import type { Metadata } from "next";
import { Award } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ResearchDisclaimer } from "@/components/heritage/ResearchDisclaimer";
import { SourcedSection } from "@/components/heritage/SourcedSection";
import { siteConfig } from "@/lib/site-config";
import {
  BOOK_PACESETTERS,
  BOOK_SOURCE_NOTE,
  BOOK_SOURCE_TITLE,
} from "@/content/history/web/from-hilltops-to-valley";
import { BOOK_ADDITIONAL_PACESETTERS } from "@/content/history/web/from-hilltops-to-valley-expanded";

export const metadata: Metadata = {
  title: "Pacesetters & Community Firsts",
  description:
    "A manuscript-based record of notable firsts in Takete-Ide across faith, education, professions and public life.",
  alternates: {
    canonical: `${siteConfig.url}/heritage/pacesetters`,
  },
};

function FirstsTable({
  entries,
  startAt = 1,
}: {
  entries: readonly (readonly [string, string])[];
  startAt?: number;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-purple-600/10 bg-white shadow-sm">
      <div className="hidden grid-cols-[1fr_1.5fr] bg-purple-50 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-purple-950 sm:grid">
        <span>Community first</span>
        <span>Person / milestone recorded</span>
      </div>
      <div className="divide-y divide-purple-50">
        {entries.map(([label, value], index) => (
          <div
            key={`${label}-${value}`}
            className="grid gap-1 px-6 py-4 sm:grid-cols-[1fr_1.5fr] sm:gap-6"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-100 text-xs font-bold text-gold-900">
                {startAt + index}
              </span>
              <p className="font-semibold text-purple-950">{label}</p>
            </div>
            <p className="pl-9 text-sm leading-relaxed text-charcoal/80 sm:pl-0">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PacesettersPage() {
  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb
            items={[
              { label: "Culture & Heritage", href: "/heritage" },
              { label: "Pacesetters & Community Firsts" },
            ]}
          />
          <div className="mt-4 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
              <Award className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h1 className="font-serif text-4xl font-bold sm:text-5xl">
                Pacesetters &amp; Community Firsts
              </h1>
              <p className="mt-2 max-w-3xl text-white/85">
                People and milestones recorded by the community manuscript as notable firsts in Takete-Ide.
              </p>
            </div>
          </div>
        </Container>
      </div>

      <Container className="max-w-5xl py-14 sm:py-16">
        <ResearchDisclaimer />

        <div className="mt-12">
          <SourcedSection
            title="A Chapter of Firsts"
            status="documentary_evidence"
            sourceNote={`${BOOK_SOURCE_TITLE}. ${BOOK_SOURCE_NOTE}`}
          >
            <p>
              Chapter Ten of the supplied manuscript brings together a community record of people and
              institutions described as the first in their field or role. The list below keeps the manuscript&rsquo;s
              framing rather than treating each entry as independently verified biography.
            </p>
          </SourcedSection>
        </div>

        <div className="mt-10">
          <FirstsTable entries={BOOK_PACESETTERS} />
        </div>

        <section className="mt-12">
          <h2 className="font-serif text-2xl font-bold text-purple-950">Additional firsts preserved in the manuscript</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-charcoal/70">
            A second pass through the manuscript identified additional entries that were not included in the first
            website update. Where the source itself is incomplete or unclear, that uncertainty is shown rather than filled in.
          </p>
          <div className="mt-7">
            <FirstsTable entries={BOOK_ADDITIONAL_PACESETTERS} startAt={BOOK_PACESETTERS.length + 1} />
          </div>
        </section>

        <div className="mt-8 rounded-2xl border border-gold-500/25 bg-gold-50 p-5 text-sm leading-relaxed text-charcoal/80">
          <strong className="text-purple-950">Verification note:</strong> The website is publishing these entries
          as a structured transcription of the supplied community history. Documentary records, family archives,
          school records and corrections from the community can be used to strengthen individual entries over time.
        </div>
      </Container>
    </div>
  );
}
