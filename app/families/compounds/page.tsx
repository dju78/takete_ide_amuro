import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ScrollText, Users, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VerificationBadge } from "@/components/ui/Badge";
import { getCompounds } from "@/lib/data/families";
import { DOCUMENTED_HISTORICAL_COMPOUNDS } from "@/content/history/web/historical-family-compounds";

export const metadata: Metadata = {
  title: "Compounds",
  description:
    "Documented Takete-Ide compounds and their historical family associations from community historical records.",
};

export default async function CompoundsPage() {
  const compounds = await getCompounds();

  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "Families & Oríkì", href: "/families" }, { label: "Compounds" }]} />
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Compounds of Takete-Ide</h1>
          <p className="mt-3 max-w-2xl text-white/85">
            Traditional Ward and Compound names preserved in community memory, family lineage, and
            historical records.
          </p>
        </Container>
      </div>

      <Container className="py-16">
        {/* Section A: Documented Historical Compounds from Canonical Manuscript */}
        <section>
          <SectionHeading
            eyebrow="Historical Record"
            title="Compounds Documented in the Historical Olu’de Register"
            align="left"
            className="mx-0"
          />
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-charcoal/80">
            The supplied community historical manuscript, with row relationships confirmed by the project
            owner, preserves several Ward/Compound names in its historical Olu’de register. These records
            are presented here as documented historical associations and should not be treated as a complete
            list of every compound in Takete-Ide.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {DOCUMENTED_HISTORICAL_COMPOUNDS.map((c) => (
              <div
                key={c.id}
                className="flex flex-col justify-between rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-800">
                      <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                      Ward / Compound
                    </span>
                    <span className="rounded-full bg-gold-100 px-2.5 py-0.5 text-[11px] font-medium text-gold-800">
                      Historical manuscript record
                    </span>
                  </div>

                  <h2 className="mt-4 font-serif text-2xl font-bold text-purple-950">{c.name}</h2>

                  <div className="mt-5 space-y-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-charcoal/60">
                        {c.documentedFamilies.length > 1 ? "Families Documented" : "Family Documented"}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {c.documentedFamilies.map((fam) => (
                          <span
                            key={fam}
                            className="inline-flex items-center rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-900"
                          >
                            {fam}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-charcoal/60">
                        {c.associatedRulers.length > 1
                          ? "Associated Historical Olu’des"
                          : "Associated Historical Olu’de"}
                      </p>
                      <ul className="mt-1 space-y-0.5 text-xs text-charcoal/80">
                        {c.associatedRulers.map((ruler) => (
                          <li key={ruler} className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                            {ruler}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-purple-100 pt-4">
                  <p className="text-[11px] italic text-charcoal/60">
                    Source: Takete-Ide Historical Community Account register
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Cross-link to Traditional Institution */}
          <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-gold-500/30 bg-gold-50/70 p-6 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-500/20 text-gold-800">
                <ScrollText className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-purple-950">
                  Preserved in the Historical Olu’de Register
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-charcoal/75">
                  These family and compound associations are preserved in the historical Olu’de register.
                </p>
              </div>
            </div>
            <Link
              href="/heritage/traditional-institution"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-900 hover:text-purple-700 hover:underline"
            >
              View Traditional Institution register
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </section>

        {/* Section B: Community Compound Profiles */}
        <section className="mt-16 border-t border-purple-600/10 pt-16">
          <SectionHeading
            eyebrow="Community Directory"
            title="Community Compound Profiles"
            align="left"
            className="mx-0"
            description="Verified compound profiles, local geography, and oral histories contributed by community members."
          />

          {compounds.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {compounds.map((c) => (
                <div key={c.id} className="overflow-hidden rounded-2xl border border-purple-600/10 bg-white shadow-sm">
                  {c.photo_url && (
                    <div className="relative aspect-[16/10]">
                      <Image src={c.photo_url} alt={c.name} fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-cover" />
                    </div>
                  )}
                  <div className="p-5">
                    <p className="font-serif text-lg font-bold text-purple-600">{c.name}</p>
                    {c.alternative_name && <p className="text-xs text-charcoal/50">Also known as {c.alternative_name}</p>}
                    {c.description && <p className="mt-2 text-sm text-charcoal/70">{c.description}</p>}
                    {c.approximate_location && (
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-charcoal/50">
                        <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {c.approximate_location}
                      </p>
                    )}
                    <VerificationBadge status={c.verification_status} className="mt-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-purple-100 bg-purple-50/40 p-6 text-center sm:p-8">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
                <Users className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-3 font-serif text-lg font-bold text-purple-950">
                Community Compound Profiles Under Compilation
              </h3>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-charcoal/75">
                Detailed compound profiles, photographs and oral histories will be added as they are confirmed
                with families and community representatives.
              </p>
              <div className="mt-4">
                <Link
                  href="/families/contribute"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-community-green hover:underline"
                >
                  Help document your compound or family →
                </Link>
              </div>
            </div>
          )}
        </section>
      </Container>
    </div>
  );
}
