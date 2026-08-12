import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { HeritageSubmissionForm } from "@/components/forms/HeritageSubmissionForm";

export const metadata: Metadata = {
  title: "Help Preserve Your Family History",
  description: "Submit your family's history, Oríkì and heritage records to the Takete-Ide digital archive.",
};

export default function FamiliesContributePage() {
  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "Families & Oríkì", href: "/families" }, { label: "Contribute" }]} />
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Help Preserve Your Family History</h1>
          <p className="mt-3 max-w-2xl text-white/80">
            A Takete-Ide child born anywhere in the world should be able to learn their family&rsquo;s
            history, hear its Oríkì, and understand how it connects to our shared story. Your contribution
            makes that possible.
          </p>
        </Container>
      </div>

      <Container className="max-w-2xl py-16">
        <div className="rounded-3xl bg-white p-8 lg:p-10">
          <HeritageSubmissionForm submissionType="family_history" detailsLabel="Family history, Oríkì, or details you'd like to share" />
        </div>
        <p className="mt-6 text-sm text-charcoal/60">
          All submissions are reviewed by the archive team before anything is published. Community accounts
          that differ are presented neutrally — this platform does not resolve family disputes.
        </p>
      </Container>
    </div>
  );
}
