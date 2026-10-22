import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Clock, Globe2, MapPin, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { LiveBroadcastHub } from "@/components/live/LiveBroadcastHub";
import { ShareControls } from "@/components/live/ShareControls";
import { LiveReplays } from "@/components/live/ReplayList";
import { CelebrationAudio } from "@/components/live/CelebrationAudio";
import { getLiveBroadcast } from "@/lib/data/live-broadcast";
import { getCentenary, getCentenaryProgramme } from "@/lib/data/community-programme";
import { EVENT_DATES_LABEL, EVENT_TIMEZONE_LABEL, LIVE_PAGE_URL, toPublicBroadcast } from "@/lib/live/broadcast";
import { siteConfig } from "@/lib/site-config";

const TITLE = "Takete-Ide Centenary Celebration — Live";
const DESCRIPTION =
  "Watch the Takete-Ide Centenary Celebration from anywhere, 29–31 October 2026 — YouTube broadcast, live chat, programme in Lagos time and replays.";

// The official invitation artwork: an approved, landscape asset that reads well
// as a WhatsApp/Facebook link preview.
const SHARE_IMAGE = {
  url: "/images/takete-ide/centenary-invitation.jpg",
  width: 1024,
  height: 723,
  alt: "Official invitation to the 2026 Takete-Ide Day Centenary Celebration",
};

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  // Canonical/OG URLs are always production, even on deploy previews.
  alternates: { canonical: LIVE_PAGE_URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: LIVE_PAGE_URL,
    siteName: siteConfig.name,
    locale: "en_GB",
    type: "website",
    images: [SHARE_IMAGE],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [SHARE_IMAGE.url] },
};

// Short ISR window so a status change from /admin/live reaches new visitors
// quickly; visitors already on the page are updated by client polling.
export const revalidate = 60;

export default async function LivePage() {
  const [broadcast, centenary, programme] = await Promise.all([
    getLiveBroadcast(),
    getCentenary(),
    getCentenaryProgramme(),
  ]);

  const initial = toPublicBroadcast(broadcast);
  const days = [1, 2, 3].map((dayNumber) => {
    const items = programme
      .filter((p) => p.dayNumber === dayNumber)
      .sort((a, b) => a.displayOrder - b.displayOrder);
    return {
      dayNumber,
      label: items[0]?.dayLabel ?? `Day ${dayNumber}`,
      dateLabel: items[0]?.dateLabel ?? null,
      items,
    };
  });
  const dayLabels = Object.fromEntries(days.map((d) => [d.dayNumber, d.dateLabel ? `${d.label} · ${d.dateLabel}` : d.label]));

  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-10 text-white sm:py-14">
        <Container>
          <Breadcrumb items={[{ label: "Centenary 2026", href: "/centenary" }, { label: "Live" }]} />
          <h1 className="mt-4 font-serif text-3xl font-bold leading-tight sm:text-5xl">{TITLE}</h1>
          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 font-semibold ring-1 ring-inset ring-white/15">
              <CalendarDays className="h-4 w-4 text-gold-300" aria-hidden="true" />
              {EVENT_DATES_LABEL}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 font-semibold ring-1 ring-inset ring-white/15">
              <Globe2 className="h-4 w-4 text-gold-300" aria-hidden="true" />
              Times in {EVENT_TIMEZONE_LABEL}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 font-semibold ring-1 ring-inset ring-white/15">
              <MapPin className="h-4 w-4 text-gold-300" aria-hidden="true" />
              {centenary.venue}
            </span>
          </div>
          <p className="mt-4 max-w-3xl text-base text-white/85 sm:text-lg">
            Join the celebration from anywhere in the world. Watch the live broadcast, chat with family and friends on
            YouTube, and catch up on recordings after each session.
          </p>
        </Container>
      </div>

      <Container className="flex flex-col gap-12 py-10 sm:py-14">
        <section aria-label="Live broadcast">
          <LiveBroadcastHub initial={initial} />
        </section>

        <section id="celebration-audio" aria-labelledby="celebration-audio-heading" className="scroll-mt-24">
          <CelebrationAudio />
        </section>

        <section aria-labelledby="share-heading" className="rounded-2xl bg-purple-50 p-5 sm:p-6">
          <h2 id="share-heading" className="font-serif text-2xl font-bold text-purple-700">
            Share the live broadcast
          </h2>
          <p className="mt-1 text-sm text-charcoal/75">Send this page to family and friends at home and abroad.</p>
          <div className="mt-4">
            <ShareControls url={LIVE_PAGE_URL} text="Watch the Takete-Ide Centenary Celebration (29–31 October 2026):" />
          </div>
        </section>

        <section id="programme" aria-labelledby="programme-heading" className="scroll-mt-24">
          <h2 id="programme-heading" className="font-serif text-2xl font-bold text-purple-700 sm:text-3xl">
            Programme
          </h2>
          <p className="mt-2 flex items-center gap-2 text-sm text-charcoal/75">
            <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
            All times are {EVENT_TIMEZONE_LABEL}.
          </p>
          <ol className="mt-6 grid gap-5 lg:grid-cols-3">
            {days.map((day) => (
              <li key={day.dayNumber} className="flex flex-col rounded-2xl bg-white p-5 ring-1 ring-purple-600/10" data-testid={`programme-day-${day.dayNumber}`}>
                <h3 className="font-serif text-lg font-bold text-purple-700">{day.label}</h3>
                {day.dateLabel && <p className="text-sm font-semibold text-gold-700">{day.dateLabel}</p>}
                {day.items.length === 0 ? (
                  <p className="mt-3 text-sm text-charcoal/75">Programme details will be published when confirmed.</p>
                ) : (
                  <ul className="mt-3 flex flex-col gap-4">
                    {day.items.map((item) => (
                      <li key={item.id}>
                        <p className="font-semibold text-charcoal">{item.title}</p>
                        <p className="mt-0.5 text-sm text-charcoal/75">
                          {item.timeLabel || item.startTime
                            ? `${item.timeLabel ?? item.startTime}${item.endTime ? `–${item.endTime}` : ""} WAT`
                            : "Session times to be announced"}
                        </p>
                        {item.description && <p className="mt-1 text-sm text-charcoal/70">{item.description}</p>}
                      </li>
                    ))}
                  </ul>
                )}
                {day.dayNumber === 3 && centenary.mainEventTime && (
                  <p className="mt-4 rounded-xl bg-gold-100 px-3 py-2 text-xs font-semibold text-purple-900">
                    Official invitation time for the main celebration: {centenary.mainEventTime} WAT
                  </p>
                )}
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-charcoal/70">
            Full event details, guests and RSVP are on the{" "}
            <Link href="/centenary#programme" className="font-semibold text-purple-700 underline">
              Centenary 2026 page
            </Link>
            .
          </p>
        </section>

        <section id="replays" aria-labelledby="replays-heading" className="scroll-mt-24">
          <h2 id="replays-heading" className="font-serif text-2xl font-bold text-purple-700 sm:text-3xl">
            Replays
          </h2>
          <p className="mt-2 text-sm text-charcoal/75">Missed a session? Recordings are added here after each broadcast.</p>
          <div className="mt-6">
            <LiveReplays initial={initial} dayLabels={dayLabels} />
          </div>
        </section>

        <section aria-labelledby="studio-heading" className="flex flex-col items-start gap-4 rounded-2xl bg-purple-700 p-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="studio-heading" className="font-serif text-xl font-bold">
              Celebrate with your own centenary poster
            </h2>
            <p className="mt-1 text-sm text-white/85">
              Create a personalised commemorative poster in the Celebration Studio and share it while you watch.
            </p>
          </div>
          <Link
            href="/celebration-studio"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-bold text-purple-900 hover:bg-gold-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-300"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Open the Celebration Studio
          </Link>
        </section>
      </Container>
    </div>
  );
}
