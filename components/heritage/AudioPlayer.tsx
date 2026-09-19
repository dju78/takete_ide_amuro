"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  src: string;
  label?: string;
  speaker?: string | null;
  durationLabel?: string | null;
  className?: string;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export function AudioPlayer({
  src,
  label = "Listen to Recording",
  speaker,
  durationLabel,
  className,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = Number(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const restart = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setCurrentTime(0);
    if (!isPlaying) {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-purple-600/15 bg-purple-50/60 p-4 sm:p-5 shadow-2xs",
        className,
      )}
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-serif text-sm font-bold text-purple-950">{label}</p>
          {speaker && <p className="text-xs text-charcoal/65">Speaker: {speaker}</p>}
        </div>
        {(durationLabel || duration > 0) && (
          <span className="rounded-md bg-purple-100/70 px-2 py-0.5 text-2xs font-semibold text-purple-800">
            {durationLabel ?? formatTime(duration)}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3">
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause audio" : "Play audio"}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-700 text-white shadow-xs transition hover:bg-purple-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-700 active:scale-95"
        >
          {isPlaying ? <Pause className="h-5 w-5" aria-hidden="true" /> : <Play className="h-5 w-5 ml-0.5" aria-hidden="true" />}
        </button>

        {/* Restart Button */}
        <button
          type="button"
          onClick={restart}
          aria-label="Restart audio from beginning"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-purple-700 hover:bg-purple-100/60 transition"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
        </button>

        {/* Scrub Slider */}
        <div className="flex flex-1 flex-col gap-1">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            aria-label="Audio position scrubber"
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-purple-200 accent-purple-700"
          />
          <div className="flex justify-between text-2xs tabular-nums text-charcoal/60">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Mute Button */}
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-purple-700 hover:bg-purple-100/60 transition"
        >
          {isMuted ? <VolumeX className="h-4 w-4 text-amber-700" aria-hidden="true" /> : <Volume2 className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}

