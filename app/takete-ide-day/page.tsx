import type { Metadata } from "next";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { HeritageImage } from "@/components/ui/HeritageImage";
import { getPublishedEvents } from "@/lib/data/events";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Takete-Ide Day",
  description: "The annual Takete-Ide Day celebration — history, cultural meaning, and the archive of past celebrations.",
};

export default async function TaketeIdeDayPage() {
  const events = await getPublishedEvents();

  return (
    <div className="bg-ivory">
      <div className="relative overflow-hidden bg-purple-700 py-16 text-white">
        <Container>
          <Breadcrumb items={[{ label: "Takete-Ide Day" }]} />
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Takete-Ide Day</h1>
          <p className="mt-3 max-w-2xl text-white/85">
            Celebrating our culture. Strengthening our unity. Building our community.
          </p>
        </Container>
      </div>

      <Container className="py-14 sm:py-16">
        <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-lg lg:hidden">
            <HeritageImage src="/images/takete-ide/takete-ide-day.jpg" alt="Community members preparing for a Takete-Ide Day celebration" label="Takete-Ide Day" fill sizes="100vw" className="object-cover" />
          </div>
          <div>
            <h2 className="mt-8 font-serif text-2xl font-bold text-purple-600 lg:mt-0">A Homecoming and a Fundraiser</h2>
            <p className="mt-4 leading-relaxed text-charcoal/80">
              Takete-Ide Day is the community&rsquo;s major annual socio-cultural festival, bringing together
              indigenes at home and in the diaspora. It typically takes place between October and November
              each year, serving both as a homecoming celebration of shared culture and as a vehicle for
              community-led infrastructure fundraising.
            </p>
            <p className="mt-3 text-sm text-charcoal/60">
              Exact dates, themes and programmes vary by year — see the event archive below for confirmed
              details of each celebration.
            </p>
          </div>
          <div className="hidden grid-cols-2 gap-4 lg:grid">
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <HeritageImage src="/images/takete-ide/takete-ide-day.jpg" alt="Community members preparing for a Takete-Ide Day celebration" label="Takete-Ide Day" fill sizes="22vw" className="object-cover" />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <HeritageImage src="/images/takete-ide/takete-ide-day-2025.jpg" alt="News coverage of Takete-Ide Day 2025" label="Takete-Ide Day 2025" fill sizes="22vw" className="object-cover" />
            </div>
          </div>
        </section>

        <section className="mt-16">
          <SectionHeading eyebrow="Archive" title="Celebration Archive" align="left" className="mx-0" />
          <div className="mt-8">
            {events.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <Link
                    key={event.id}
                    href={`/takete-ide-day/${event.year}`}
                    className="group flex flex-col rounded-2xl border border-purple-600/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
                  >
                    <span className="flex items-center gap-2 font-serif text-2xl font-bold text-purple-600 group-hover:text-purple-400">
                      <Calendar className="h-5 w-5" aria-hidden="true" />
                      {event.year}
                    </span>
                    {event.theme && <p className="mt-2 text-sm font-medium text-gold-700">{event.theme}</p>}
                    {event.event_date && <p className="mt-1 text-xs text-charcoal/50">{formatDate(event.event_date)}</p>}
                    {event.description && <p className="mt-3 text-sm text-charcoal/70">{event.description}</p>}
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Calendar}
                title="Event archive is being compiled"
                message="Detailed pages for each Takete-Ide Day celebration — including 2025 and 2024 — will appear here as the programme, photographs and speeches are added by the archive team."
              />
            )}
          </div>
        </section>
      </Container>
    </div>
  );
}
