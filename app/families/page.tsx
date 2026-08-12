import type { Metadata } from "next";
import Link from "next/link";
import { Users, MapPin, Music4 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { VerificationBadge } from "@/components/ui/Badge";
import { IconCard } from "@/components/cards/IconCard";
import { ButtonLink } from "@/components/ui/Button";
import { getFamilies } from "@/lib/data/families";

export const metadata: Metadata = {
  title: "Families & Oríkì",
  description: "Family names, compounds and lineage heritage of Takete-Ide Amuro.",
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
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Our Families & Oríkì</h1>
          <p className="mt-3 max-w-2xl text-white/80">
            The story of Takete-Ide is also the story of its families. Across generations, family names,
            compounds, oral traditions and Oríkì have preserved identity, ancestry, values and collective
            memory. This digital archive is dedicated to documenting and preserving that heritage for
            future generations.
          </p>
        </Container>
      </div>

      <Container className="py-16">
        <div className="grid gap-4 sm:grid-cols-3">
          <IconCard icon={Music4} title="Oríkì Archive" description="Listen to and read the praise poetry of Takete-Ide families." href="/oriki" tone="gold" />
          <IconCard icon={MapPin} title="Compounds" description="Explore the traditional compounds of Takete-Ide." href="/families/compounds" />
          <IconCard icon={Users} title="Contribute" description="Help preserve your family's history and Oríkì." href="/families/contribute" tone="green" />
        </div>

        <SectionHeading eyebrow="Directory" title="Family Name Index" align="left" className="mx-0 mt-16" />
        <div className="mt-8">
          {families.length > 0 ? (
            <div className="space-y-10">
              {letters.map((letter) => (
                <div key={letter}>
                  <h2 className="font-serif text-2xl font-bold text-gold-700">{letter}</h2>
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
            <EmptyState
              icon={Users}
              title="The family directory is just beginning"
              message="No family profiles have been published yet — this archive grows as families, elders and community historians contribute verified information. Family names, compounds and Oríkì are never invented for this site."
            >
              <ButtonLink href="/families/contribute" size="sm" className="mt-4">
                Help Preserve Your Family History
              </ButtonLink>
            </EmptyState>
          )}
        </div>
      </Container>
    </div>
  );
}
