"use client";

import { useClockSeconds } from "@/components/community/CentenaryCountdown";
import { getProgrammeCountdown, getLagosTimestamp } from "@/lib/utils/centenary-countdown";
import type { CentenaryProgrammeItem } from "@/lib/media/community-programme";
import { Clock, Radio, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgrammeCountdownBadgeProps {
  item: CentenaryProgrammeItem;
  className?: string;
  variant?: "default" | "prominent" | "card";
}

export function ProgrammeCountdownBadge({
  item,
  className,
  variant = "default",
}: ProgrammeCountdownBadgeProps) {
  const seconds = useClockSeconds();
  const mounted = seconds !== null;
  const nowMs = mounted ? seconds * 1000 : getLagosTimestamp("2026-09-01");

  const countdown = getProgrammeCountdown(item, nowMs);

  // The programme section explains untimed days once; no per-card notice.
  if (countdown.state === "unconfirmed_time") return null;

  if (countdown.state === "completed") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full bg-charcoal/10 px-3 py-1 text-xs font-medium text-charcoal/60 ring-1 ring-inset ring-charcoal/10",
          className,
        )}
      >
        <CheckCircle2 className="h-3.5 w-3.5 text-charcoal/40" aria-hidden="true" />
        Completed
      </span>
    );
  }

  if (countdown.state === "happening_now") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full bg-gold-400 px-3 py-1 text-xs font-bold text-purple-950 shadow-sm animate-pulse ring-1 ring-inset ring-gold-500",
          className,
        )}
      >
        <Radio className="h-3.5 w-3.5 text-purple-950" aria-hidden="true" />
        {countdown.formattedRemaining}
      </span>
    );
  }

  if (countdown.state === "starting_today") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-1 text-xs font-semibold text-gold-900 ring-1 ring-inset ring-gold-300",
          className,
        )}
      >
        <Clock className="h-3.5 w-3.5 text-gold-700" aria-hidden="true" />
        {countdown.formattedRemaining}
      </span>
    );
  }

  // upcoming
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 ring-1 ring-inset ring-purple-600/15",
        variant === "prominent" && "bg-white text-purple-800 shadow-sm ring-white/20",
        className,
      )}
    >
      <Clock className="h-3.5 w-3.5 text-purple-600" aria-hidden="true" />
      <span>{mounted ? countdown.formattedRemaining : "Starts in --"}</span>
    </span>
  );
}
