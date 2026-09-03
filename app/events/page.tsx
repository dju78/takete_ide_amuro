import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, MapPin, Clock, History } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";
import { CentenaryCountdown } from "@/components/community/CentenaryCountdown";
import { getGroupedEvents, EVENT_CATEGORY_LABELS, type CommunityEvent } from "@/lib/data/community-events";
import { getCentenary, getCentenaryProgramme } from "@/lib/data/community-programme";
import { siteConfig } from "@/lib/site-config";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Upcoming and past Takete-Ide community events — Takete-Ide Day, the Centenary Celebration and TIPU branch gatherings.",
};

export const revalidate = 3600;

export default async function EventsPage() {
  const [{ upcoming, past }, centenary, programmes] = await Promise.all([
    getGroupedEvents(),
    getCentenary(),
    getCentenaryProgramme(),
  ]);

  /**
   * schema.org Event for the upcoming list only, and only with fields the
   * community has actually confirmed. No startTime is emitted where none is on
   * record — an invented time is worse than an absent one.
   */
  const eventsJsonLd = upcoming.map((e) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.title,
    startDate: e.date,
    eventStatus:
      e.status === "cancelled"
        ? "https://schema.org/EventCancelled"
        : "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    ...(e.description ? { description: e.description } : {}),
    ...(e.venue
      ? {
          location: {
            "@type": "Place",
            name: e.venue,
            ...(e.location ? { address: e.location } : {}),
          },
        }
      : {}),
    organizer: { "@type": "Organization", name: "Takete-Ide Progressive Union" },
    url: `${siteConfig.url}${e.href}`,
  }));

  return (
    <div className="bg-ivory">
      {eventsJsonLd.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsJsonLd) }}
        />
      )}

      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "Events" }]} />
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Community Events</h1>
          <p className="mt-3 max-w-2xl text-white/85">
            Takete-Ide Day, the Centenary Celebration and gatherings across the TIPU branch network — at
            home and in the diaspora.
          </p>
        </Container>
      </div>

      <Container className="py-14 sm:py-16">
        {/* The Centenary leads: it is the community's largest confirmed date. */}
        <section className="overflow-hidden rounded-3xl bg-purple-700 p-8 text-white lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">Next major event</p>
              <h2 className="mt-2 font-serif text-2xl font-bold sm:text-3xl">{centenary.title}</h2>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/85">
                <span className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-gold-300" aria-hidden="true" />
                  {centenary.eventDateLabel}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gold-300" aria-hidden="true" />
                  {centenary.venue}
                </span>
              </div>
              <ButtonLink href="/centenary" className="mt-6">
                Centenary 2026
              </ButtonLink>
            </div>
            <CentenaryCountdown programmes={programmes} tone="light" />
          </div>
        </section>

        <section className="mt-16">
          <SectionHeading eyebrow="Ahead" title="Upcoming Events" align="left" className="mx-0" />
          <div className="mt-8">
            {upcoming.length > 0 ? (
              <ul className="flex flex-col gap-4">
                {upcoming.map((event) => (
                  <EventRow key={event.id} event={event} />
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={CalendarDays}
                title="No upcoming events listed"
                message="Community and branch events will appear here as they are confirmed and published by the union."
              />
            )}
          </div>
        </section>

        <section className="mt-16">
          <SectionHeading eyebrow="Archive" title="Past Events" align="left" className="mx-0" />
          <div className="mt-8">
            {past.length > 0 ? (
              <ul className="flex flex-col gap-4">
                {past.map((event) => (
                  <EventRow key={event.id} event={event} past />
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={History}
                title="The event archive is being compiled"
                message="Records of past Takete-Ide Day celebrations and branch gatherings will appear here as they are added."
              />
            )}
          </div>
        </section>

        <p className="mt-12 text-xs leading-relaxed text-charcoal/55">
          Start times, programmes and guest details are published only once the organising committee
          confirms them. Where this page shows a date without a time, the time is not yet on record.
        </p>
      </Container>
    </div>
  );
}

function EventRow({ event, past = false }: { event: CommunityEvent; past?: boolean }) {
  const cancelled = event.status === "cancelled";
  return (
    <li>
      <Link
        href={event.href}
        className={`group flex flex-col gap-3 rounded-2xl border border-purple-600/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:gap-6 ${
          past ? "opacity-90" : ""
        }`}
      >
        {/* Date block — the thing people scan for. */}
        <span className="flex shrink-0 flex-col items-center justify-center rounded-xl bg-purple-50 px-4 py-3 text-center sm:w-24">
          <span className="font-serif text-2xl font-bold leading-none text-purple-600">
            {new Date(event.date).getDate()}
          </span>
          <span className="mt-1 text-xs font-semibold uppercase tracking-wide text-charcoal/60">
            {new Date(event.date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
          </span>
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-semibold text-gold-700">
              {EVENT_CATEGORY_LABELS[event.category]}
            </span>
            {cancelled && (
              <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                Cancelled
              </span>
            )}
          </span>
          <span className="mt-1.5 block font-serif text-lg font-bold text-purple-600 group-hover:text-purple-400">
            {event.title}
          </span>
          <span className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-charcoal/60">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {formatDate(event.date)}
            </span>
            {event.time && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {event.time}
              </span>
            )}
            {(event.venue || event.location) && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {event.venue ?? event.location}
              </span>
            )}
          </span>
          {event.description && (
            <span className="mt-2 block text-sm leading-relaxed text-charcoal/70">{event.description}</span>
          )}
        </span>
      </Link>
    </li>
  );
}
