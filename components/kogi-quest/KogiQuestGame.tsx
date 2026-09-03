"use client";

import { useState, useRef } from "react";
import { Play, Maximize2, ExternalLink, RotateCcw, AlertCircle, Sparkles, Shield, Trophy } from "lucide-react";

export const KOGI_QUEST_GAME_URL = "https://dju78.github.io/kogiqest/";

export function KogiQuestGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleStartGame = () => {
    setIsPlaying(true);
    setIsLoading(true);
    setLoadError(false);
  };

  const handleFullScreen = () => {
    if (!isPlaying) {
      setIsPlaying(true);
    }
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      } else {
        containerRef.current.requestFullscreen().catch(() => {
          window.open(KOGI_QUEST_GAME_URL, "_blank", "noopener,noreferrer");
        });
      }
    }
  };

  const scrollToShare = () => {
    const shareSection = document.getElementById("challenge-friends");
    if (shareSection) {
      shareSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-3xl border border-purple-600/15 bg-white shadow-xl transition-all"
    >
      {!isPlaying ? (
        <div className="relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-950 px-6 py-16 text-center text-white sm:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.15),transparent_50%)]" />
          
          <div className="relative z-10 mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-gold-300 ring-1 ring-inset ring-gold-400/30">
              <Sparkles className="h-3.5 w-3.5 text-gold-300" aria-hidden="true" />
              Interactive Confluence Challenge
            </span>

            <h2 className="mt-4 font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Kogi Quest
            </h2>
            <p className="mt-2 text-lg font-medium text-gold-300">
              How Well Do You Know the Confluence State?
            </p>

            <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base">
              Do you have what it takes to become a Legend of the Confluence? Test your knowledge across history, culture, geography, and leaders.
            </p>

            <div className="mt-6 rounded-2xl bg-white/10 p-4 text-xs text-white/90 ring-1 ring-inset ring-white/15 sm:text-sm">
              <p className="font-medium">
                Sign in or create a free player account to begin the quest and record your score on the leaderboard.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <button
                type="button"
                onClick={handleStartGame}
                className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gold-500 px-6 py-3.5 text-base font-bold text-purple-950 shadow-lg transition hover:bg-gold-400 focus:outline-none focus:ring-4 focus:ring-gold-400/50"
              >
                <Play className="h-5 w-5 fill-current" aria-hidden="true" />
                Start the Quest
              </button>

              <button
                type="button"
                onClick={handleFullScreen}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                <Maximize2 className="h-4 w-4" aria-hidden="true" />
                Play Full Screen
              </button>

              <button
                type="button"
                onClick={scrollToShare}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-transparent px-5 py-3.5 text-sm font-semibold text-white/90 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                <Trophy className="h-4 w-4 text-gold-300" aria-hidden="true" />
                Challenge Your Friends
              </button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-1.5 text-xs text-white/60">
              <Shield className="h-3.5 w-3.5 text-gold-400/70" aria-hidden="true" />
              <span>Powered by Omoyele EduVerse.</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col bg-charcoal">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-purple-950 px-4 py-3 text-xs text-white">
            <div className="flex items-center gap-2 font-medium">
              <span className="inline-block h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span className="font-semibold text-gold-300">Kogi Quest Live Session</span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleFullScreen}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20"
                aria-label="Toggle Fullscreen"
              >
                <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
                Full Screen
              </button>

              <a
                href={KOGI_QUEST_GAME_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20"
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                Open Direct Game Link
              </a>

              <button
                type="button"
                onClick={() => {
                  setIsLoading(true);
                  setLoadError(false);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs text-white transition hover:bg-white/20"
                title="Reload game frame"
                aria-label="Reload game frame"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="relative min-h-[600px] h-[75vh] max-h-[900px] w-full bg-charcoal">
            {isLoading && !loadError && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-purple-950/90 text-white">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold-400 border-t-transparent" />
                <p className="mt-4 font-serif text-base font-medium">Loading Kogi Quest...</p>
                <p className="mt-1 text-xs text-white/60">Preparing Confluence challenges & leaderboard</p>
              </div>
            )}

            {loadError && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-purple-950 px-6 text-center text-white">
                <AlertCircle className="h-10 w-10 text-gold-400" aria-hidden="true" />
                <h3 className="mt-3 font-serif text-lg font-bold">Unable to load embedded game</h3>
                <p className="mt-2 max-w-md text-sm text-white/80">
                  Your browser security settings or network connection may have prevented the embedded player from loading.
                </p>
                <a
                  href={KOGI_QUEST_GAME_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gold-500 px-5 py-2.5 text-sm font-bold text-purple-950 shadow transition hover:bg-gold-400"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  Play Directly on GitHub Pages
                </a>
              </div>
            )}

            <iframe
              src={KOGI_QUEST_GAME_URL}
              title="Kogi Quest — Confluence State Interactive Challenge"
              className="h-full w-full border-0 bg-white"
              allow="fullscreen; clipboard-write; autoplay; scripts; forms; same-origin"
              allowFullScreen
              loading="lazy"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setLoadError(true);
              }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-purple-950/80 px-4 py-2.5 text-[11px] text-white/60">
            <span>Powered by Omoyele EduVerse.</span>
            <span>If the game does not display properly, click &quot;Open Direct Game Link&quot; above.</span>
          </div>
        </div>
      )}
    </div>
  );
}
