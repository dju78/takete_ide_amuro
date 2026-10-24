"use client";

import { useState } from "react";
import { AlertTriangle, CalendarClock, CircleStop, ExternalLink, MessageSquare, Radio, Tv } from "lucide-react";
import { FacebookGlyph, YouTubeGlyph } from "@/components/layout/BrandGlyphs";
import {
  EVENT_TIMEZONE,
  STATUS_LABELS,
  chatAvailable,
  facebookLinkKind,
  youtubeChatEmbedUrl,
  youtubeChatPopoutUrl,
  youtubeEmbedUrl,
  youtubeWatchUrl,
  type BroadcastStatus,
  type PublicBroadcast,
} from "@/lib/live/broadcast";
import { cn } from "@/lib/utils";
import { useBrowserValue, useMediaQuery } from "@/components/live/use-browser";
import { useLiveStatus } from "@/components/live/live-status-store";
const STATUS_STYLES: Record<BroadcastStatus, string> = {
  scheduled: "bg-purple-50 text-purple-700 ring-purple-600/20",
  live: "bg-red-600 text-white ring-red-700",
  interrupted: "bg-amber-100 text-amber-900 ring-amber-500/40",
  ended: "bg-charcoal/10 text-charcoal ring-charcoal/20",
};

const STATUS_ICONS: Record<BroadcastStatus, React.ComponentType<{ className?: string }>> = {
  scheduled: CalendarClock,
  live: Radio,
  interrupted: AlertTriangle,
  ended: CircleStop,
};

/** mainEventLabel: the confirmed main celebration time, e.g. "Saturday, 31 October 2026 at 10:00 AM WAT". */
export function LiveBroadcastHub({ initial, mainEventLabel }: { initial: PublicBroadcast; mainEventLabel?: string }) {
  const latest = useLiveStatus(initial);
  // The player only switches video when the viewer agrees, so a config change
  // never yanks someone out of the stream they are watching.
  const [activeVideoId, setActiveVideoId] = useState(initial.videoId);
  // The first video ID to appear (page loaded before one was configured) is
  // adopted straight away; later changes wait for the viewer. Adjusting state
  // during render is React's recommended pattern for deriving from new props.
  if (!activeVideoId && latest.videoId) setActiveVideoId(latest.videoId);

  const b = { ...latest, videoId: activeVideoId };
  const newVideoPending = Boolean(latest.videoId && activeVideoId && latest.videoId !== activeVideoId);
  const StatusIcon = STATUS_ICONS[b.status];
  // Nothing has been configured yet: no video, no status change by the broadcast team.
  const awaitingSetup = b.status === "scheduled" && !b.videoId && !b.updatedAt;
  const showChat = chatAvailable(b);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <span
          role="status"
          aria-live="polite"
          data-testid="broadcast-status"
          data-status={b.status}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold ring-1 ring-inset",
            STATUS_STYLES[b.status],
          )}
        >
          {b.status === "live" && (
            <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
            </span>
          )}
          <StatusIcon className="h-4 w-4" aria-hidden="true" />
          {awaitingSetup ? "Not yet live" : STATUS_LABELS[b.status]}
        </span>
        {!awaitingSetup && (
          <span className="text-xs text-charcoal/70">
            Status updated manually by the broadcast team
            {b.updatedAt && (
              <>
                {" · last changed "}
                <time dateTime={b.updatedAt} suppressHydrationWarning>
                  {formatLagos(b.updatedAt)}
                </time>{" "}
                WAT
              </>
            )}
          </span>
        )}
      </div>

      {b.statusMessage && (
        <p className="rounded-2xl bg-white p-4 text-sm text-charcoal ring-1 ring-purple-600/10">{b.statusMessage}</p>
      )}

      {newVideoPending && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-gold-500/15 p-4 text-sm ring-1 ring-gold-500/40">
          <span className="font-semibold text-purple-900">The broadcast has moved to a new stream.</span>
          <button
            type="button"
            onClick={() => setActiveVideoId(latest.videoId)}
            className="rounded-full bg-purple-600 px-4 py-2 font-semibold text-white hover:bg-purple-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
          >
            Switch to the new stream
          </button>
        </div>
      )}

      <StatusNotice broadcast={b} mainEventLabel={mainEventLabel} />

      <div className={cn("grid min-w-0 grid-cols-1 gap-6", showChat && "lg:grid-cols-[minmax(0,1fr)_360px]")}>
        <Player broadcast={b} mainEventLabel={mainEventLabel} />
        {showChat && b.videoId && <ChatPanel videoId={b.videoId} />}
      </div>

      {!showChat && b.videoId && b.status !== "ended" && (
        <p className="text-sm text-charcoal/70">
          Live chat opens when the broadcast goes live.{" "}
          <a href={youtubeWatchUrl(b.videoId)} target="_blank" rel="noopener noreferrer" className="font-semibold text-purple-700 underline">
            Open the broadcast on YouTube
          </a>
          .
        </p>
      )}

      <PlatformLinks broadcast={b} />
    </div>
  );
}

function StatusNotice({ broadcast: b, mainEventLabel }: { broadcast: PublicBroadcast; mainEventLabel?: string }) {
  if (b.status === "interrupted") {
    return (
      <div role="alert" className="flex gap-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-950 ring-1 ring-amber-500/40">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <div>
          <p className="font-bold">The broadcast is temporarily interrupted.</p>
          <p className="mt-1">
            We are working to restore the signal from the venue. Please keep this page open — the stream
            will resume here. If the player does not recover within a few minutes, refresh the page.
          </p>
        </div>
      </div>
    );
  }
  if (b.status === "scheduled") {
    return (
      <div className="rounded-2xl bg-white p-4 text-sm text-charcoal ring-1 ring-purple-600/10">
        <p className="font-semibold text-purple-700">The broadcast has not started yet.</p>
        <ScheduledStart iso={b.scheduledStart} mainEventLabel={mainEventLabel} />
      </div>
    );
  }
  if (b.status === "ended") {
    return (
      <div className="rounded-2xl bg-white p-4 text-sm text-charcoal ring-1 ring-purple-600/10">
        <p className="font-semibold text-purple-700">This broadcast has ended. Thank you for watching.</p>
        <p className="mt-1">
          {b.replays.length > 0 ? (
            <>
              Recordings are in the <a href="#replays" className="font-semibold text-purple-700 underline">replays section</a>.
            </>
          ) : (
            "Recordings will be added to this page after each session has been processed."
          )}
        </p>
      </div>
    );
  }
  return null;
}

function ScheduledStart({ iso, mainEventLabel }: { iso: string | null; mainEventLabel?: string }) {
  const viewerZone = useBrowserValue(() => Intl.DateTimeFormat().resolvedOptions().timeZone);
  const local =
    iso && viewerZone && viewerZone !== EVENT_TIMEZONE
      ? `${new Date(iso).toLocaleString("en-GB", {
          weekday: "short",
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: viewerZone,
        })} in your time zone (${viewerZone})`
      : null;

  if (!iso) {
    return (
      <p className="mt-1">
        {mainEventLabel
          ? `The main celebration begins on ${mainEventLabel}. The broadcast start time will be announced here.`
          : "The broadcast start time will be announced here. All event times are West Africa Time (WAT, UTC+1)."}
      </p>
    );
  }
  return (
    <p className="mt-1" data-testid="scheduled-start">
      Scheduled start:{" "}
      <strong>
        <time dateTime={iso} suppressHydrationWarning>
          {formatLagos(iso, true)}
        </time>{" "}
        WAT
      </strong>{" "}
      (Africa/Lagos)
      {local && <span className="block text-charcoal/70">That is {local}.</span>}
    </p>
  );
}

function Player({ broadcast: b, mainEventLabel }: { broadcast: PublicBroadcast; mainEventLabel?: string }) {
  if (!b.videoId) {
    return (
      <div
        data-testid="player-fallback"
        className="flex min-h-[240px] w-full min-w-0 flex-col items-center justify-center gap-3 rounded-2xl bg-purple-900 p-6 text-center text-white sm:aspect-video sm:min-h-0"
      >
        <Tv className="h-10 w-10 text-gold-300" aria-hidden="true" />
        <p className="max-w-md font-serif text-xl font-bold sm:text-2xl">
          {b.status === "ended" ? "The live broadcast has ended" : "Watch the Centenary Celebration live"}
        </p>
        {b.status !== "ended" && mainEventLabel && (
          <p className="text-sm font-semibold text-gold-300">{mainEventLabel}</p>
        )}
        <p className="max-w-md text-sm text-white/80">
          {b.status === "ended"
            ? "Recordings will be added to this page as they are published."
            : "The broadcast link has not been published yet. The player will appear on this page once it is. Subscribe to the official Takete-Ide YouTube channel to be notified when it goes live."}
        </p>
        <a
          href={b.links.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-bold text-purple-950 hover:bg-gold-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-300"
        >
          <YouTubeGlyph className="h-4 w-4" />
          Official YouTube channel
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
    );
  }

  return (
    <div className="min-w-0 overflow-hidden rounded-2xl bg-black shadow-lg ring-1 ring-purple-900/20">
      <div className="relative aspect-video w-full">
        <iframe
          key={b.videoId}
          data-testid="live-player"
          // Starting the broadcast pauses the celebration audio (see CelebrationAudio).
          data-pauses-celebration-audio=""
          src={youtubeEmbedUrl(b.videoId)}
          title={`${b.title} — YouTube video player`}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  );
}

function ChatPanel({ videoId }: { videoId: string }) {
  // null until hydrated. embed_domain must be the real hostname of this page,
  // which differs between production and Netlify deploy previews.
  const host = useBrowserValue(() => window.location.hostname);
  // YouTube does not support embedded live chat on mobile web.
  const canEmbed = useMediaQuery("(min-width: 1024px) and (hover: hover) and (pointer: fine)") === true;

  return (
    <section aria-labelledby="live-chat-heading" className="flex flex-col gap-3 rounded-2xl bg-white p-4 ring-1 ring-purple-600/10">
      <h2 id="live-chat-heading" className="flex items-center gap-2 font-serif text-lg font-bold text-purple-700">
        <MessageSquare className="h-5 w-5" aria-hidden="true" />
        YouTube live chat
      </h2>
      {host && canEmbed && (
        <iframe
          data-testid="live-chat"
          src={youtubeChatEmbedUrl(videoId, host)}
          title="YouTube live chat"
          className="h-[480px] w-full rounded-xl border border-purple-600/10"
        />
      )}
      {host && !canEmbed && (
        <p className="text-sm text-charcoal/80" data-testid="chat-mobile-note">
          YouTube does not allow its live chat to be embedded on phones and tablets. Open the chat on YouTube instead.
        </p>
      )}
      <a
        href={canEmbed ? youtubeChatPopoutUrl(videoId) : youtubeWatchUrl(videoId)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-full bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
      >
        Open chat on YouTube
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
      <p className="text-xs leading-relaxed text-charcoal/70">
        Reading the chat needs no account. To post a message you must be signed in to a YouTube (Google) account.
        Some browsers block sign-in inside embedded chat; if you cannot post here, use “Open chat on YouTube”.
        Messages are moderated by the broadcast team using YouTube’s moderation tools. Comments posted on Facebook are
        separate and do not appear in this chat.
      </p>
    </section>
  );
}

function PlatformLinks({ broadcast: b }: { broadcast: PublicBroadcast }) {
  const youtubeHref = b.videoId ? youtubeWatchUrl(b.videoId) : b.links.youtube;
  const facebookIsVideo = b.links.facebook ? facebookLinkKind(b.links.facebook) === "video" : false;
  const others = [
    { label: "Takete-Ide on Instagram", href: b.links.instagram },
    { label: "Takete-Ide on TikTok", href: b.links.tiktok },
  ].filter((o): o is { label: string; href: string } => Boolean(o.href));

  return (
    <section aria-labelledby="watch-elsewhere-heading" className="rounded-2xl bg-white p-5 ring-1 ring-purple-600/10">
      <h2 id="watch-elsewhere-heading" className="font-serif text-lg font-bold text-purple-700">
        Official Takete-Ide channels
      </h2>
      <p className="mt-1 text-sm text-charcoal/70">
        The player above is the YouTube broadcast. Each platform has its own comments; they are not combined.
      </p>
      <ul className="mt-4 flex flex-wrap gap-3">
        <li>
          <a
            href={youtubeHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#ff0000] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#cc0000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
          >
            <YouTubeGlyph className="h-4 w-4" />
            Watch on YouTube
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </li>
        {b.links.facebook && (
          <li>
            <a
              href={b.links.facebook}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="facebook-link"
              className="inline-flex items-center gap-2 rounded-full bg-[#1877f2] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0f5fc7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              <FacebookGlyph className="h-4 w-4" />
              {facebookIsVideo ? "Watch on Facebook" : "Takete-Ide on Facebook"}
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        )}
        {others.map((o) => (
          <li key={o.label}>
            <a
              href={o.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-charcoal/5 px-5 py-2.5 text-sm font-semibold text-charcoal ring-1 ring-inset ring-charcoal/15 hover:bg-charcoal/10"
            >
              {o.label}
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
      {b.links.facebook && !facebookIsVideo && (
        <p className="mt-3 text-xs leading-relaxed text-charcoal/70" data-testid="facebook-note">
          Opens the official Takete-Ide Facebook page. Look there during the celebration for any Facebook broadcast or
          updates; this website shows the YouTube broadcast.
        </p>
      )}
    </section>
  );
}

function formatLagos(iso: string, withDay = false) {
  return new Date(iso).toLocaleString("en-GB", {
    ...(withDay ? { weekday: "long", day: "numeric", month: "long", year: "numeric" } : { day: "numeric", month: "short" }),
    hour: "2-digit",
    minute: "2-digit",
    timeZone: EVENT_TIMEZONE,
  });
}
