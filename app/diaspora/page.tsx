import type { Metadata } from "next";
import { Globe2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconCard } from "@/components/cards/IconCard";
import { DiasporaForm } from "@/components/forms/DiasporaForm";

export const metadata: Metadata = {
  title: "Diaspora",
  description: "Takete-Ide people around the world — connect with the community wherever you are.",
};

const regions = [
  { name: "Nigeria", note: "Home communities and branches across the country." },
  { name: "United Kingdom", note: "UK-based indigenes and friends of Takete-Ide." },
  { name: "United States", note: "US-based indigenes and friends of Takete-Ide." },
  { name: "Canada", note: "Canada-based indigenes and friends of Takete-Ide." },
  { name: "Europe", note: "Indigenes across the wider European region." },
  { name: "Other Regions", note: "Takete-Ide people anywhere else in the world." },
];

export default function DiasporaPage() {
  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "Diaspora" }]} />
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Takete-Ide Around the World</h1>
          <p className="mt-3 max-w-2xl text-white/80">
            Our community extends beyond its geographic boundaries. Wherever you are, you remain part of
            Takete-Ide.
          </p>
        </Container>
      </div>

      <Container className="py-16">
        <SectionHeading eyebrow="Community Network" title="Where Our People Are" align="left" className="mx-0" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {regions.map((r) => (
            <IconCard key={r.name} icon={Globe2} title={r.name} description={r.note} />
          ))}
        </div>

        <div className="mt-16 grid gap-10 rounded-3xl bg-white p-8 lg:grid-cols-[1fr_1.3fr] lg:p-12">
          <div>
            <h2 className="font-serif text-2xl font-bold text-purple-600">Join the Community Network</h2>
            <p className="mt-3 text-charcoal/80">
              Register to join Takete-Ide&rsquo;s private diaspora network. Your details are stored securely
              and are never published publicly — they help the community reach you about relevant projects,
              events and opportunities to contribute.
            </p>
          </div>
          <DiasporaForm />
        </div>
      </Container>
    </div>
  );
}
