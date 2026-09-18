import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { School, GraduationCap, UsersRound } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { SourcedSection } from "@/components/heritage/SourcedSection";
import {
  BOOK_EDUCATION_MILESTONES,
  BOOK_HEALTH_MILESTONES,
  BOOK_SOURCE_NOTE,
  BOOK_SOURCE_TITLE,
} from "@/content/history/web/from-hilltops-to-valley";
import {
  BOOK_1943_PIONEER_PUPILS,
  BOOK_1953_PIONEER_PUPILS,
  BOOK_1963_FIRST_GRADUATES,
} from "@/content/history/web/from-hilltops-to-valley-expanded";

export const metadata: Metadata = {
  title: "Education in Takete-Ide",
  description:
    "Schooling in Takete-Ide — from early primary classes to the founding of the community secondary school, told from the community's own historical accounts.",
};

const educationalFacilities = [
  {
    title: "Community High School Building",
    src: "/images/takete-ide/education/community-high-school-block.png",
    alt: "Primary academic classroom block of Community High School Takete-Ide",
    badge: "Secondary Education",
    description:
      "The foundational secondary classroom block built through community mobilization and collective development efforts.",
  },
  {
    title: "Universal Basic Education (UBE) Block",
    src: "/images/takete-ide/education/ube-block-building.png",
    alt: "Universal Basic Education junior secondary block in Takete-Ide",
    badge: "Basic Education",
    description:
      "Modern junior secondary learning facility supporting basic education delivery and foundational learning for community pupils.",
  },
  {
    title: "Digital Economy Centre",
    src: "/images/takete-ide/education/digital-economy-centre.png",
    alt: "Takete-Ide Digital Economy Centre building",
    badge: "Digital Infrastructure",
    description:
      "Modern digital and ICT learning facility bringing computer literacy and online educational access to Takete-Ide students.",
  },
];

const milestones = [
  {
    period: "Before the 1960s",
    text: "Pupils from Takete-Ide travelled outside the community to complete higher primary education.",
  },
  {
    period: "Around 1961",
    text: "Senior Primary classes began to be held locally, reducing the need to travel for those years of schooling.",
  },
  {
    period: "26 December 1975",
    text: "At the Takete-Ide Progressive Union's Annual General Meeting, the community resolved to establish a Community Secondary School and began contributing towards it.",
  },
  {
    period: "Target of January 1977",
    text: "The community set January 1977 as the intended commencement date for the school, and teaching began.",
  },
  {
    period: "After local government reform",
    text: "Following the creation of Oyi Local Government Area, a community delegation asked the new authority to take the school over. The request was accepted and the school passed into local government administration after its first two terms.",
  },
];

function NamesCard({ title, period, names }: { title: string; period: string; names: readonly string[] }) {
  return (
    <article className="rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <UsersRound className="h-5 w-5 text-purple-600" aria-hidden="true" />
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-gold-700">{period}</p>
          <h3 className="font-serif text-lg font-bold text-purple-950">{title}</h3>
        </div>
      </div>
      <ul className="mt-4 grid gap-2 text-sm text-charcoal/80 sm:grid-cols-2">
        {names.map((name) => (
          <li key={name} className="rounded-xl bg-purple-50/50 px-3 py-2">{name}</li>
        ))}
      </ul>
    </article>
  );
}

export default function EducationPage() {
  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "Education" }]} />
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Education in Takete-Ide</h1>
          <p className="mt-3 max-w-2xl text-white/85">
            How the community built its own schooling — and the school it handed on.
          </p>
        </Container>
      </div>

      <Container className="max-w-4xl py-14 sm:py-16">
        <div className="prose-heritage">
          <h2 className="mt-0">A community that schooled itself</h2>
          <p>
            Education has been one of Takete-Ide&rsquo;s consistent priorities. Before local schooling
            reached its later years, children travelled out of the community to finish higher primary
            education — a considerable undertaking for families, and one the community set out to end.
          </p>
          <p>
            The clearest expression of that effort was the decision, taken at a Takete-Ide Progressive
            Union annual general meeting, to build a secondary school by community contribution rather
            than wait for one to be provided.
          </p>
        </div>

        <section className="mt-14">
          <SectionHeading
            eyebrow="Community History"
            title="School Foundation Milestones"
            align="left"
            className="mx-0"
            description="Chronological milestones tracing the establishment and growth of secondary education in Takete-Ide."
          />
          <ol className="mt-8 space-y-5 border-l-2 border-purple-600/15 pl-6">
            {milestones.map((m) => (
              <li key={m.period} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-[1.9rem] top-1.5 h-3 w-3 rounded-full bg-gold-500 ring-4 ring-ivory"
                />
                <p className="font-serif text-lg font-bold text-purple-600">{m.period}</p>
                <p className="mt-1 leading-relaxed text-charcoal/80">{m.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-14">
          <SourcedSection
            title="Government Day Secondary School, Takete-Ide"
          >
            <p>
              The community&rsquo;s secondary school began as a self-funded Community Secondary School,
              resolved upon at the union&rsquo;s annual general meeting of 26 December 1975 with a target
              commencement of January 1977. Contributions were raised and teaching started.
            </p>
            <p>
              Local government reform then created a new authority which announced its intention to
              establish secondary schools. A Takete-Ide delegation put the community&rsquo;s case to the
              authority and asked that the school it had already started be taken over. The request was
              granted, and the school passed into local government administration after two terms of
              community operation.
            </p>
          </SourcedSection>
        </div>

        <section className="mt-16">
          <SectionHeading
            eyebrow="Historical Milestones"
            title="Educational Milestones & Development"
            align="left"
            className="mx-0"
            description="Chronology of primary and secondary educational institutions established in Takete-Ide."
          />
          <div className="mt-8 space-y-4">
            {BOOK_EDUCATION_MILESTONES.map((item) => (
              <article key={`${item.period}-${item.title}`} className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-gold-700">{item.period}</span>
                  <h3 className="font-serif text-lg font-bold text-purple-950">{item.title}</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/80">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionHeading
            eyebrow="Historical Pioneer Rolls"
            title="Pioneer Pupils & First Graduates"
            align="left"
            className="mx-0"
            description="Preserved historical class rolls of early Takete-Ide students and pioneering graduates."
          />
          <div className="mt-8 space-y-6">
            <NamesCard
              title="1943 Pioneer Pupils — S.I.M School"
              period="1943"
              names={BOOK_1943_PIONEER_PUPILS}
            />
            <NamesCard
              title="1953 Pioneer Pupils — Native Authority School"
              period="1953"
              names={BOOK_1953_PIONEER_PUPILS}
            />
            <NamesCard
              title="1963 First Graduates — Full Primary School"
              period="1963"
              names={BOOK_1963_FIRST_GRADUATES}
            />
          </div>
        </section>

        {/* Educational Facilities Visual Section */}
        <section className="mt-16">
          <SectionHeading
            eyebrow="Infrastructure & Environment"
            title="Educational Institutions & Facilities"
            align="left"
            className="mx-0"
            description="Photographic record of foundational schools and digital education centres serving the Takete-Ide community."
          />

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {educationalFacilities.map((facility) => (
              <article
                key={facility.title}
                className="overflow-hidden rounded-3xl border border-purple-600/10 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="relative aspect-4/3 w-full overflow-hidden bg-purple-50">
                  <Image
                    src={facility.src}
                    alt={facility.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-community-green">{facility.badge}</p>
                  <h3 className="mt-1 font-serif text-lg font-bold text-purple-950">{facility.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-charcoal/75">{facility.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <School className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="mt-4 font-serif text-lg font-bold text-purple-600">Educational Institutions</h2>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
              Takete-Ide is served by foundational learning institutions including the historic primary school,
              Christ Nursery and Primary School, and Government Day Secondary School, providing basic and secondary
              education for youth across the community.
            </p>
            <Link href="/contact" className="mt-3 inline-flex min-h-6 items-center text-sm font-semibold text-community-green hover:underline">
              Contact education coordinators →
            </Link>
          </div>
          <div className="rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-100 text-gold-700">
              <GraduationCap className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="mt-4 font-serif text-lg font-bold text-purple-600">Supporting education</h2>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
              Education remains one of the areas the union directs community support towards, alongside
              infrastructure, security and heritage.
            </p>
            <Link href="/support" className="mt-3 inline-flex min-h-6 items-center text-sm font-semibold text-community-green hover:underline">
              Support Takete-Ide →
            </Link>
          </div>

          <div className="rounded-3xl border border-gold-500/30 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-950 p-6 text-white shadow-sm sm:col-span-2">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="inline-block rounded-full bg-gold-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-300 ring-1 ring-inset ring-gold-400/30">
                  Interactive Learning
                </span>
                <h3 className="mt-2 font-serif text-xl font-bold text-white">
                  Kogi Quest: Test Your Knowledge of the Confluence State
                </h3>
                <p className="mt-1 text-sm text-white/85">
                  An exciting cultural quiz exploring the history, geography, culture and heritage of Kogi State.
                </p>
              </div>
              <ButtonLink href="/kogi-quest" size="sm" className="shrink-0 justify-center">
                Play Kogi Quest →
              </ButtonLink>
            </div>
          </div>
        </section>

        <div className="mt-14 rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="font-serif text-xl font-bold text-purple-600">Voices of Takete-Ide</h2>
          <p className="mt-3 text-charcoal/80">
            Explore recorded oral histories, elder recollections, and personal reflections documenting
            education, community life, and cultural progress across generations in Takete-Ide.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/archive/oral-history" variant="secondary">
              Explore Oral History Archive →
            </ButtonLink>
          </div>
        </div>
      </Container>
    </div>
  );
}
