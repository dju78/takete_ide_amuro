import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { HeritageSubmissionForm } from "@/components/forms/HeritageSubmissionForm";

export const metadata: Metadata = {
  title: "Contribute an Oríkì",
  description: "Submit an Oríkì recording or text to the Takete-Ide digital heritage archive.",
};

export default function OrikiContributePage() {
  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "Oríkì", href: "/oriki" }, { label: "Contribute" }]} />
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Contribute an Oríkì</h1>
          <p className="mt-3 max-w-2xl text-white/80">
            Share a family Oríkì so it can be preserved, exactly as passed down, for future generations.
          </p>
        </Container>
      </div>

      <Container className="max-w-2xl py-16">
        <div className="rounded-3xl bg-white p-8 lg:p-10">
          <HeritageSubmissionForm submissionType="oriki" detailsLabel="Oríkì text (please write it exactly as recited)" />
        </div>
      </Container>
    </div>
  );
}
