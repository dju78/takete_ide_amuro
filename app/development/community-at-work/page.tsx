import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { CommunityVideo } from "@/components/media/CommunityVideo";
import { getCommunityMedia, mediaDateLabel } from "@/lib/data/community-media";
import { EVENTS } from "@/lib/media/community-media";

export const metadata: Metadata = {
  title: "Community at Work",
  description:
    "Community-recorded footage of work around Takete-Ide — local attention to roads, the surrounding environment and building works.",
};

export default async function CommunityAtWorkPage() {
  const [atWork, palace] = await Promise.all([
    getCommunityMedia({ event: EVENTS.communityAtWork, mediaType: "video" }),
    getCommunityMedia({ event: EVENTS.palaceWorks, mediaType: "video" }),
  ]);
  const lead = atWork[0];

  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "Development", href: "/development" }, { label: "Community at Work" }]} />
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Community at Work</h1>
          <p className="mt-3 max-w-2xl text-white/85">
            Footage recorded and shared by the community itself, showing local effort going into Takete-Ide
            &mdash; the roads people use, the environment around them, and building work in progress.
          </p>
        </Container>
      </div>

      <Container className="max-w-4xl py-14 sm:py-16">
        {lead && (
          <>
            {mediaDateLabel(lead) && (
              <p className="mb-6 text-sm text-charcoal/60">{mediaDateLabel(lead)}</p>
            )}
            <CommunityVideo
              src={lead.src}
              poster={lead.poster}
              title={lead.title}
              description={lead.description}
              durationLabel={lead.durationLabel}
              verificationNote={lead.verificationNote}
              orientation={lead.orientation}
              headingLevel={2}
            />
          </>
        )}

        <div className="prose-heritage mt-12">
          <h2>What this records — and what it does not</h2>
          <p>
            This recording documents community activity around a road and its surroundings. Takete-Ide has a
            long practice of self-help work of exactly this kind, and the footage is published here as a
            record of that effort.
          </p>
          <p>
            It is deliberately <strong>not</strong> presented as a named road project. The specific road,
            the nature of the work and any responsible organisation have not been confirmed, so attaching a
            project name to it would be a guess dressed as a fact. Once the community confirms the details,
            an administrator can update the description and link this footage to the relevant project
            record.
          </p>
        </div>

        {palace.length > 0 && (
          <section className="mt-16">
            <SectionHeading eyebrow="Also on record" title="Building works" align="left" className="mx-0" />
            <div className="mt-8">
              {palace.map((video) => (
                <CommunityVideo
                  key={video.id}
                  src={video.src}
                  poster={video.poster}
                  title={video.title}
                  description={video.description}
                  durationLabel={video.durationLabel}
                  verificationNote={video.verificationNote}
                  orientation={video.orientation}
                />
              ))}
            </div>
          </section>
        )}

        <div className="mt-16 rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="font-serif text-xl font-bold text-purple-600">Know more about this work?</h2>
          <p className="mt-3 text-charcoal/80">
            If you can confirm the road, the project or the organisation behind the work in this footage,
            the archive team would like to hear from you — accurate records depend on people who were there.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/contact" variant="secondary">
              Help confirm the details
            </ButtonLink>
            <ButtonLink href="/development" variant="outline">
              All development projects
            </ButtonLink>
          </div>
        </div>
      </Container>
    </div>
  );
}
