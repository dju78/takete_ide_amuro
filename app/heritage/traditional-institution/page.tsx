import type { Metadata } from "next";
import Image from "next/image";
import { Crown, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { VerificationBadge } from "@/components/ui/Badge";
import { getTraditionalRulers, getTraditionalCouncil } from "@/lib/data/people";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Traditional Institution",
  description: "The Olude of Takete-Ide Amuro, the traditional council, and the community's traditional leadership structure.",
};

export default async function TraditionalInstitutionPage() {
  const [rulers, council] = await Promise.all([getTraditionalRulers(), getTraditionalCouncil()]);
  const currentRuler = rulers.find((r) => r.is_current);
  const pastRulers = rulers.filter((r) => !r.is_current);

  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "Heritage", href: "/heritage" }, { label: "Traditional Institution" }]} />
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Traditional Institution</h1>
          <p className="mt-3 max-w-2xl text-white/80">
            The Olude of Takete-Ide Amuro and the traditional council that safeguards our customs and heritage.
          </p>
        </Container>
      </div>

      <Container className="py-16">
        <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image src="/images/source/photo-chieftaincy-1.jpg" alt="A traditional ceremony of the Takete-Ide traditional institution" fill className="object-cover" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-purple-600">The Olude of Takete-Ide Amuro</h2>
            <p className="mt-3 text-charcoal/80">
              Takete-Ide is traditionally governed by its own monarch, the Olude of Takete-Ide Amuro, who
              serves as custodian of the community&rsquo;s customs, values and heritage. Within the wider
              Amuro confederation, the Olude&rsquo;s stool pays allegiance to the Alamuro of Amuro Land.
            </p>
            <p className="mt-3 text-sm text-charcoal/60">
              The current holder of the title, palace history, and full list of past rulers will be
              published here once confirmed by the traditional council.
            </p>
          </div>
        </section>

        <section className="mt-16">
          <SectionHeading eyebrow="The Stool" title="Current Ruler" align="left" className="mx-0" />
          <div className="mt-6">
            {currentRuler ? (
              <div className="flex flex-col gap-4 rounded-2xl border border-purple-600/10 bg-white p-6 sm:flex-row sm:items-center">
                {currentRuler.photo_url && (
                  <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full">
                    <Image src={currentRuler.photo_url} alt={currentRuler.full_name} fill className="object-cover" />
                  </div>
                )}
                <div>
                  <h3 className="font-serif text-xl font-bold text-purple-600">{currentRuler.full_name}</h3>
                  <p className="text-sm text-charcoal/60">{currentRuler.regnal_title}</p>
                  {currentRuler.reign_start && (
                    <p className="mt-1 text-sm text-charcoal/60">Reigning since {formatDate(currentRuler.reign_start)}</p>
                  )}
                  <VerificationBadge status={currentRuler.verification_status} className="mt-2" />
                </div>
              </div>
            ) : (
              <EmptyState
                icon={Crown}
                title="Awaiting confirmation from the traditional council"
                message="The current Olude's details will be published here once confirmed and authorised for release by the traditional institution."
              />
            )}
          </div>
        </section>

        <section className="mt-16">
          <SectionHeading eyebrow="History" title="Previous Rulers" align="left" className="mx-0" />
          <div className="mt-6">
            {pastRulers.length > 0 ? (
              <ol className="space-y-4 border-l-2 border-gold-500/40 pl-6">
                {pastRulers.map((ruler) => (
                  <li key={ruler.id}>
                    <p className="font-semibold text-purple-600">{ruler.full_name}</p>
                    <p className="text-sm text-charcoal/60">
                      {ruler.reign_start ? formatDate(ruler.reign_start) : "?"} – {ruler.reign_end ? formatDate(ruler.reign_end) : "?"}
                    </p>
                    <VerificationBadge status={ruler.verification_status} className="mt-1" />
                  </li>
                ))}
              </ol>
            ) : (
              <EmptyState
                title="Palace history is being compiled"
                message="A record of previous rulers will be added here as names, reign dates and biographies are confirmed with the traditional council and family sources. No names or dates are published until verified — see docs/HISTORICAL_VERIFICATION.md."
              />
            )}
          </div>
        </section>

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
                title="Council membership not yet published"
                message="The chiefs and members of the traditional council will be listed here once confirmed."
              />
            )}
          </div>
        </section>
      </Container>
    </div>
  );
}
