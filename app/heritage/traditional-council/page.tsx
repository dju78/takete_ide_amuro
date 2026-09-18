import type { Metadata } from "next";
import Link from "next/link";
import { Crown, Users, Scale, Landmark } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SourcedSection } from "@/components/heritage/SourcedSection";
import { siteConfig } from "@/lib/site-config";
import {
  BOOK_CHIEFTAINCY_CATEGORIES,
  BOOK_CHIEFTAINCY_PROCESS,
  BOOK_COUNCIL_FUNCTIONS,
  BOOK_COUNCIL_HIERARCHY,
  BOOK_WARDS,
} from "@/content/history/web/from-hilltops-to-valley-expanded";
import {
  BOOK_SOURCE_NOTE,
  BOOK_SOURCE_TITLE,
} from "@/content/history/web/from-hilltops-to-valley";

export const metadata: Metadata = {
  title: "Traditional Council & Chieftaincy",
  description:
    "The traditional governance structure, hierarchy, ward rotation and chieftaincy categories of Takete-Ide.",
  alternates: {
    canonical: `${siteConfig.url}/heritage/traditional-council`,
  },
};

export default function TraditionalCouncilPage() {
  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white sm:py-16">
        <Container>
          <Breadcrumb
            items={[
              { label: "Culture & Heritage", href: "/heritage" },
              { label: "Traditional Institution", href: "/heritage/traditional-institution" },
              { label: "Council & Chieftaincy" },
            ]}
          />
          <div className="mt-5 flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
              <Crown className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-300">Traditional governance</p>
              <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">Traditional Council &amp; Chieftaincy</h1>
              <p className="mt-3 max-w-3xl text-white/85">
                The Olu’de of Takete-Ide, the Council of Titled Chiefs, ward leadership, rotation, and the traditional categories of chieftaincy.
              </p>
            </div>
          </div>
        </Container>
      </div>

      <Container className="max-w-6xl py-14 sm:py-16">
        <div>
          <SourcedSection
            title="Functions of the Traditional Council"
          >
            <p>
              The Traditional Council operates as both a paramount governance organ and a custodian
              of cultural heritage, overseeing peace-building, customary law, dispute resolution,
              and community representation across Takete-Ide.
            </p>
          </SourcedSection>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {BOOK_COUNCIL_FUNCTIONS.map((item, index) => (
            <article key={item} className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gold-100 text-xs font-bold text-gold-900">
                  {index + 1}
                </span>
                <p className="text-sm leading-relaxed text-charcoal/80">{item}</p>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-14">
          <div className="flex items-center gap-3">
            <Landmark className="h-5 w-5 text-purple-600" aria-hidden="true" />
            <h2 className="font-serif text-2xl font-bold text-purple-950">Traditional Council Hierarchy</h2>
          </div>
          <div className="mt-7 grid gap-4 lg:grid-cols-4">
            {BOOK_COUNCIL_HIERARCHY.map((item, index) => (
              <article key={item.level} className="relative rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-gold-700">Level {index + 1}</span>
                <h3 className="mt-2 font-serif text-lg font-bold text-purple-950">{item.level}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/75">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-3xl border border-purple-600/10 bg-purple-50/50 p-6">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-purple-600" aria-hidden="true" />
              <h2 className="font-serif text-xl font-bold text-purple-950">The three broad wards</h2>
            </div>
            <div className="mt-5 space-y-3">
              {BOOK_WARDS.map((ward) => (
                <div key={ward} className="rounded-xl bg-white px-4 py-3 font-semibold text-purple-950 shadow-xs">
                  {ward}
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-charcoal/75">
              The nomination to the Olu’de stool rotates among these three wards and their component lineages,
              embodying an established principle of equitable representation.
            </p>
          </div>

          <div className="rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Scale className="h-5 w-5 text-community-green" aria-hidden="true" />
              <h2 className="font-serif text-xl font-bold text-purple-950">How a chief is nominated</h2>
            </div>
            <ol className="mt-5 space-y-4">
              {BOOK_CHIEFTAINCY_PROCESS.map((step, index) => (
                <li key={step} className="flex gap-3 text-sm leading-relaxed text-charcoal/80">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-community-green/10 text-xs font-bold text-community-green">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-serif text-2xl font-bold text-purple-950">Four categories of chieftaincy</h2>
          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {BOOK_CHIEFTAINCY_CATEGORIES.map((item) => (
              <article key={item.name} className="rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold-700">Chieftaincy category</p>
                <h3 className="mt-2 font-serif text-xl font-bold text-purple-950">{item.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/80">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-12 rounded-2xl border border-purple-600/10 bg-white p-6 text-sm leading-relaxed text-charcoal/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif font-bold text-purple-950 text-base">Rulers of Takete-Ide</h3>
            <p className="mt-1 text-xs sm:text-sm text-charcoal/70">
              For the complete chronological roll and profile of past and present Olu’de monarchs of Takete-Ide.
            </p>
          </div>
          <Link href="/heritage/traditional-institution" className="inline-flex shrink-0 items-center rounded-full bg-purple-700 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-purple-800">
            View the Olu’de register →
          </Link>
        </div>
      </Container>
    </div>
  );
}
