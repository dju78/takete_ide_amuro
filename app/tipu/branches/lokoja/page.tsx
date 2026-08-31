import type { Metadata } from "next";
import { CalendarDays, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HeritageImage } from "@/components/ui/HeritageImage";
import { MediaGallery } from "@/components/media/MediaGallery";
import { BranchActivity } from "@/components/tipu/BranchActivity";
import { getCommunityMedia, mediaDateLabel } from "@/lib/data/community-media";
import { EVENTS } from "@/lib/media/community-media";

export const metadata: Metadata = {
  title: "TIPU Lokoja Branch",
  description:
    "The Takete-Ide Progressive Union Lokoja Branch and its monthly gatherings, including the August 2026 meeting.",
};

export default async function LokojaBranchPage() {
  const items = await getCommunityMedia({ event: EVENTS.lokojaMeeting });
  const lead = items.find((m) => m.id === "tipu-lokoja-branch-group");
  const supporting = items.filter((m) => m.id !== "tipu-lokoja-branch-group");
  const dateLabel = lead ? mediaDateLabel(lead) : null;

  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb
            items={[
              { label: "TIPU", href: "/tipu" },
              { label: "Our Branches", href: "/tipu/branches" },
              { label: "Lokoja" },
            ]}
          />
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">TIPU Lokoja Branch</h1>
          <p className="mt-3 max-w-2xl text-white/85">
            The union&rsquo;s branch in Kogi State&rsquo;s capital, meeting monthly to keep Takete-Ide
            people in Lokoja connected to one another and to home.
          </p>
        </Container>
      </div>

      <Container className="py-14 sm:py-16">
        <article>
          <SectionHeading
            eyebrow="Branch Activity"
            title="TIPU Lokoja Branch Monthly Meeting"
            align="left"
            className="mx-0"
          />
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-charcoal/60">
            {dateLabel && (
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                {dateLabel}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Lokoja, Kogi State
            </span>
          </div>

          {lead && (
            <figure className="mt-8">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl shadow-lg">
                <HeritageImage
                  src={lead.src}
                  alt={lead.altText}
                  label="TIPU Lokoja Branch"
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
            <p>
              Members of the Takete-Ide Progressive Union Lokoja Branch during their August 2026 monthly
              gathering, reflecting the continuing role of TIPU branches in strengthening community
              connection and participation.
            </p>
            <p>
              Branch meetings are where the union&rsquo;s work is actually done between the bigger dates in
              the calendar — welfare, contributions towards projects at home, and simply keeping people in
              touch across a city.
            </p>
          </div>

          {supporting.length > 0 && (
            <section className="mt-14">
              <h2 className="font-serif text-2xl font-bold text-purple-600">From the gathering</h2>
              <div className="mt-6">
                <MediaGallery items={supporting} variant="grid" />
              </div>
            </section>
          )}
        </article>

        <BranchActivity branchSlug="lokoja" />

        <p className="mt-12 text-xs text-charcoal/50">
          Photographs supplied by the Takete-Ide Progressive Union community archive. Individuals are not
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
