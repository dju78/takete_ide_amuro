import type { Metadata } from "next";
import Link from "next/link";
import { Users, MapPin, Music4, ScrollText, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VerificationBadge } from "@/components/ui/Badge";
import { IconCard } from "@/components/cards/IconCard";
import { ButtonLink } from "@/components/ui/Button";
import { getFamilies } from "@/lib/data/families";
import { DOCUMENTED_HISTORICAL_FAMILIES } from "@/content/history/web/historical-family-compounds";

export const metadata: Metadata = {
  title: "Families & Oríkì",
  description:
    "Documented Takete-Ide family names, traditional compounds, oral traditions and lineage heritage.",
};

export default async function FamiliesPage() {
  const families = await getFamilies();
  const grouped = families.reduce<Record<string, typeof families>>((acc, f) => {
    const letter = f.name[0]?.toUpperCase() ?? "#";
    acc[letter] = [...(acc[letter] ?? []), f];
    return acc;
  }, {});
  const letters = Object.keys(grouped).sort();

  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "Families & Oríkì" }]} />
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Our Families &amp; Oríkì</h1>
          <p className="mt-3 max-w-2xl text-white/85">
            The story of Takete-Ide is also the story of its families. Across generations, family names,
            compounds, oral traditions and Oríkì have preserved identity, ancestry, values and collective
            memory. This digital archive is dedicated to documenting and preserving that heritage for
            future generations.
          </p>
        </Container>
      </div>

      <Container className="py-16">
        <div className="grid gap-4 sm:grid-cols-3">
          <IconCard
            icon={Music4}
            title="Oríkì Archive"
            description="Listen to and read the praise poetry of Takete-Ide families."
            href="/oriki"
            tone="gold"
          />
          <IconCard
            icon={MapPin}
            title="Compounds"
            description="Explore documented Takete-Ide compounds and their historical family associations."
            href="/families/compounds"
          />
          <IconCard
            icon={Users}
            title="Contribute"
            description="Help preserve your family's history and Oríkì."
            href="/families/contribute"
            tone="green"
          />
        </div>

        {/* Section A: Documented Historical Families from Canonical Manuscript */}
        <section className="mt-16">
          <SectionHeading
            eyebrow="Historical Record"
            title="Families Documented in the Historical Olu’de Register"
            align="left"
            className="mx-0"
          />
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-charcoal/80">
            The supplied community historical manuscript preserves several family names across the
            historical Olu’de register. These records are documented historical associations and should not
            be treated as a complete list of every family in Takete-Ide.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {DOCUMENTED_HISTORICAL_FAMILIES.map((fam) => (
              <div
                key={fam.id}
                className="flex flex-col justify-between rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-800">
                      <Users className="h-3.5 w-3.5" aria-hidden="true" />
                      Family Name
                    </span>
                    <span className="rounded-full bg-gold-100 px-2.5 py-0.5 text-[11px] font-medium text-gold-800">
                      Historical manuscript record
                    </span>
                  </div>

                  <h2 className="mt-4 font-serif text-2xl font-bold text-purple-950">{fam.name}</h2>

                  <div className="mt-5 space-y-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-charcoal/60">
                        {fam.documentedCompounds.length > 1
                          ? "Documented Compounds"
                          : "Documented Compound"}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {fam.documentedCompounds.map((comp) => (
                          <Link
                            key={comp}
                            href="/families/compounds"
                            className="inline-flex items-center gap-1 rounded-lg bg-gold-50 px-2.5 py-1 text-xs font-medium text-gold-900 hover:bg-gold-100"
                          >
                            <MapPin className="h-3 w-3 text-gold-700" aria-hidden="true" />
                            {comp}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-charcoal/60">
                        {fam.associatedRulers.length > 1
                          ? "Associated Historical Olu’des"
                          : "Associated Historical Olu’de"}
                      </p>
                      <ul className="mt-1 space-y-0.5 text-xs text-charcoal/80">
                        {fam.associatedRulers.map((ruler) => (
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

        {/* Section B: Verified Family Profile Directory */}
        <section className="mt-16 border-t border-purple-600/10 pt-16">
          <SectionHeading
            eyebrow="Community Directory"
            title="Family Profile Directory"
            align="left"
            className="mx-0"
            description="Detailed family profiles, lineages and oral praise poetry documented in collaboration with families."
          />
          <div className="mt-8">
            {families.length > 0 ? (
              <div className="space-y-10">
                {letters.map((letter) => (
                  <div key={letter}>
                    <h3 className="font-serif text-2xl font-bold text-gold-700">{letter}</h3>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {grouped[letter].map((family) => (
                        <Link
                          key={family.id}
                          href={`/families/${family.slug}`}
                          className="rounded-2xl border border-purple-600/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg"
                        >
                          <p className="font-serif text-lg font-bold text-purple-600">{family.name}</p>
                          {family.compound && <p className="text-sm text-charcoal/60">{family.compound.name}</p>}
                          {family.summary && <p className="mt-2 line-clamp-2 text-sm text-charcoal/70">{family.summary}</p>}
                          <VerificationBadge status={family.verification_status} className="mt-3" />
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-purple-100 bg-purple-50/40 p-6 text-center sm:p-8">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
                  <Users className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-3 font-serif text-lg font-bold text-purple-950">
                  Detailed Family Profiles Under Compilation
                </h3>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-charcoal/75">
                  Detailed family histories and Oríkì profiles are being compiled. The names above come
                  specifically from the historical Olu’de register and do not necessarily represent every
                  Takete-Ide family.
                </p>
                <div className="mt-5">
                  <ButtonLink href="/families/contribute" size="sm">
                    Help Preserve Your Family History
                  </ButtonLink>
                </div>
              </div>
            )}
          </div>
        </section>
      </Container>
    </div>
  );
}
