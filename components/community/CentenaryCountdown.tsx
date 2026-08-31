"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

interface Parts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/** Never returns negative parts — after the date the caller shows the "today/past" state instead. */
function remaining(target: number): Parts | null {
  const diff = target - Date.now();
  if (diff <= 0) return null;
  const seconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  };
}

/**
 * Subscribes to the wall clock.
 *
 * `useSyncExternalStore` rather than an effect + interval: the current time is
 * external state, the server snapshot is deliberately `null` so the markup React
 * renders on the server matches the first client render, and there is no
 * setState-inside-an-effect cascade.
 */
function useClockSeconds(): number | null {
  return useSyncExternalStore(
    (onChange) => {
      const id = setInterval(onChange, 1000);
      return () => clearInterval(id);
    },
    // Stable within each second, so React does not loop re-reading it.
    () => Math.floor(Date.now() / 1000),
    () => null,
  );
}

/**
 * Countdown to the Centenary.
 *
 * Renders nothing time-sensitive on the server: a server-rendered countdown
 * would be wrong the moment it reached the browser, and would differ between the
 * server and client renders. It starts as a dash and fills in after mount.
 *
 * Once the date passes it stops counting rather than showing negative numbers,
 * and announces the change politely rather than firing an update every second at
 * screen-reader users.
 */
export function CentenaryCountdown({
  eventDate,
  tone = "light",
  className,
}: {
  /** ISO date, e.g. "2026-10-31". */
  eventDate: string;
  /** "light" for text on the purple hero; "dark" for text on ivory. */
  tone?: "light" | "dark";
  className?: string;
}) {
  const target = new Date(`${eventDate}T00:00:00`).getTime();
  const seconds = useClockSeconds();
  const mounted = seconds !== null;
  const parts = mounted ? remaining(target) : null;
  const past = mounted && parts === null;
  const units: { label: string; value: number }[] = [
    { label: "Days", value: parts?.days ?? 0 },
    { label: "Hours", value: parts?.hours ?? 0 },
    { label: "Minutes", value: parts?.minutes ?? 0 },
    { label: "Seconds", value: parts?.seconds ?? 0 },
  ];

  if (past) {
    return (
      <p
        className={cn(
          "font-serif text-xl font-bold",
          tone === "light" ? "text-gold-300" : "text-purple-600",
          className,
        )}
      >
        The Centenary Celebration has arrived.
      </p>
    );
  }

  return (
    <div className={className}>
      {/* One polite summary for assistive tech instead of four counters ticking. */}
      <p className="sr-only" aria-live="polite">
        {mounted && parts
          ? `${parts.days} days until the Centenary Celebration.`
          : "Counting down to the Centenary Celebration."}
      </p>
      <ul aria-hidden="true" className="flex flex-wrap gap-2 sm:gap-3">
        {units.map((unit) => (
          <li
            key={unit.label}
            className={cn(
              "min-w-[4rem] flex-1 rounded-2xl px-3 py-3 text-center sm:min-w-[5rem] sm:px-4",
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
