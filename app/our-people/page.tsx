import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EmptyState } from "@/components/ui/EmptyState";
import { PersonCard } from "@/components/cards/PersonCard";
import { ButtonLink } from "@/components/ui/Button";
import { getPeople } from "@/lib/data/people";

export const metadata: Metadata = {
  title: "Our People",
  description: "Traditional leaders, community leaders, public servants, academics and achievers from Takete-Ide Amuro.",
};

const categories = [
  { key: "traditional_leaders", label: "Traditional Leaders" },
  { key: "community_leaders", label: "Community Leaders" },
  { key: "public_service", label: "Public Service" },
  { key: "academia", label: "Academia" },
  { key: "education", label: "Education" },
  { key: "healthcare", label: "Healthcare" },
  { key: "business", label: "Business" },
  { key: "entrepreneurship", label: "Entrepreneurship" },
  { key: "arts_culture", label: "Arts & Culture" },
  { key: "sports", label: "Sports" },
  { key: "diaspora", label: "Diaspora" },
  { key: "young_achievers", label: "Young Achievers" },
];

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function OurPeoplePage({ searchParams }: Props) {
  const { category } = await searchParams;
  const people = await getPeople(category);

  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "Our People" }]} />
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Our People</h1>
          <p className="mt-3 max-w-2xl text-white/80">
            The leaders, achievers and everyday builders of Takete-Ide Amuro, at home and abroad.
          </p>
        </Container>
      </div>

      <Container className="py-16">
        <div className="flex flex-wrap gap-2">
          <Link href="/our-people" className="rounded-full bg-purple-600 px-4 py-2 text-sm font-medium text-white">All</Link>
          {categories.map((c) => (
            <Link key={c.key} href={`/our-people?category=${c.key}`} className="rounded-full bg-white px-4 py-2 text-sm font-medium text-charcoal/70 hover:bg-purple-50">
              {c.label}
            </Link>
          ))}
        </div>

        <div className="mt-10">
          {people.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {people.map((p) => (
                <PersonCard key={p.id} person={p} />
              ))}
            </div>
          ) : (
            <EmptyState title="Profiles are being compiled" message="Community profiles will appear here as they are submitted, reviewed and approved for publication.">
              <ButtonLink href="/get-involved#nominate" variant="outline" size="sm" className="mt-4">
                Nominate Someone
              </ButtonLink>
            </EmptyState>
          )}
        </div>
      </Container>
    </div>
  );
}
