import type { Metadata } from "next";
import { CalendarDays, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HeritageImage } from "@/components/ui/HeritageImage";
import { MediaGallery } from "@/components/media/MediaGallery";
import { CommunityVideo } from "@/components/media/CommunityVideo";
import { BranchActivity } from "@/components/tipu/BranchActivity";
import { getCommunityMedia, mediaDateLabel } from "@/lib/data/community-media";
import { EVENTS } from "@/lib/media/community-media";

export const metadata: Metadata = {
  title: "TIPU Ilorin Branch New Yam Festival",
  description:
    "The TIPU Ilorin Branch New Yam Festival — photographs and video from the branch's August 2026 celebration of culture, fellowship and Takete-Ide heritage.",
};

export default async function IlorinBranchPage() {
  const items = await getCommunityMedia({ event: EVENTS.newYamIlorin });
  const images = items.filter((m) => m.mediaType === "image");
  const videos = items.filter((m) => m.mediaType === "video");
  const lead = images.find((m) => m.id === "new-yam-ilorin-full-group");
  const supporting = images.filter((m) => m.id !== "new-yam-ilorin-full-group");
  const dateLabel = lead ? mediaDateLabel(lead) : null;

  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb
            items={[
              { label: "TIPU", href: "/tipu" },
              { label: "Our Branches", href: "/tipu/branches" },
              { label: "Ilorin" },
            ]}
          />
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">
            Celebrating Heritage: TIPU Ilorin Branch New Yam Festival
          </h1>
          <p className="mt-3 max-w-2xl text-white/85">
            The TIPU Ilorin Branch brought members together in August 2026 for a colourful New Yam
            celebration centred on culture, fellowship and the preservation of Takete-Ide heritage.
          </p>
        </Container>
      </div>

      <Container className="py-14 sm:py-16">
        <article>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-charcoal/60">
            {dateLabel && (
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                {dateLabel}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Ilorin, Kwara State
            </span>
            <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600">
              Culture &amp; Events
            </span>
            <span className="rounded-full bg-gold-100 px-3 py-1 text-xs font-semibold text-gold-700">
              New Yam Festival
            </span>
          </div>

          {lead && (
            <figure className="mt-8">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl shadow-lg">
                <HeritageImage
                  src={lead.src}
                  alt={lead.altText}
                  label="TIPU Ilorin Branch New Yam Festival"
                  fill
                  priority
                  sizes="(min-width: 1280px) 1152px, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 text-sm text-charcoal/60">{lead.description}</figcaption>
            </figure>
          )}

          <div className="prose-heritage mt-10 max-w-3xl">
            <h2>A branch celebration of the new yam</h2>
            <p>
              Members of the Ilorin Branch gathered in a shared celebration cloth for the branch&rsquo;s New
              Yam festivities — a day given over to culture, fellowship and the recognition of service to
              the union. The festival is one of the fixed points of the branch calendar, and one of the
              clearest expressions of Takete-Ide identity away from home.
            </p>
            <p>
              The photographs and recordings below were supplied to the Takete-Ide archive by the branch.
              Where an award or presentation appears, the recipients and the wording of the citations are
              being confirmed with the branch before anything is published here — so this page records the
              occasion rather than attributing it.
            </p>
          </div>
        </article>

        {supporting.length > 0 && (
          <section className="mt-16">
            <SectionHeading eyebrow="Gallery" title="From the celebration" align="left" className="mx-0" />
            <div className="mt-6">
              <MediaGallery items={supporting} variant="editorial" />
            </div>
          </section>
        )}

        {videos.length > 0 && (
          <section className="mt-16">
            <SectionHeading eyebrow="Video" title="Watch" align="left" className="mx-0" />
            <div className="mt-8 grid gap-12 lg:grid-cols-2">
              {videos.map((video) => (
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

        <BranchActivity branchSlug="ilorin" />

        <p className="mt-14 text-xs text-charcoal/50">
          Photographs and video supplied by the Takete-Ide Progressive Union community archive. Individuals
          are not identified — see our{" "}
          <a href="/privacy" className="underline underline-offset-2">
            privacy policy
          </a>
          .
        </p>
      </Container>
    </div>
  );
}
