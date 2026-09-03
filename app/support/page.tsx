import type { Metadata } from "next";
import Link from "next/link";
import { HeartHandshake } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";
import { SupportAccountCard } from "@/components/community/SupportAccountCard";
import { getSupportAccount } from "@/lib/data/community-programme";
import { SUPPORT_PURPOSES } from "@/lib/media/community-programme";

export const metadata: Metadata = {
  title: "Support Takete-Ide",
  description:
    "Support approved community, heritage and development initiatives through the Takete-Ide Progressive Union.",
};

export const revalidate = 3600;

export default async function SupportPage() {
  const account = await getSupportAccount();

  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "Support Takete-Ide" }]} />
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Support Takete-Ide</h1>
          <p className="mt-3 max-w-2xl text-white/85">
            Support approved community, heritage and development initiatives through the Takete-Ide
            Progressive Union.
          </p>
        </Container>
      </div>

      <Container className="py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <h2 className="mb-4 font-serif text-2xl font-bold text-purple-600">Direct Bank Transfer</h2>
            {account ? (
              <SupportAccountCard account={account} />
            ) : (
              <EmptyState
                icon={HeartHandshake}
                title="Contribution details are being updated"
                message="The union's official contribution account is not published at the moment. Please contact the union directly to arrange a contribution."
              />
            )}
          </div>

          <div className="prose-heritage">
            <h2 className="mt-0">How contributions are used</h2>
            <p>
              Contributions made through the Takete-Ide Progressive Union go towards approved community
              projects — infrastructure, security, education, heritage and the community&rsquo;s annual
              celebrations. The union reports on major funds to its branches and at the annual general
              meeting.
            </p>
            <p className="text-sm text-charcoal/65">
              This page publishes one account only: the union&rsquo;s general contribution account. If you
              are asked to send money to any other account on behalf of Takete-Ide, confirm it directly
              with the union before transferring anything.
            </p>
            <p className="text-sm text-charcoal/65">
              For contributions towards a specific project, please note the purpose in your transfer
              reference and let the union know.
            </p>
          </div>
        </div>

        <section className="mt-16">
          <SectionHeading
            eyebrow="Approved areas"
            title="What your support goes towards"
            align="left"
            className="mx-0"
            description="Areas the union directs community support towards. These are ongoing areas of work rather than active campaigns with targets."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SUPPORT_PURPOSES.map((purpose) => (
              <Link
                key={purpose.title}
                href={purpose.href}
                className="group rounded-2xl border border-purple-600/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg"
              >
                <h3 className="font-serif text-lg font-bold text-purple-600 group-hover:text-purple-400">
                  {purpose.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{purpose.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-16 rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="font-serif text-xl font-bold text-purple-600">Other ways to help</h2>
          <p className="mt-3 max-w-2xl text-charcoal/80">
            Support is not only financial. Skills, professional time, photographs for the community
            archive and help verifying our historical record are all needed.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/get-involved">Volunteer your skills</ButtonLink>
            <ButtonLink href="/contact" variant="outline">
              Contact the union
            </ButtonLink>
          </div>
        </div>
      </Container>
    </div>
  );
}
