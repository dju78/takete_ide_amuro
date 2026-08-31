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
  title: "Payment pending",
  description: "Your contribution to Takete-Ide has not completed yet.",
  robots: { index: false, follow: false },
};

export default async function Page({ searchParams }: Props) {
  const { reference } = await searchParams;
  const contribution = reference ? await getContributionByReference(reference) : null;

  return (
    <div className="bg-ivory">
      <Container className="py-16">
        <Breadcrumb items={[{ label: "Support Takete-Ide", href: "/support" }, { label: "Payment pending" }]} />
        <div className="mt-10">
          <PaymentOutcome
            outcome="pending"
            title="Your payment is still being completed."
            message={"We have not yet had confirmation from the payment provider. If you were paying by bank transfer, this can take a little time. Please do not pay again — we will update this contribution automatically once the payment confirms."}
            contribution={contribution}
            reference={reference}
          />
        </div>
      </Container>
    </div>
  );
}
