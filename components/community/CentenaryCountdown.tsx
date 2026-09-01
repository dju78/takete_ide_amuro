"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import {
  type CountdownState,
  calculateTimeRemaining,
  getLagosTimestamp,
  getNextCentenaryProgramme,
  getProgrammeCountdown,
} from "@/lib/utils/centenary-countdown";
import { CENTENARY_PROGRAMME, type CentenaryProgrammeItem } from "@/lib/media/community-programme";
import { Sparkles, Radio, Calendar, Clock } from "lucide-react";

/**
 * Subscribes to the wall clock with a single shared timer tick.
 * Server snapshot returns null for hydration safety.
 */
export function useClockSeconds(): number | null {
  return useSyncExternalStore(
    (onChange) => {
      const id = setInterval(onChange, 1000);
      return () => clearInterval(id);
    },
    () => Math.floor(Date.now() / 1000),
    () => null,
  );
}

/**
 * Intelligent Hero Countdown to the Centenary.
 *
 * Automatically tracks the next upcoming Centenary programme or currently active event in Africa/Lagos time,
 * displaying DAYS · HOURS · MINUTES · SECONDS, transition to HAPPENING NOW, and eventual completion.
 */
export function CentenaryCountdown({
  eventDate,
  programmes = CENTENARY_PROGRAMME,
  tone = "light",
  showProgrammeInfo = true,
  className,
}: {
  /** Optional fallback ISO date, e.g. "2026-10-31". */
  eventDate?: string;
  /** Full list of Centenary programme items. Defaults to CENTENARY_PROGRAMME. */
  programmes?: CentenaryProgrammeItem[];
  /** "light" for purple hero, "dark" for ivory background. */
  tone?: "light" | "dark";
  /** Whether to show the "COUNTDOWN TO NEXT CENTENARY PROGRAMME" and programme title above the boxes. */
  showProgrammeInfo?: boolean;
  className?: string;
}) {
  const seconds = useClockSeconds();
  const mounted = seconds !== null;
  const nowMs = mounted ? seconds * 1000 : getLagosTimestamp("2026-09-01");

  // Determine active/next programme
  const { programme, countdown, isAllCompleted } = getNextCentenaryProgramme(programmes, nowMs);

  // Fallback if no specific programme resolved: opening of Centenary period (29 October 2026)
  const fallbackTarget = getLagosTimestamp(eventDate ?? "2026-10-29", "10:00");
  const fallbackRemaining = calculateTimeRemaining(fallbackTarget - nowMs);

  const activeState: CountdownState = countdown?.state ?? (nowMs >= fallbackTarget ? "happening_now" : "upcoming");
  const timeRemaining = countdown?.timeRemaining ?? (activeState === "completed" ? null : fallbackRemaining);

  const units: { label: string; value: number }[] = [
    { label: "Days", value: timeRemaining?.days ?? 0 },
    { label: "Hours", value: timeRemaining?.hours ?? 0 },
    { label: "Minutes", value: timeRemaining?.minutes ?? 0 },
    { label: "Seconds", value: timeRemaining?.seconds ?? 0 },
  ];

  if (isAllCompleted || activeState === "completed") {
    return (
      <div
        className={cn(
          "rounded-2xl p-6 text-center sm:p-8",
          tone === "light"
            ? "bg-white/10 ring-1 ring-inset ring-white/15"
            : "border border-purple-600/10 bg-white shadow-sm",
          className,
        )}
      >
        <p className="inline-flex items-center gap-2 font-serif text-xl font-bold sm:text-2xl text-gold-300">
          <Sparkles className="h-5 w-5 text-gold-300" aria-hidden="true" />
          TAKETE-IDE CENTENARY 2026 — CELEBRATION COMPLETED
        </p>
        <p className={cn("mt-2 text-sm", tone === "light" ? "text-white/80" : "text-charcoal/70")}>
          A century of heritage, faith, unity and progress celebrated with honour and gratitude.
        </p>
      </div>
    );
  }

  const programmeTitle = programme?.title ?? "Takete-Ide Day & Centenary Celebration 2026";
  const programmeDateLabel = programme?.dateLabel ?? "29–31 October 2026";
  const programmeTimeLabel = programme?.timeLabel ?? "10:00 AM Prompt (Invitation time)";

  const accessibleText = mounted && timeRemaining
    ? `${timeRemaining.days} days, ${timeRemaining.hours} hours, ${timeRemaining.minutes} minutes and ${timeRemaining.seconds} seconds until ${programmeTitle}.`
    : `Counting down to ${programmeTitle}.`;

  return (
    <div className={className}>
      {showProgrammeInfo && (
        <div className="mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider",
                activeState === "happening_now"
                  ? "bg-gold-400 text-purple-950 animate-pulse"
                  : tone === "light"
                  ? "bg-gold-500/20 text-gold-300"
                  : "bg-purple-100 text-purple-700",
              )}
            >
              {activeState === "happening_now" ? (
                <>
                  <Radio className="h-3.5 w-3.5 text-purple-950" aria-hidden="true" />
                  HAPPENING NOW
                </>
              ) : programme ? (
                "COUNTDOWN TO NEXT CENTENARY PROGRAMME"
              ) : (
                "COUNTDOWN TO CENTENARY CELEBRATION"
              )}
            </span>
          </div>

          <h3
            className={cn(
              "mt-2 font-serif text-lg font-bold sm:text-xl",
              tone === "light" ? "text-white" : "text-purple-950",
            )}
          >
            {programmeTitle}
          </h3>

          <div
            className={cn(
              "mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm",
              tone === "light" ? "text-white/80" : "text-charcoal/75",
            )}
          >
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-gold-300" aria-hidden="true" />
              {programmeDateLabel}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-gold-300" aria-hidden="true" />
              {programmeTimeLabel}
            </span>
          </div>
        </div>
      )}

      {/* Polite screen reader text */}
      <p className="sr-only" aria-live="polite">
        {accessibleText}
      </p>

      {/* 4 Counter Boxes */}
      <ul aria-hidden="true" className="flex flex-wrap gap-2 sm:gap-3">
        {units.map((unit) => (
          <li
            key={unit.label}
            className={cn(
              "min-w-[4.5rem] flex-1 rounded-2xl px-3 py-3 text-center sm:min-w-[5.5rem] sm:px-4",
              tone === "light"
                ? "bg-white/10 ring-1 ring-inset ring-white/15"
                : "bg-purple-50 ring-1 ring-inset ring-purple-600/10",
            )}
          >
            <span
              className={cn(
                "block font-serif text-2xl font-bold tabular-nums sm:text-3xl",
                tone === "light" ? "text-gold-300" : "text-purple-600",
              )}
            >
              {mounted ? String(unit.value).padStart(2, "0") : "––"}
            </span>
            <span
              className={cn(
                "mt-0.5 block text-[0.65rem] font-semibold uppercase tracking-wider sm:text-xs",
                tone === "light" ? "text-white/70" : "text-charcoal/55",
              )}
            >
              {unit.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

