import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <div className="bg-ivory">
      <Container className="max-w-3xl py-16">
        <Breadcrumb items={[{ label: "Terms" }]} />
        <h1 className="mt-4 font-serif text-4xl font-bold text-purple-600">Terms of Use</h1>
        <div className="prose-heritage mt-8 text-charcoal/85">
          <div className="rounded-2xl border border-gold-500/30 bg-gold-100/50 p-5 text-sm">
            This is a draft terms template requiring final legal and community review — see{" "}
            <code>docs/DECISIONS.md</code>.
          </div>

          <h2>Acceptance of Terms</h2>
          <p>By using this website, you agree to these Terms of Use.</p>

          <h2>Purpose of the Website</h2>
          <p>
            This website is the official digital platform of Takete-Ide Amuro, provided for community
            information, cultural preservation, development transparency and diaspora engagement.
          </p>

          <h2>Historical and Cultural Content</h2>
          <p>
            Historical and family/Oríkì content is presented with verification status labels. Content
            labelled as community tradition or oral history reflects community accounts and may continue to
            be researched — see <Link href="/heritage">Heritage</Link> and{" "}
            <code>docs/HISTORICAL_VERIFICATION.md</code>.
          </p>

          <h2>User Submissions</h2>
          <p>
            By submitting material (photographs, documents, Oríkì, family history, nominations), you confirm
            you have the right to share it and grant Takete-Ide Amuro permission to review, and where
            permitted, archive and publish it, subject to editorial review.
          </p>

          <h2>Intellectual Property</h2>
          <p>
            Original site design and code are the property of Takete-Ide Amuro. Community-contributed
            historical and cultural material remains subject to the rights and permissions recorded at the
            time of submission.
          </p>

          <h2>No Financial Transactions</h2>
          <p>
            This website does not currently process financial donations or payments. Any future donation
            functionality will be clearly labelled and separately governed.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            This website is provided &ldquo;as is&rdquo;. While we take care to verify content, Takete-Ide
            Amuro is not liable for errors in historical accounts still under research.
          </p>

          <h2>Changes to These Terms</h2>
          <p>These terms may be updated from time to time; continued use of the site constitutes acceptance of changes.</p>

          <h2>Contact</h2>
          <p>Questions about these terms can be sent via the <Link href="/contact">Contact page</Link>.</p>
        </div>
      </Container>
    </div>
  );
}
