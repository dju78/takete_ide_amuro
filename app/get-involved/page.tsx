import type { Metadata } from "next";
import { HandHeart, Users, Globe2, BookOpen, Mic, Handshake, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconCard } from "@/components/cards/IconCard";
import { VolunteerForm } from "@/components/forms/VolunteerForm";
import { NominationForm } from "@/components/forms/NominationForm";

export const metadata: Metadata = {
  title: "Get Involved",
  description: "Volunteer, contribute historical materials, or partner with Takete-Ide Amuro's community development.",
};

const options = [
  { icon: HandHeart, title: "Volunteer Skills", description: "Offer your professional or technical skills to community initiatives." },
  { icon: Users, title: "Community Projects", description: "Support ongoing development projects with time, expertise or funding." },
  { icon: Globe2, title: "Diaspora Participation", description: "Join the diaspora network to stay connected and contribute from abroad.", href: "/diaspora" },
  { icon: BookOpen, title: "Share Historical Materials", description: "Contribute photographs, documents or family records to the digital archive.", href: "/archive" },
  { icon: Mic, title: "Oral History Contribution", description: "Share or recommend elders for the Voices of Takete-Ide oral history project.", href: "/archive/oral-history" },
  { icon: Handshake, title: "Community Partnerships", description: "Explore institutional or organisational partnerships with Takete-Ide." },
  { icon: Sparkles, title: "Youth Engagement", description: "Get young people involved in heritage, development and leadership." },
];

export default function GetInvolvedPage() {
  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "Get Involved" }]} />
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Get Involved</h1>
          <p className="mt-3 max-w-2xl text-white/80">
            Whether at home or in the diaspora, your skills, knowledge and support can help preserve our
            heritage and advance community development.
          </p>
        </Container>
      </div>

      <Container className="py-16">
        <SectionHeading eyebrow="Ways to Contribute" title="How You Can Help" align="left" className="mx-0" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {options.map((o) => (
            <IconCard key={o.title} icon={o.icon} title={o.title} description={o.description} href={o.href} />
          ))}
        </div>

        <div className="mt-16 rounded-3xl bg-white p-8 lg:p-12">
          <h2 className="font-serif text-2xl font-bold text-purple-600">Tell Us How You&rsquo;d Like to Help</h2>
          <p className="mt-2 max-w-2xl text-charcoal/80">
            Fill in the form below and the relevant team will follow up with you.
          </p>
          <div className="mt-8 max-w-xl">
            <VolunteerForm />
          </div>
        </div>

        <div id="nominate" className="mt-16 scroll-mt-24 rounded-3xl bg-white p-8 lg:p-12">
          <h2 className="font-serif text-2xl font-bold text-purple-600">Nominate Someone for Our People</h2>
          <p className="mt-2 max-w-2xl text-charcoal/80">
            Know a Takete-Ide indigene whose story should be told? Nominate them for the Our People section.
            Nominations are reviewed before publication.
          </p>
          <div className="mt-8 max-w-xl">
            <NominationForm />
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-gold-500/30 bg-gold-100/50 p-6 text-sm text-charcoal/80">
          Financial donations are not yet enabled on this website. Once secure payment processing and
          community-authorised financial governance are in place, this page will offer a way to contribute
          funds directly to Takete-Ide development projects.
        </div>
      </Container>
    </div>
  );
}
