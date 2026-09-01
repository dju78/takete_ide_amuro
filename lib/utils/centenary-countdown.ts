import type { CentenaryProgrammeItem } from "@/lib/media/community-programme";

export type CountdownState =
  | "upcoming"
  | "starting_today"
  | "happening_now"
  | "completed"
  | "unconfirmed_time";

export interface CountdownTimeRemaining {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface ProgrammeCountdownResult {
  state: CountdownState;
  targetMs: number | null;
  endMs: number | null;
  timeRemaining: CountdownTimeRemaining | null;
  formattedRemaining: string;
  accessibleLabel: string;
  isToday: boolean;
}

/**
 * Returns the exact UTC millisecond timestamp for an event in Africa/Lagos (UTC+1).
 * If time is not provided, defaults to start of day in Lagos (00:00:00+01:00).
 */
export function getLagosTimestamp(dateStr: string, timeStr?: string): number {
  const time = timeStr && timeStr.trim().length > 0 ? timeStr.trim() : "00:00";
  const normalizedTime = time.length === 5 ? `${time}:00` : time;
  const isoString = `${dateStr}T${normalizedTime}+01:00`;
  return new Date(isoString).getTime();
}

/**
 * Returns whether current timestamp is on the same calendar day in Africa/Lagos as the event.
 */
export function isSameDayInLagos(nowMs: number, eventDateStr: string): boolean {
  const lagosOffsetMs = 60 * 60 * 1000;
  const nowInLagos = new Date(nowMs + lagosOffsetMs);
  const eventInLagos = new Date(getLagosTimestamp(eventDateStr) + lagosOffsetMs);

  return (
    nowInLagos.getUTCFullYear() === eventInLagos.getUTCFullYear() &&
    nowInLagos.getUTCMonth() === eventInLagos.getUTCMonth() &&
    nowInLagos.getUTCDate() === eventInLagos.getUTCDate()
  );
}

/**
 * Calculates remaining time components between target and current time.
 */
export function calculateTimeRemaining(diffMs: number): CountdownTimeRemaining {
  if (diffMs <= 0) {
    return { totalMs: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { totalMs: diffMs, days, hours, minutes, seconds };
}

/**
 * Calculates countdown status and remaining duration for a single programme item.
 */
export function getProgrammeCountdown(
  item: CentenaryProgrammeItem,
  nowMs: number,
): ProgrammeCountdownResult {
  const isToday = isSameDayInLagos(nowMs, item.date);

  // If item is explicitly marked completed via status / isCompleted
  if (item.status === "completed" || item.isCompleted) {
    return {
      state: "completed",
      targetMs: item.startTime ? getLagosTimestamp(item.date, item.startTime) : null,
      endMs: item.endTime ? getLagosTimestamp(item.date, item.endTime) : null,
      timeRemaining: null,
      formattedRemaining: "Completed",
      accessibleLabel: `${item.title} has completed.`,
      isToday,
    };
  }

  // If start time is not confirmed
  if (!item.startTime) {
    return {
      state: "unconfirmed_time",
      targetMs: null,
      endMs: null,
      timeRemaining: null,
      formattedRemaining: "Schedule details to be confirmed",
      accessibleLabel: `${item.title} on ${item.dateLabel}, schedule details to be confirmed.`,
      isToday,
    };
  }

  const startMs = getLagosTimestamp(item.date, item.startTime);
  const endMs = item.endTime ? getLagosTimestamp(item.date, item.endTime) : null;

  // 1. If endTime is confirmed and has passed -> Completed
  if (endMs !== null && nowMs >= endMs) {
    return {
      state: "completed",
      targetMs: startMs,
      endMs,
      timeRemaining: null,
      formattedRemaining: "Completed",
      accessibleLabel: `${item.title} has completed.`,
      isToday,
    };
  }

  // 2. Currently active event (once event starts)
  // - If endTime is confirmed: shows "Ends in Xh Xm"
  // - If endTime is NOT confirmed: shows "Happening Now" indefinitely until completed by status / admin
  if (nowMs >= startMs) {
    if (endMs !== null) {
      const remainingToEnd = endMs - nowMs;
      const endRemaining = calculateTimeRemaining(remainingToEnd);
      const endLabel = `Ends in ${String(endRemaining.hours).padStart(2, "0")}h ${String(endRemaining.minutes).padStart(2, "0")}m`;

      return {
        state: "happening_now",
        targetMs: startMs,
        endMs,
        timeRemaining: endRemaining,
        formattedRemaining: endLabel,
        accessibleLabel: `${item.title} is happening now in Takete-Ide.`,
        isToday: true,
      };
    }

    return {
      state: "happening_now",
      targetMs: startMs,
      endMs: null,
      timeRemaining: null,
      formattedRemaining: "Happening Now",
      accessibleLabel: `${item.title} is happening now in Takete-Ide.`,
      isToday: true,
    };
  }

  // 3. Upcoming event (diff to start)
  const diffMs = startMs - nowMs;
  const remaining = calculateTimeRemaining(diffMs);

  if (isToday) {
    const formatted = `Today · Starts in ${String(remaining.hours).padStart(2, "0")}h ${String(remaining.minutes).padStart(2, "0")}m`;
    return {
      state: "starting_today",
      targetMs: startMs,
      endMs,
      timeRemaining: remaining,
      formattedRemaining: formatted,
      accessibleLabel: `${item.title} starts today in ${remaining.hours} hours and ${remaining.minutes} minutes.`,
      isToday: true,
    };
  }

  const parts = [
    remaining.days > 0 ? `${remaining.days}d` : "",
    `${String(remaining.hours).padStart(2, "0")}h`,
    `${String(remaining.minutes).padStart(2, "0")}m`,
    `${String(remaining.seconds).padStart(2, "0")}s`,
  ]
    .filter(Boolean)
    .join(" ");

  const formatted = `Starts in ${parts}`;
  const accessible = `${remaining.days} days, ${remaining.hours} hours, ${remaining.minutes} minutes and ${remaining.seconds} seconds until ${item.title}.`;

  return {
    state: "upcoming",
    targetMs: startMs,
    endMs,
    timeRemaining: remaining,
    formattedRemaining: formatted,
    accessibleLabel: accessible,
    isToday: false,
  };
}

/**
 * Finds the next relevant Centenary programme to feature in the main hero countdown.
 */
export function getNextCentenaryProgramme(
  programmes: CentenaryProgrammeItem[],
  nowMs: number,
): {
  programme: CentenaryProgrammeItem | null;
  countdown: ProgrammeCountdownResult | null;
  isAllCompleted: boolean;
} {
  const timedProgrammes = programmes
    .filter((p) => Boolean(p.startTime))
    .map((p) => ({
      programme: p,
      countdown: getProgrammeCountdown(p, nowMs),
    }));

  if (timedProgrammes.length === 0) {
    return { programme: null, countdown: null, isAllCompleted: false };
  }

  const live = timedProgrammes.find((t) => t.countdown.state === "happening_now");
  if (live) {
    return { programme: live.programme, countdown: live.countdown, isAllCompleted: false };
  }

  const upcoming = timedProgrammes
    .filter((t) => t.countdown.state === "upcoming" || t.countdown.state === "starting_today")
    .sort((a, b) => (a.countdown.targetMs ?? 0) - (b.countdown.targetMs ?? 0));

  if (upcoming.length > 0) {
    return {
      programme: upcoming[0].programme,
      countdown: upcoming[0].countdown,
      isAllCompleted: false,
    };
  }

  const allDone = timedProgrammes.every((t) => t.countdown.state === "completed");
  return { programme: null, countdown: null, isAllCompleted: allDone };
}
