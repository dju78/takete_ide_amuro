import type { Metadata } from "next";
import Link from "next/link";
import { Church, Clock3, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ResearchDisclaimer } from "@/components/heritage/ResearchDisclaimer";
import { SourcedSection } from "@/components/heritage/SourcedSection";
import { siteConfig } from "@/lib/site-config";
import { BOOK_EARLY_FAITH_MILESTONES, BOOK_EDITORIAL_NOTE } from "@/content/history/web/from-hilltops-to-valley-expanded";
import { BOOK_SOURCE_NOTE, BOOK_SOURCE_TITLE } from "@/content/history/web/from-hilltops-to-valley";
import { BOOK_MULTIPLE_CONGREGATIONS_NOTE, BOOK_NON_BAPTIST_CONGREGATIONS } from "@/content/heritage/faith/book-non-baptist";

export const metadata: Metadata = {
  title: "Early Christian Milestones — Manuscript Record",
  description:
    "Non-Baptist Christian milestones from the Takete-Ide community manuscript, including the SIM record, baptisms, church building, choir, Apostolic Church, bell and ECWA LCC.",
  alternates: {
    canonical: `${siteConfig.url}/heritage/faith/manuscript-milestones`,
  },
};

export default function ManuscriptFaithMilestonesPage() {
  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white sm:py-16">
        <Container>
          <Breadcrumb
            items={[
              { label: "Faith & Religious Heritage", href: "/heritage/faith" },
              { label: "Manuscript Milestones" },
            ]}
          />
          <div className="mt-5 flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
              <Church className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-300">Community manuscript record</p>
              <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">Early Christian Milestones</h1>
              <p className="mt-3 max-w-3xl text-white/85">
                A source-based timeline of the non-Baptist Christian milestones preserved in the supplied Takete-Ide manuscript.
              </p>
            </div>
          </div>
        </Container>
      </div>

      <Container className="max-w-5xl py-14 sm:py-16">
        <ResearchDisclaimer />

        <div className="mt-12">
          <SourcedSection
            title="How this manuscript is being used"
            status="documentary_evidence"
            sourceNote={`${BOOK_SOURCE_TITLE}. ${BOOK_SOURCE_NOTE}`}
          >
            <p>{BOOK_EDITORIAL_NOTE}</p>
            <p>
              For that reason, this page deliberately omits the manuscript’s Baptist Church narrative. Baptist history elsewhere on the website remains tied to its separate church and archival sources.
            </p>
          </SourcedSection>
        </div>

        <section className="mt-10">
          <div className="space-y-5">
            {BOOK_EARLY_FAITH_MILESTONES.map((item) => (
              <article key={`${item.period}-${item.title}`} className="rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm sm:p-7">
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-100 text-gold-900">
                    <Clock3 className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold-700">{item.period}</p>
                    <h2 className="mt-1 font-serif text-xl font-bold text-purple-950">{item.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-charcoal/80">{item.detail}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 border-t border-purple-100 pt-4 text-xs text-charcoal/60">
                  <ShieldCheck className="h-4 w-4 text-community-green" aria-hidden="true" />
                  <span>Recorded from the supplied community manuscript; separate local records can add further corroboration.</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-serif text-2xl font-bold text-purple-950">Non-Baptist congregations recorded in the manuscript</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-charcoal/70">
            This list preserves the manuscript’s denominational record while deliberately excluding Baptist Church material.
            Where the manuscript does not give a complete year, the website leaves the date open rather than guessing.
          </p>
          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {BOOK_NON_BAPTIST_CONGREGATIONS.map((church) => (
              <article key={church.name} className="rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold-700">
                  {church.manuscriptDate ? `Manuscript date: ${church.manuscriptDate}` : "Date not clearly supplied"}
                </p>
                <h3 className="mt-2 font-serif text-xl font-bold text-purple-950">{church.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/80">{church.note}</p>
              </article>
            ))}
          </div>
          <p className="mt-5 rounded-2xl border border-purple-200 bg-purple-50/60 p-5 text-sm leading-relaxed text-charcoal/80">
            {BOOK_MULTIPLE_CONGREGATIONS_NOTE}
          </p>
        </section>

        <div className="mt-10 rounded-2xl border border-purple-200 bg-purple-50/60 p-5 text-sm leading-relaxed text-charcoal/80">
          This page complements the wider <Link href="/heritage/faith" className="font-semibold text-community-green hover:underline">Faith &amp; Religious Heritage archive</Link>, which also includes material from separate church records and the community media archive.
        </div>
      </Container>
    </div>
  );
}
