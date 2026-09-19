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

export const revalidate = 3600;

const categories = [
  { key: "traditional_leadership", label: "Traditional Leadership" },
  { key: "community_leadership", label: "Community Leadership" },
  { key: "education", label: "Education" },
  { key: "academia", label: "Academia" },
  { key: "medicine", label: "Medicine & Healthcare" },
  { key: "public_service", label: "Public Service" },
  { key: "business", label: "Business & Enterprise" },
  { key: "arts_culture", label: "Arts & Culture" },
  { key: "sports", label: "Sports" },
  { key: "military", label: "Military & Security" },
  { key: "community_service", label: "Community Service" },
  { key: "diaspora", label: "Diaspora" },
  { key: "pacesetters", label: "Pacesetters" },
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
            The leaders, achievers, pioneers and everyday builders of Takete-Ide Amuro, at home and across the world.
          </p>
        </Container>
      </div>

      <Container className="py-16">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter profiles by category">
          <Link
            href="/our-people"
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              !category ? "bg-purple-600 text-white" : "bg-white text-charcoal/70 hover:bg-purple-50"
            }`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.key}
              href={`/our-people?category=${c.key}`}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                category === c.key ? "bg-purple-600 text-white" : "bg-white text-charcoal/70 hover:bg-purple-50"
              }`}
            >
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
            <EmptyState
              tone="purple"
              title="Biographical records are being verified"
              message="Community profiles and verified pioneer records are currently undergoing editorial review and family verification before public archiving."
              action={{
                label: "Nominate or Submit a Profile",
                href: "/get-involved#nominate",
              }}
              secondaryAction={{
                label: "View All Categories",
                href: "/our-people",
              }}
            >
              <ButtonLink href="/get-involved#nominate" variant="outline" size="sm" className="mt-4">
                Nominate a Community Member
              </ButtonLink>
            </EmptyState>
          )}
        </div>
      </Container>
    </div>
  );
}
