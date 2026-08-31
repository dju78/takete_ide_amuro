import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Info } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { FundProgress } from "@/components/community/FundProgress";
import { getSecurityTrustFund } from "@/lib/data/community-programme";
import { getBranchNetwork } from "@/lib/data/tipu-branches";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Security Trust Fund",
  description:
    "The Takete-Ide community Security Trust Fund — the branch levy target and the position reported by the union.",
};

export default async function SecurityTrustFundPage() {
  const [fund, branches] = await Promise.all([getSecurityTrustFund(), getBranchNetwork()]);

  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb
            items={[{ label: "Development", href: "/development" }, { label: "Security Trust Fund" }]}
          />
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-300">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Community fund
          </p>
          <h1 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">Security Trust Fund</h1>
          <p className="mt-3 max-w-2xl text-white/85">
            A community fund raised across the union&rsquo;s branches to support security at home in
            Takete-Ide.
          </p>
        </Container>
      </div>

      <Container className="max-w-4xl py-14 sm:py-16">
        <FundProgress fund={fund} />

        <div className="prose-heritage mt-12">
          <h2>How the fund is raised</h2>
          <p>
            The Security Trust Fund is raised by levy across the Takete-Ide Progressive Union&rsquo;s
            branches, alongside individual contributions. Branches are assigned levy targets and report
            their remittances to the union, which publishes a consolidated status to its membership.
          </p>
          <p>
            The figures above are taken from the union&rsquo;s own status update of{" "}
            {formatDate(fund.asOf)}. They are reproduced here as a dated record so that members at home
            and abroad can see the fund&rsquo;s reported position — not as a live account balance, and not
            as a figure this website can verify independently.
          </p>
        </div>

        <div className="mt-10 flex gap-3 rounded-2xl border border-gold-500/30 bg-gold-100/60 p-5 text-sm leading-relaxed text-charcoal/80">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-gold-700" aria-hidden="true" />
          <div>
            <p className="font-semibold text-charcoal">What this page does not publish</p>
            <p className="mt-1">
              No individual contributor is named, and no branch-by-branch breakdown is shown. Branch
              participation in the fund is recorded by the union; it is not used on this site to imply
              anything about a branch&rsquo;s size, structure or standing in the network.
            </p>
          </div>
        </div>

        <section className="mt-14">
          <SectionHeading
            eyebrow="Across the network"
            title="A fund raised together"
            align="left"
            className="mx-0"
            description={`Branches across the union contribute to the fund. The network currently spans ${branches.length} documented branch and community records.`}
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/support">Contribute to the fund</ButtonLink>
            <Link
              href="/tipu/branches"
              className="inline-flex items-center rounded-full border-2 border-purple-600 px-6 py-3 text-base font-semibold text-purple-600 transition-colors hover:bg-purple-600 hover:text-white"
            >
              Explore the TIPU Network
            </Link>
          </div>
        </section>
      </Container>
    </div>
  );
}
