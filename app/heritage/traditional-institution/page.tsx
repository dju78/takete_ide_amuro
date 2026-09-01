import type { Metadata } from "next";
import Link from "next/link";
import { Users, Landmark, ScrollText, Crown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { HeritageImage } from "@/components/ui/HeritageImage";
import { VerificationBadge } from "@/components/ui/Badge";
import { getTraditionalRulers, getTraditionalCouncil } from "@/lib/data/people";
import { formatDate } from "@/lib/utils";
import {
  CONFIRMED_OLUDE_REGISTER,
  type HistoricalOludeEntry,
} from "@/content/history/web/historical-family-compounds";

export const metadata: Metadata = {
  title: "Traditional Institution | Takete-Ide Amuro",
  description:
    "Explore the supplied community historical account of the Olu’de, the Takete-Ide Traditional Council and the community’s place within the wider Amuro traditional structure.",
};

export type { HistoricalOludeEntry };
export { CONFIRMED_OLUDE_REGISTER };

export default async function TraditionalInstitutionPage() {
  const [rulers, council] = await Promise.all([getTraditionalRulers(), getTraditionalCouncil()]);
  const currentRuler = rulers.find((r) => r.is_current);
  const pastRulers = rulers.filter((r) => !r.is_current);

  return (
    <div className="bg-ivory">
      {/* Hero */}
      <div className="bg-purple-700 py-16 text-white sm:py-20">
        <Container>
          <Breadcrumb items={[{ label: "Culture & Heritage", href: "/heritage" }, { label: "Traditional Institution" }]} />
          <p className="mt-4 inline-block rounded-full bg-gold-500/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
            Governance &amp; Heritage
          </p>
          <h1 className="mt-3 font-serif text-4xl font-bold sm:text-5xl lg:text-6xl">Traditional Institution</h1>
          <p className="mt-3 max-w-2xl text-lg text-white/85">
            The Olu’de of Takete-Ide Amuro and the traditional council that safeguards our customs, unity, and heritage.
          </p>
        </Container>
      </div>

      <Container className="py-14 sm:py-16">
        {/* Section 1: Overview & Council */}
        <section>
          <SectionHeading
            eyebrow="Governance"
            title="The Olu’de and the Takete-Ide Traditional Council"
            align="left"
            className="mx-0"
          />
          <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="prose prose-purple text-charcoal/80">
              <p className="text-base leading-relaxed sm:text-lg">
                Traditional authority in Takete-Ide resides in the <strong>Takete-Ide Traditional Council</strong>,
                presided over by the <strong>Olu’de</strong> in conjunction with his Council of Chiefs.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-charcoal/70">
                The traditional stool serves as the principal custodian of community customs, historical memory,
                peacekeeping, dispute settlement, and cultural continuity across all families and compounds.
              </p>
            </div>
            <div className="overflow-hidden rounded-3xl border border-purple-600/10 bg-white p-2 shadow-sm">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
                <HeritageImage
                  src="/images/takete-ide/heritage/traditional-dignitaries.png"
                  alt="Traditional and community leaders seated together in ceremonial attire at a Takete-Ide gathering"
                  label="Traditional & Community Dignitaries"
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
              <p className="p-3 text-xs italic text-charcoal/60">
                Community dignitaries and traditional leadership at a Takete-Ide gathering.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Takete within Amuro Structure */}
        <section className="mt-16 rounded-3xl border border-purple-600/10 bg-white p-7 sm:p-10 shadow-sm">
          <SectionHeading
            eyebrow="Amuro Confederacy"
            title="Takete-Ide within the Amuro Traditional Structure"
            align="left"
            className="mx-0"
          />
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-700 text-white">
                <Landmark className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-serif text-lg font-bold text-purple-950">The Alamuro Stool</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/80">
                According to the supplied historical account, the paramount stool of the Amuro traditional
                area is the <strong>Alamuro of Amuro</strong>, who heads the wider Amuro Traditional Council.
              </p>
            </div>
            <div className="rounded-2xl border border-gold-500/20 bg-gold-50/50 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-600 text-white">
                <Users className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-serif text-lg font-bold text-purple-950">Rotation &amp; Consensus</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/80">
                The Alamuro stool rotates among the traditional heads of the component towns in Amuro land,
                preserving an enduring tradition of consensus, balance, and regional brotherhood.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Current Stool / Confirmed Olu'de */}
        <section className="mt-16">
          <SectionHeading eyebrow="The Stool" title="The Olu’de of Takete-Ide" align="left" className="mx-0" />
          <div className="mt-6">
            {currentRuler ? (
              <div className="flex flex-col gap-6 rounded-3xl border border-gold-500/20 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:p-8">
                {currentRuler.photo_url && (
                  <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-gold-500/30 shadow-sm mx-auto sm:mx-0">
                    <HeritageImage
                      src={currentRuler.photo_url}
                      alt={currentRuler.full_name}
                      label={currentRuler.full_name}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-0.5 text-xs font-semibold text-gold-900">
                      <Crown className="h-3.5 w-3.5" aria-hidden="true" />
                      Current Olu’de
                    </span>
                    <VerificationBadge status={currentRuler.verification_status} />
                  </div>
                  <h3 className="mt-2 font-serif text-2xl font-bold text-purple-950">{currentRuler.full_name}</h3>
                  <p className="text-sm font-medium text-gold-800">{currentRuler.regnal_title || "The Olu’de of Takete-Ide"}</p>
                  {currentRuler.reign_start && (
                    <p className="mt-1 text-xs text-charcoal/70">Reigning since {formatDate(currentRuler.reign_start)}</p>
                  )}
                  {currentRuler.biography && (
                    <p className="mt-3 text-sm leading-relaxed text-charcoal/80">{currentRuler.biography}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6 rounded-3xl border border-gold-500/30 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:p-8">
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-gold-500/40 shadow-sm mx-auto sm:mx-0">
                  <HeritageImage
                    src="/images/takete-ide/heritage/oba-philip-ebilakun.png"
                    alt="Portrait of Oba Philip Ebilakun in royal attire"
                    label="Oba Philip Ebilakun"
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-0.5 text-xs font-semibold text-gold-900">
                      <Crown className="h-3.5 w-3.5" aria-hidden="true" />
                      Current Olu’de
                    </span>
                    <VerificationBadge status="verified" />
                  </div>
                  <h3 className="mt-2 font-serif text-2xl font-bold text-purple-950">
                    Oba Philip Ebilakun
                  </h3>
                  <p className="text-sm font-medium text-gold-800">
                    The Olu’de of Takete-Ide (13th Olu’de)
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal/85">
                    His Royal Highness Oba Philip Ebilakun reigns as the thirteenth Olu’de of Takete-Ide,
                    presiding over the Takete-Ide Traditional Council in accordance with community custom,
                    heritage preservation, and traditional governance.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Section 4: Historical Olu’de Register */}
        <section className="mt-16 rounded-3xl border border-purple-600/10 bg-white p-7 sm:p-10 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-0.5 text-xs font-semibold text-purple-800">
                <ScrollText className="h-3.5 w-3.5" aria-hidden="true" />
                Confirmed Source Mapping
              </span>
              <h2 className="mt-2 font-serif text-2xl font-bold text-purple-900 sm:text-3xl">
                Historical Olu’de Register
              </h2>
            </div>
            <span className="text-xs text-charcoal/60">12 Rulers Recorded in Manuscript</span>
          </div>

          <p className="mt-4 text-xs italic leading-relaxed text-charcoal/70 sm:text-sm">
            The supplied community historical manuscript preserves a register of earlier Olu’des together with
            their family and ward/compound affiliations. The row relationships reproduced here have been
            confirmed by the project owner from the supplied source. Reign dates remain under ongoing documentation.
          </p>

          {/* Desktop Table */}
          <div className="mt-8 hidden overflow-hidden rounded-2xl border border-purple-100 md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-purple-100 bg-purple-50/70 text-xs font-semibold uppercase text-purple-950">
                <tr>
                  <th scope="col" className="py-3.5 pl-6 pr-3">#</th>
                  <th scope="col" className="py-3.5 px-3">Olu’de</th>
                  <th scope="col" className="py-3.5 px-3">Family</th>
                  <th scope="col" className="py-3.5 px-3">Ward / Compound</th>
                  <th scope="col" className="py-3.5 pl-3 pr-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50 text-charcoal/85">
                {CONFIRMED_OLUDE_REGISTER.map((entry) => (
                  <tr key={entry.number} className="hover:bg-purple-50/40 transition-colors">
                    <td className="py-3 pl-6 pr-3 font-mono text-xs font-bold text-gold-700">
                      {String(entry.number).padStart(2, "0")}
                    </td>
                    <td className="py-3 px-3 font-serif font-bold text-purple-950">{entry.name}</td>
                    <td className="py-3 px-3 font-medium text-charcoal/80">{entry.family}</td>
                    <td className="py-3 px-3">
                      <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                        {entry.ward}
                      </span>
                    </td>
                    <td className="py-3 pl-3 pr-6 text-xs text-charcoal/60">
                      Reign dates under documentation
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="mt-6 grid gap-3.5 md:hidden">
            {CONFIRMED_OLUDE_REGISTER.map((entry) => (
              <div
                key={entry.number}
                className="flex flex-col gap-2 rounded-xl border border-purple-100 bg-purple-50/40 p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-gold-500/20 font-mono text-xs font-bold text-purple-950">
                    {String(entry.number).padStart(2, "0")}
                  </span>
                  <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[11px] font-medium text-purple-800">
                    {entry.ward}
                  </span>
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-purple-950">{entry.name}</h3>
                  <p className="text-xs text-charcoal/70">
                    Family: <span className="font-medium text-purple-900">{entry.family}</span>
                  </p>
                </div>
                <p className="border-t border-purple-100/60 pt-2 text-[11px] italic text-charcoal/60">
                  Reign dates under documentation
                </p>
              </div>
            ))}
          </div>

          {/* Compound & Family Explorer Cross-Link */}
          <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-purple-100 bg-purple-50/50 p-5 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-serif text-sm font-bold text-purple-950">
                Explore Compounds &amp; Families
              </h3>
              <p className="mt-0.5 text-xs text-charcoal/75">
                Explore these family and compound associations in a compound-centred view.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/families/compounds"
                className="inline-flex items-center gap-1.5 rounded-lg border border-purple-200 bg-white px-3 py-1.5 text-xs font-semibold text-purple-900 shadow-sm hover:bg-purple-100/50"
              >
                View Compounds →
              </Link>
              <Link
                href="/families"
                className="inline-flex items-center gap-1.5 rounded-lg border border-purple-200 bg-white px-3 py-1.5 text-xs font-semibold text-purple-900 shadow-sm hover:bg-purple-100/50"
              >
                View Families →
              </Link>
            </div>
          </div>

          {pastRulers.length > 0 && (
            <div className="mt-10 border-t border-purple-100 pt-6">
              <h3 className="font-serif text-lg font-bold text-purple-900">Verified Database Records</h3>
              <ol className="mt-4 space-y-4 border-l-2 border-gold-500/40 pl-6">
                {pastRulers.map((ruler) => (
                  <li key={ruler.id}>
                    <p className="font-semibold text-purple-600">{ruler.full_name}</p>
                    <p className="text-sm text-charcoal/60">
                      {ruler.reign_start ? formatDate(ruler.reign_start) : "?"} –{" "}
                      {ruler.reign_end ? formatDate(ruler.reign_end) : "?"}
                    </p>
                    <VerificationBadge status={ruler.verification_status} className="mt-1" />
                  </li>
                ))}
              </ol>
            </div>
          )}
        </section>

        {/* Section 5: Traditional Council Database Section */}
        <section className="mt-16">
          <SectionHeading eyebrow="Council" title="The Traditional Council" align="left" className="mx-0" />
          <div className="mt-6">
            {council.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {council.map((member) => (
                  <div key={member.id} className="rounded-2xl border border-purple-600/10 bg-white p-5">
                    <p className="font-semibold text-purple-600">{member.full_name}</p>
                    <p className="text-sm text-charcoal/60">{member.title}</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Users}
                title="Council membership is being documented and will be published after confirmation."
                message="The chiefs and members of the traditional council will be listed here once verified with the traditional institution."
              />
            )}
          </div>
        </section>
      </Container>
    </div>
  );
}
