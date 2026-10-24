import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ArrowRight } from "lucide-react";
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

const peopleLinks = [
  {
    href: "/heritage/pacesetters",
    title: "Pacesetters & Pioneers",
    description:
      "The first graduates, nurses, teachers, professionals and public servants recorded in Takete-Ide’s history.",
    cta: "View the pacesetters",
  },
  {
    href: "/heritage/traditional-institution",
    title: "Traditional Leadership",
    description: "The Olu’de of Takete-Ide, the 13 rulers in living memory and the Traditional Council.",
    cta: "View traditional leadership",
  },
];

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function OurPeoplePage({ searchParams }: Props) {
  const { category } = await searchParams;
  const allPeople = await getPeople();
  const people = category ? allPeople.filter((p) => p.category === category) : allPeople;
  // Only offer filters for categories that have published profiles.
  const activeCategories = categories.filter((c) => allPeople.some((p) => p.category === c.key));

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
        {allPeople.length > 0 ? (
          <>
            {activeCategories.length > 1 && (
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter profiles by category">
                <Link
                  href="/our-people"
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    !category ? "bg-purple-600 text-white" : "bg-white text-charcoal/70 hover:bg-purple-50"
                  }`}
                >
                  All
                </Link>
                {activeCategories.map((c) => (
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
            )}
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {(people.length > 0 ? people : allPeople).map((p) => (
                <PersonCard key={p.id} person={p} />
              ))}
            </div>
          </>
        ) : (
          <div className="max-w-4xl">
            <p className="text-lg leading-relaxed text-charcoal/80">
              Takete-Ide&rsquo;s history is carried by its people. Until individual profiles are published, you can
              meet them through the community&rsquo;s recorded firsts and its traditional leadership.
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {peopleLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm transition hover:border-purple-600/30 hover:shadow-md"
                >
                  <h2 className="font-serif text-xl font-bold text-purple-950">{item.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/75">{item.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-community-green">
                    {item.cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-10 rounded-2xl bg-purple-50/70 p-6">
              <h2 className="font-serif text-lg font-bold text-purple-950">Know someone who should be remembered here?</h2>
              <p className="mt-1 text-sm text-charcoal/75">
                Families and community members can nominate a person for a future profile.
              </p>
              <ButtonLink href="/get-involved#nominate" variant="outline" size="sm" className="mt-4">
                Nominate a Community Member
              </ButtonLink>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
