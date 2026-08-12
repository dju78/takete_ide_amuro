import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FileText, Trophy, Mic, HandCoins } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EmptyState } from "@/components/ui/EmptyState";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import { EventWeather } from "@/components/weather/EventWeather";
import { getEventByYear } from "@/lib/data/events";
import { formatDate } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

interface Props {
  params: Promise<{ year: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year } = await params;
  return {
    title: `Takete-Ide Day ${year}`,
    description: `Photographs, speeches and highlights from the Takete-Ide Day ${year} celebration.`,
  };
}

export default async function TaketeIdeDayYearPage({ params }: Props) {
  const { year } = await params;
  const yearNumber = Number(year);
  if (!Number.isInteger(yearNumber)) notFound();

  const event = await getEventByYear(yearNumber);

  if (!event) {
    return (
      <div className="bg-ivory">
        <div className="bg-purple-700 py-14 text-white">
          <Container>
            <Breadcrumb items={[{ label: "Takete-Ide Day", href: "/takete-ide-day" }, { label: year }]} />
            <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Takete-Ide Day {year}</h1>
          </Container>
        </div>
        <Container className="py-16">
          <EmptyState
            title={`Takete-Ide Day ${year} is being archived`}
            message="Photographs, speeches, awards and programme details from this celebration will be published here once added by the archive team."
          />
        </Container>
      </div>
    );
  }

  const eventJsonLd = event.event_date
    ? {
        "@context": "https://schema.org",
        "@type": "Event",
        name: `Takete-Ide Day ${event.year}${event.theme ? ` — ${event.theme}` : ""}`,
        description: event.description ?? undefined,
        startDate: event.event_date,
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: {
          "@type": "Place",
          name: siteConfig.location.community,
          address: {
            "@type": "PostalAddress",
            addressLocality: siteConfig.location.community,
            addressRegion: siteConfig.location.state,
            addressCountry: siteConfig.location.country,
          },
        },
        organizer: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
      }
    : null;

  return (
    <div className="bg-ivory">
      {eventJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
        />
      )}
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "Takete-Ide Day", href: "/takete-ide-day" }, { label: String(event.year) }]} />
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Takete-Ide Day {event.year}</h1>
          {event.theme && <p className="mt-2 text-xl text-gold-300">{event.theme}</p>}
          {event.event_date && <p className="mt-2 text-white/80">{formatDate(event.event_date)}</p>}
        </Container>
      </div>

      <Container className="grid gap-12 py-16 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-12">
          {event.description && (
            <section className="prose-heritage">
              <p>{event.description}</p>
            </section>
          )}

          {(event.chairman || event.guest_information) && (
            <section className="rounded-2xl border border-purple-600/10 bg-white p-6">
              <h2 className="font-serif text-xl font-bold text-purple-600">Programme</h2>
              {event.chairman && <p className="mt-2 text-sm text-charcoal/80"><strong>Chairman:</strong> {event.chairman}</p>}
              {event.guest_information && <p className="mt-1 text-sm text-charcoal/80"><strong>Guests:</strong> {event.guest_information}</p>}
              {event.programme_document_url && (
                <a href={event.programme_document_url} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-community-green hover:underline">
                  <FileText className="h-4 w-4" aria-hidden="true" /> Download Programme (PDF)
                </a>
              )}
            </section>
          )}

          {event.media.length > 0 ? (
            <section>
              <h2 className="font-serif text-xl font-bold text-purple-600">Photographs & Video</h2>
              <GalleryLightbox
                items={event.media
                  .filter((m) => m.media_type === "photo")
                  .map((m, i) => ({ id: String(i), image_url: m.url, alt_text: m.caption ?? "", caption: m.caption, category: "Event", title: null, event_year: event.year }))}
              />
            </section>
          ) : (
            <EmptyState title="Photographs coming soon" message="Photos from this celebration will be added to the gallery shortly." />
          )}

          {event.speeches.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-purple-600">
                <Mic className="h-5 w-5" aria-hidden="true" /> Speeches
              </h2>
              <div className="mt-4 space-y-4">
                {event.speeches.map((s, i) => (
                  <div key={i} className="rounded-xl border border-purple-600/10 bg-white p-5">
                    <p className="font-semibold text-purple-600">{s.speaker}</p>
                    {s.title && <p className="text-sm text-charcoal/60">{s.title}</p>}
                    {s.body && <p className="mt-2 text-sm text-charcoal/80">{s.body}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {event.awards.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-purple-600">
                <Trophy className="h-5 w-5" aria-hidden="true" /> Community Achievements & Awards
              </h2>
              <ul className="mt-4 space-y-2">
                {event.awards.map((a, i) => (
                  <li key={i} className="rounded-xl border border-purple-600/10 bg-white p-4 text-sm">
                    <strong className="text-purple-600">{a.recipient}</strong> — {a.award_title}
                    {a.description && <p className="mt-1 text-charcoal/70">{a.description}</p>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {event.fundraising.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-purple-600">
                <HandCoins className="h-5 w-5" aria-hidden="true" /> Development Fundraising
              </h2>
              <div className="mt-4 space-y-3">
                {event.fundraising.map((f, i) => (
                  <div key={i} className="rounded-xl border border-purple-600/10 bg-white p-4 text-sm">
                    <p className="font-semibold text-purple-600">{f.purpose}</p>
                    {f.target_amount != null && f.amount_raised != null && (
                      <p className="mt-1 text-charcoal/70">
                        {f.currency} {f.amount_raised.toLocaleString()} raised of {f.currency} {f.target_amount.toLocaleString()} target
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside>
          <EventWeather eventDateIso={event.event_date} />
        </aside>
      </Container>
    </div>
  );
}
