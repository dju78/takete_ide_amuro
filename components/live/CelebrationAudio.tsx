"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AlertTriangle, Download, Loader2, Pause, Play, Repeat, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Pre-event celebration audio for /live.
 *
 * A plain same-origin <audio> element served from /public — it does not depend
 * on OBS, YouTube or the broadcast status, and keeps working whatever state the
 * broadcast is in. Nothing plays until the visitor presses Play (no autoplay).
 */

export const CELEBRATION_AUDIO_SRC = "/audio/centenary/takete-ide-centenary-celebration.mp3";
export const CELEBRATION_VIDEO_SRC = "/videos/takete-ide/Takete_Ide_Centenary_Celebration_Audio.mp4";
const POSTER = {
  src: "/images/takete-ide/centenary-live-broadcast-poster.webp",
  width: 1672,
  height: 941,
  alt: "Takete-Ide Centenary Celebration poster: Day 1, 29 October 2026 — Faith, Unity, Progress — takete-ide.org/live",
};

/**
 * Embedded players that should silence this audio when the visitor starts
 * them. Mark an iframe with this attribute to opt in.
 */
export const PAUSES_CELEBRATION_AUDIO = "data-pauses-celebration-audio";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export function CelebrationAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [repeat, setRepeat] = useState(false);

  // UI state follows the element's own events, so it stays truthful when the
  // browser (or the YouTube guard below) pauses playback.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const on: Record<string, () => void> = {
      play: () => setPlaying(true),
      playing: () => {
        setPlaying(true);
        setLoading(false);
      },
      pause: () => setPlaying(false),
      waiting: () => setLoading(true),
      canplay: () => setLoading(false),
      ended: () => setPlaying(false),
      timeupdate: () => setCurrentTime(audio.currentTime),
      loadedmetadata: () => setDuration(audio.duration),
      durationchange: () => setDuration(audio.duration),
      error: () => {
        setFailed(true);
        setLoading(false);
        setPlaying(false);
      },
    };
    for (const [name, fn] of Object.entries(on)) audio.addEventListener(name, fn);
    // Metadata (or an error) may have arrived before hydration attached the listeners.
    if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) on.loadedmetadata();
    if (audio.error) on.error();
    return () => {
      for (const [name, fn] of Object.entries(on)) audio.removeEventListener(name, fn);
    };
  }, []);

  // Prevent overlapping sound: when focus moves into the embedded YouTube
  // player (a click or tap on it, or keyboard Tab into it), pause this audio.
  // The player is cross-origin, so its own play event cannot be observed
  // without changing the embed; focus entering it is the reliable signal.
  useEffect(() => {
    const pauseIfPlayerFocused = () => {
      // activeElement is updated just after the window blur event fires.
      window.setTimeout(() => {
        const active = document.activeElement;
        if (active instanceof HTMLIFrameElement && active.hasAttribute(PAUSES_CELEBRATION_AUDIO)) {
          audioRef.current?.pause();
        }
      }, 0);
    };
    window.addEventListener("blur", pauseIfPlayerFocused);
    document.addEventListener("focusin", pauseIfPlayerFocused);
    return () => {
      window.removeEventListener("blur", pauseIfPlayerFocused);
      document.removeEventListener("focusin", pauseIfPlayerFocused);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      return;
    }
    if (failed) {
      // Retry after a network failure.
      setFailed(false);
      audio.load();
    }
    setLoading(audio.readyState < HTMLMediaElement.HAVE_FUTURE_DATA);
    audio.play().catch((err: unknown) => {
      setLoading(false);
      // AbortError just means a pause interrupted the start; not a failure.
      if (!(err instanceof DOMException && err.name === "AbortError")) setFailed(true);
    });
  };

  const seek = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value;
    setCurrentTime(value);
  };

  const changeVolume = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = value;
    audio.muted = value === 0;
    setVolume(value);
    setMuted(value === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = !muted;
    audio.muted = next;
    if (!next && audio.volume === 0) {
      audio.volume = 1;
      setVolume(1);
    }
    setMuted(next);
  };

  const toggleRepeat = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = !repeat;
    setRepeat(!repeat);
  };

  const iconButton =
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-purple-700 ring-1 ring-inset ring-purple-600/20 transition hover:bg-purple-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600";

  return (
    <div className="grid items-center gap-6 rounded-2xl bg-white p-4 ring-1 ring-purple-600/10 sm:p-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <Image
        src={POSTER.src}
        width={POSTER.width}
        height={POSTER.height}
        alt={POSTER.alt}
        sizes="(min-width: 1024px) 60vw, 100vw"
        className="h-auto w-full rounded-xl shadow-md"
        data-testid="celebration-poster"
      />

      <div className="flex min-w-0 flex-col gap-4" data-testid="celebration-audio">
        <div>
          <h2 id="celebration-audio-heading" className="font-serif text-2xl font-bold text-purple-700">
            Celebration audio — listen before the event.
          </h2>
          <p className="mt-1 text-sm text-charcoal/75">
            A recorded celebration track to enjoy ahead of the centenary. It plays only when you press Play and is
            separate from the YouTube broadcast.
          </p>
        </div>

        {/* No `autoplay`: playback starts only from the visitor's click. */}
        <audio ref={audioRef} src={CELEBRATION_AUDIO_SRC} preload="metadata" data-testid="celebration-audio-element" />

        <button
          type="button"
          onClick={togglePlay}
          data-testid="celebration-audio-play"
          className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-gold-500 px-6 py-3 text-base font-bold text-purple-950 shadow-sm transition hover:bg-gold-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
          ) : playing ? (
            <Pause className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Play className="h-5 w-5" aria-hidden="true" />
          )}
          {playing ? "Pause celebration audio" : "Play celebration audio"}
        </button>

        <div className="flex flex-col gap-1">
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={1}
            value={Math.min(currentTime, duration || 0)}
            onChange={(e) => seek(Number(e.target.value))}
            disabled={!duration}
            aria-label="Celebration audio progress"
            aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
            data-testid="celebration-audio-progress"
            className="h-2 w-full cursor-pointer accent-purple-700 disabled:cursor-default"
          />
          <div className="flex justify-between text-xs tabular-nums text-charcoal/70" aria-hidden="true">
            <span>{formatTime(currentTime)}</span>
            <span>{duration ? formatTime(duration) : "–:––"}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={toggleMute}
            aria-pressed={muted}
            aria-label="Mute celebration audio"
            className={iconButton}
          >
            {muted ? <VolumeX className="h-5 w-5" aria-hidden="true" /> : <Volume2 className="h-5 w-5" aria-hidden="true" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={muted ? 0 : volume}
            onChange={(e) => changeVolume(Number(e.target.value))}
            aria-label="Celebration audio volume"
            aria-valuetext={`${Math.round((muted ? 0 : volume) * 100)}%`}
            data-testid="celebration-audio-volume"
            className="h-2 w-32 cursor-pointer accent-purple-700"
          />
          <button
            type="button"
            onClick={toggleRepeat}
            aria-pressed={repeat}
            aria-label="Repeat celebration audio"
            data-testid="celebration-audio-repeat"
            className={cn(iconButton, repeat && "bg-purple-700 text-white hover:bg-purple-600")}
          >
            <Repeat className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {failed && (
          <p role="alert" data-testid="celebration-audio-error" className="flex gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-950 ring-1 ring-amber-500/40">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>
              The celebration audio could not be loaded. Check your connection and press Play to try again, or{" "}
              <a href={CELEBRATION_AUDIO_SRC} className="font-semibold underline">
                open the audio file directly
              </a>
              .
            </span>
          </p>
        )}

        <a
          href={CELEBRATION_VIDEO_SRC}
          download
          className="inline-flex items-center gap-2 self-start text-sm font-semibold text-purple-700 underline"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Download the poster video with this audio (MP4, 11 MB)
        </a>
      </div>
    </div>
  );
}
