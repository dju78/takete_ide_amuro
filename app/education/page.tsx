import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, School } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { SourcedSection } from "@/components/heritage/SourcedSection";
import { ResearchDisclaimer } from "@/components/heritage/ResearchDisclaimer";

export const metadata: Metadata = {
  title: "Education in Takete-Ide",
  description:
    "Schooling in Takete-Ide — from early primary classes to the founding of the community secondary school, told from the community's own historical account.",
};

/**
 * The secondary-school account below comes from a first-person recollection
 * shared in the community archive by someone who took part in the delegation.
 * It is detailed and internally consistent, but it is testimony rather than
 * documentary evidence — so it is presented as an oral-history account, with the
 * dates it gives, and not as settled record.
 */
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
        <ResearchDisclaimer />

        <div className="prose-heritage mt-12">
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
            eyebrow="Community historical account"
            title="Milestones"
            align="left"
            className="mx-0"
            description="Dates as given in a first-hand recollection held in the community archive. They have not been cross-checked against school or local government records."
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
            status="oral_history"
            sourceNote="First-person recollection shared in the community archive by a participant in the delegation. Awaiting confirmation against school and local government records."
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
            <p className="text-sm italic text-charcoal/60">
              The school&rsquo;s current name, enrolment, staffing and facilities are not documented in
              this archive. Those details will be published once supplied by the school or the community.
            </p>
          </SourcedSection>
        </div>

        <section className="mt-14 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <School className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="mt-4 font-serif text-lg font-bold text-purple-600">
              Schools today
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
              A current directory of schools serving Takete-Ide has not yet been compiled for this site.
              If you can supply verified details, the archive team would like to hear from you.
            </p>
            <Link href="/contact" className="mt-3 inline-flex min-h-6 items-center text-sm font-semibold text-community-green hover:underline">
              Contribute what you know →
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
        </section>

        <div className="mt-14 rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="font-serif text-xl font-bold text-purple-600">Were you there?</h2>
          <p className="mt-3 text-charcoal/80">
            If you attended the community secondary school in its early years, or remember the years
            before local Senior Primary classes, your account would strengthen this record considerably.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/families/contribute" variant="secondary">
              Share your account
            </ButtonLink>
            <ButtonLink href="/archive/oral-history" variant="outline">
              Voices of Takete-Ide
            </ButtonLink>
          </div>
        </div>
      </Container>
    </div>
  );
}
