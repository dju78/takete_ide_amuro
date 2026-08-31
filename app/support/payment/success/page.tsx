import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PaymentOutcome } from "@/components/community/PaymentOutcome";
import { getContributionByReference } from "@/lib/payments/contributions";

// Result pages depend on a reference in the query string and must never be
// cached or indexed: they describe one person's transaction.
export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ reference?: string; reason?: string }>;
}

export const metadata: Metadata = {
  title: "Thank you for supporting Takete-Ide",
  description: "Your contribution to Takete-Ide has been confirmed.",
  robots: { index: false, follow: false },
};

export default async function Page({ searchParams }: Props) {
  const { reference } = await searchParams;
  const contribution = reference ? await getContributionByReference(reference) : null;

  return (
    <div className="bg-ivory">
      <Container className="py-16">
        <Breadcrumb items={[{ label: "Support Takete-Ide", href: "/support" }, { label: "Payment confirmed" }]} />
        <div className="mt-10">
          <PaymentOutcome
            outcome="success"
            title="Thank you for supporting Takete-Ide."
            message={"Your contribution has been received and verified. It goes towards the work the community has approved."}
            contribution={contribution}
            reference={reference}
          />
        </div>
      </Container>
    </div>
  );
}
