import type { Metadata } from "next";
import Link from "next/link";
import { HeartHandshake } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";
import { SupportAccountCard } from "@/components/community/SupportAccountCard";
import { FundProgress } from "@/components/community/FundProgress";
import { getSupportAccount, getSecurityTrustFund } from "@/lib/data/community-programme";
import { ContributionForm } from "@/components/community/ContributionForm";
import { env, isPaystackConfigured, paystackMode } from "@/lib/env";
import { SUPPORT_PURPOSES } from "@/lib/media/community-programme";

export const metadata: Metadata = {
  title: "Support Takete-Ide",
  description:
    "Support approved community, heritage and development initiatives through the Takete-Ide Progressive Union.",
};

export default async function SupportPage() {
  const [account, fund] = await Promise.all([getSupportAccount(), getSecurityTrustFund()]);

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
        {/* Pay Online — hidden entirely when Paystack is unconfigured, rather than
            shown as a form that cannot work. Direct Bank Transfer below is
            unaffected either way, so the page always offers a way to give. */}
        {isPaystackConfigured ? (
          <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="font-serif text-2xl font-bold text-purple-600">Make a Contribution</h2>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
                Contribute online in a few steps. Payment is completed securely on Paystack.
              </p>
              {paystackMode === "test" && (
                <p
                  role="status"
                  className="mt-4 rounded-xl bg-gold-100 px-4 py-3 text-sm font-medium text-gold-700"
                >
                  Test mode — no live payment will be taken.
                </p>
              )}
              <div className="mt-6">
                <ContributionForm
                  minAmount={env.contributionMinMajor}
                  maxAmount={env.contributionMaxMajor}
                />
              </div>
            </div>

            <div className="prose-heritage">
              <h2 className="mt-0">Where your contribution goes</h2>
              <p>
                Contributions support the areas the union has approved — community development, the
                Centenary, education, security, roads and heritage. Choosing a purpose tells the union
                where you would like your contribution directed.
              </p>
              <p className="text-sm text-charcoal/65">
                These are areas of work rather than separately ring-fenced legal funds. The union reports
                on major funds to its branches and at the annual general meeting.
              </p>
              <p className="text-sm text-charcoal/65">
                Prefer to pay from your banking app? The union&rsquo;s account details are below.
              </p>
            </div>
          </section>
        ) : (
          <section className="rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="font-serif text-2xl font-bold text-purple-600">Make a Contribution</h2>
            <p className="mt-2 max-w-2xl leading-relaxed text-charcoal/75">
              Online card and bank payment is being set up. In the meantime you can contribute directly to
              the union&rsquo;s account using the details below — the account is verified and in active use.
            </p>
          </section>
        )}

        <div className="mt-16 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
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

        {/* The one fund with published figures, so it is the one shown with a target. */}
        <section className="mt-16">
          <SectionHeading
            eyebrow="Current community fund"
            title="Where support is going"
            align="left"
            className="mx-0"
            description="The Security Trust Fund is the community fund with published figures. Its position is reported by the union to its branches."
          />
          <div className="mt-8">
            <FundProgress fund={fund} />
          </div>
        </section>

        <section className="mt-16">
          <SectionHeading
            eyebrow="Approved areas"
            title="What your support goes towards"
            align="left"
            className="mx-0"
            description="Areas the union directs community support towards. Except where a fund is shown above with published figures, these are ongoing areas of work rather than active campaigns with targets."
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
