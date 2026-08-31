import type { Metadata } from "next";
import { CalendarDays, Globe2, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ButtonLink } from "@/components/ui/Button";
import { HeritageImage } from "@/components/ui/HeritageImage";
import { getCommunityMedia, mediaDateLabel } from "@/lib/data/community-media";
import { EVENTS } from "@/lib/media/community-media";

export const metadata: Metadata = {
  title: "TIPU UK & Europe Chapter",
  description:
    "The Takete-Ide Progressive Union UK & Europe Chapter held its inaugural meeting in August 2026, strengthening diaspora participation in the community's development.",
};

export default async function UkEuropeChapterPage() {
  const items = await getCommunityMedia({ event: EVENTS.ukEuropeInaugural });
  const lead = items.find((m) => m.id === "tipu-uk-europe-inaugural-group");
  const dateLabel = lead ? mediaDateLabel(lead) : null;

  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "Diaspora", href: "/diaspora" }, { label: "UK & Europe" }]} />
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-300">
            <Globe2 className="h-3.5 w-3.5" aria-hidden="true" />
            A milestone for the diaspora
          </p>
          <h1 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">
            TIPU UK &amp; Europe Chapter Holds Inaugural Meeting
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85">
            Takete-Ide sons and daughters in the United Kingdom and Europe came together in August 2026 as
            part of efforts to strengthen diaspora participation, community connection and support for the
            development of Takete-Ide.
          </p>
        </Container>
      </div>

      <Container className="py-14 sm:py-16">
        {/* Venue comes from the chapter's own announcement, not from the photograph. */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-charcoal/60">
          {dateLabel && (
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              {dateLabel}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            Essex, United Kingdom
          </span>
        </div>

        {lead && (
          <figure className="mt-6">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-lg sm:aspect-[16/9]">
              <HeritageImage
                src={lead.src}
                alt={lead.altText}
                label="TIPU UK & Europe Chapter inaugural meeting"
                fill
                priority
                sizes="(min-width: 1280px) 1152px, 100vw"
                className="object-cover object-top"
              />
            </div>
            <figcaption className="mt-3 text-sm text-charcoal/60">{lead.description}</figcaption>
          </figure>
        )}

        <div className="prose-heritage mt-12 max-w-3xl">
          <h2>Why this matters</h2>
          <p>
            Takete-Ide has always extended past its own boundaries. What is new is a standing structure for
            it in the United Kingdom and Europe: a chapter of the Takete-Ide Progressive Union that can meet,
            organise and speak with one voice on behalf of indigenes in the region.
          </p>
          <p>
            The chapter&rsquo;s purpose is practical — connecting people who are far from home to one
            another, and channelling diaspora support towards development at home through the union&rsquo;s
            existing structures rather than in parallel to them.
          </p>
          <p className="text-sm italic text-charcoal/60">
            The chapter resolved at its inaugural meeting to contribute as a body towards the hosting of
            Takete-Ide Day 2026 and the Centenary Celebration. Its officers, meeting schedule and contact
            arrangements have not yet been supplied for publication, and will be added here as the chapter
            confirms them.
          </p>
        </div>

        <div className="mt-12 rounded-3xl bg-white p-8 shadow-sm lg:p-10">
          <h2 className="font-serif text-2xl font-bold text-purple-600">
            In the UK or Europe? Join the network
          </h2>
          <p className="mt-3 max-w-2xl text-charcoal/80">
            Register with the Takete-Ide diaspora network to be reached about chapter meetings, projects and
            opportunities to contribute. Your details are stored securely and are never published publicly.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/diaspora">Join the community network</ButtonLink>
            <ButtonLink href="/tipu/branches" variant="outline">
              See all TIPU branches
            </ButtonLink>
          </div>
        </div>

        <p className="mt-12 text-xs text-charcoal/50">
          Photograph supplied by the Takete-Ide Progressive Union community archive. Individuals are not
          identified — see our{" "}
          <a href="/privacy" className="underline underline-offset-2">
            privacy policy
          </a>
          .
        </p>
      </Container>
    </div>
  );
}
