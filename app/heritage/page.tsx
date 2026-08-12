import type { Metadata } from "next";
import { Crown, Landmark, Sparkles, Users2, Mic2, Hammer, Languages, Image as ImageIcon, TreePine, Music4 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconCard } from "@/components/cards/IconCard";
import { LivingHeritageCard } from "@/components/cards/LivingHeritageCard";
import { ResearchDisclaimer } from "@/components/heritage/ResearchDisclaimer";

export const metadata: Metadata = {
  title: "Heritage",
  description: "The culture, customs, traditional institution and living heritage of Takete-Ide Amuro.",
};

export default function HeritagePage() {
  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "Heritage" }]} />
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Heritage</h1>
          <p className="mt-3 max-w-2xl text-white/80">
            The traditions, customs and living culture that shape Takete-Ide&rsquo;s identity.
          </p>
        </Container>
      </div>

      <Container className="py-16">
        <ResearchDisclaimer />

        <SectionHeading eyebrow="Culture in Motion" title="Living Heritage" align="left" className="mx-0 mt-14" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <LivingHeritageCard href="/heritage/agado" title="Agado Festival" description="Community video footage from the Agado Festival." isVideo />
          <LivingHeritageCard
            href="/heritage/ate"
            title="Ate — Egungun Heritage"
            description="Ate, one of the Egungun traditions observed in Takete-Ide."
            image="/images/takete-ide/ate-egungun.jpg"
            imageAlt="Ate, one of the Egungun traditions of Takete-Ide, in full masquerade dress"
          />
          <LivingHeritageCard
            href="/heritage/traditional-marriage"
            title="Traditional Marriage"
            description="Ceremonial items and gatherings associated with marriage celebrations."
            image="/images/takete-ide/marriage-celebration-1.jpg"
            imageAlt="Ceremonial items associated with a marriage celebration in Takete-Ide"
          />
          <LivingHeritageCard
            href="/gallery"
            title="Passing Heritage Forward"
            description="Children of Takete-Ide carrying our traditions into the next generation."
            image="/images/takete-ide/cultural-procession.jpg"
            imageAlt="Children in a cultural procession at a Takete-Ide celebration"
          />
        </div>

        <SectionHeading eyebrow="Explore" title="Our Heritage" align="left" className="mx-0 mt-16" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <IconCard icon={Crown} title="Traditional Institution" description="The Olude of Takete-Ide Amuro, the traditional council and their responsibilities." href="/heritage/traditional-institution" />
          <IconCard icon={Landmark} title="Our Families" description="Discover the families and compounds that form the Takete-Ide community." href="/families" tone="gold" />
          <IconCard icon={Music4} title="Our Oríkì" description="Listen to and preserve the praise poetry and oral traditions passed down through generations." href="/oriki" tone="green" />
          <IconCard icon={Mic2} title="Voices of Takete-Ide" description="Hear community history from those who carry its memory." href="/archive/oral-history" />
          <IconCard icon={Sparkles} title="Festivals" description="Takete-Ide Day and the celebrations that mark our shared calendar." href="/takete-ide-day" tone="gold" />
          <IconCard icon={ImageIcon} title="Historical Photographs" description="Archival images preserving moments from the community's past." href="/gallery?category=Historical%20Archive" tone="green" />
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <IconCard icon={Users2} title="Community Values" description="Faith, unity, self-help and respect for elders remain central to community life." />
          <IconCard icon={Hammer} title="Traditional Occupations" description="An agrarian community, with farming as a historic economic foundation." />
          <IconCard icon={Languages} title="Language & Identity" description="Takete-Ide's language and identity are rooted in the Yagba-speaking cultural zone." />
          <IconCard icon={TreePine} title="Oral Traditions" description="Customs and stories passed down through families and compounds — being documented via Voices of Takete-Ide." href="/archive/oral-history" />
        </div>
      </Container>
    </div>
  );
}
