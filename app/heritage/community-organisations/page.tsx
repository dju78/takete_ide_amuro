import type { Metadata } from "next";
import { UsersRound } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ResearchDisclaimer } from "@/components/heritage/ResearchDisclaimer";
import { SourcedSection } from "@/components/heritage/SourcedSection";
import { siteConfig } from "@/lib/site-config";
import {
  BOOK_COMMUNITY_ORGANISATIONS,
  BOOK_SOURCE_NOTE,
  BOOK_SOURCE_TITLE,
} from "@/content/history/web/from-hilltops-to-valley";

export const metadata: Metadata = {
  title: "Community Organisations",
  description:
    "The community associations recorded in the Takete-Ide historical manuscript, including TIPU, Jet Club, Owe, TISU and Egbe Ode.",
  alternates: {
    canonical: `${siteConfig.url}/heritage/community-organisations`,
  },
};

export default function CommunityOrganisationsPage() {
  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb
            items={[
              { label: "Culture & Heritage", href: "/heritage" },
              { label: "Community Organisations" },
            ]}
          />
          <div className="mt-4 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
              <UsersRound className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h1 className="font-serif text-4xl font-bold sm:text-5xl">Community Organisations</h1>
              <p className="mt-2 max-w-3xl text-white/85">
                Associations the manuscript describes as part of Takete-Ide&rsquo;s communal strength at home and in the diaspora.
              </p>
            </div>
          </div>
        </Container>
      </div>

      <Container className="max-w-5xl py-14 sm:py-16">
        <ResearchDisclaimer />

        <div className="mt-12">
          <SourcedSection
            title="Weaving the communal soul"
            status="documentary_evidence"
            sourceNote={`${BOOK_SOURCE_TITLE}. ${BOOK_SOURCE_NOTE}`}
          >
            <p>
              Chapter Thirteen presents community associations as institutions that carry cooperation,
              education, farming support, youth development and security across generations. The page below
              summarises the roles attributed to them in the manuscript.
            </p>
          </SourcedSection>
        </div>

        <div className="mt-10 space-y-5">
          {BOOK_COMMUNITY_ORGANISATIONS.map((organisation, index) => (
            <article
              key={organisation.name}
              className="rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm sm:p-7"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-100 font-serif text-sm font-bold text-gold-900">
                  {index + 1}
                </span>
                <div>
                  <h2 className="font-serif text-xl font-bold text-purple-950">{organisation.name}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/80">{organisation.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-gold-500/25 bg-gold-50 p-5 text-sm leading-relaxed text-charcoal/80">
          This is a historical-source view of the organisations. Current officers, constitutions, branch details,
          programmes and contact information should continue to come from the organisations themselves or verified
          community records.
        </div>
      </Container>
    </div>
  );
}
