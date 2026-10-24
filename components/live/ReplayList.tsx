"use client";

import { useState } from "react";
import { ExternalLink, PlayCircle } from "lucide-react";
import { youtubeEmbedUrl, youtubeWatchUrl, type LiveReplay, type PublicBroadcast } from "@/lib/live/broadcast";
import { useLiveStatus } from "@/components/live/live-status-store";

/**
 * Replays load as a thumbnail first and only become a YouTube iframe when
 * clicked, so a page with many recordings stays light on mobile data.
 */
/** Replays kept current by the shared status poller, so new recordings appear on open pages. */
/** The whole replays section, shown only once at least one recording has been published. */
export function LiveReplays({ initial, dayLabels }: { initial: PublicBroadcast; dayLabels: Record<number, string> }) {
  const { replays } = useLiveStatus(initial);
  if (replays.length === 0) return null;
  return (
    <section id="replays" aria-labelledby="replays-heading" className="scroll-mt-24">
      <h2 id="replays-heading" className="font-serif text-2xl font-bold text-purple-700 sm:text-3xl">
        Replays
      </h2>
      <p className="mt-2 text-sm text-charcoal/75">Missed a session? Watch the published recordings.</p>
      <div className="mt-6">
        <ReplayList replays={replays} dayLabels={dayLabels} />
      </div>
    </section>
  );
}

export function ReplayList({ replays, dayLabels }: { replays: LiveReplay[]; dayLabels: Record<number, string> }) {
  if (replays.length === 0) {
    return (
      <p data-testid="replays-empty" className="rounded-2xl bg-white p-5 text-sm text-charcoal/80 ring-1 ring-purple-600/10">
        No recordings have been published yet. Each session’s recording will be listed here after it has been
        broadcast and processed — usually within a few hours.
      </p>
    );
  }

  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-testid="replay-list">
      {replays.map((r) => (
        <li key={r.id} className="flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-purple-600/10">
          {r.videoId ? <ReplayPlayer videoId={r.videoId} title={r.title} /> : null}
          <div className="flex flex-1 flex-col gap-2 p-4">
            {r.dayNumber && (
              <span className="text-xs font-bold uppercase tracking-wider text-gold-700">{dayLabels[r.dayNumber] ?? `Day ${r.dayNumber}`}</span>
            )}
            <h3 className="font-serif text-base font-bold text-purple-900">{r.title}</h3>
            <a
              href={r.videoId ? youtubeWatchUrl(r.videoId) : (r.url ?? "#")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-purple-700 underline"
            >
              {r.videoId || r.url?.includes("youtu") ? "Watch on YouTube" : "Watch on Facebook"}
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
}

function ReplayPlayer({ videoId, title }: { videoId: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  if (playing) {
    return (
      <div className="relative aspect-video w-full bg-black">
        <iframe
          src={`${youtubeEmbedUrl(videoId)}&autoplay=1`}
          title={`${title} — YouTube video player`}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative aspect-video w-full bg-purple-900 focus-visible:outline focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-gold-300"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-80 transition group-hover:opacity-100"
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <PlayCircle className="h-14 w-14 text-white drop-shadow-lg" aria-hidden="true" />
      </span>
      <span className="sr-only">Play recording: {title}</span>
    </button>
  );
}
