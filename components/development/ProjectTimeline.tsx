import { CheckCircle2, Circle, Clock } from "lucide-react";
import type { ProjectStatus } from "@/types/content";
import { cn } from "@/lib/utils";

const STAGES: { key: ProjectStatus | "approved"; label: string; description: string }[] = [
  { key: "proposed", label: "Proposed", description: "Community initiative submitted" },
  { key: "planning", label: "Planning", description: "Feasibility and project planning" },
  { key: "fundraising", label: "Fundraising", description: "Community resource mobilization" },
  { key: "in_progress", label: "In Progress", description: "Active implementation on site" },
  { key: "completed", label: "Completed", description: "Delivered & serving community" },
];

const STAGE_ORDER: Record<string, number> = {
  proposed: 0,
  planning: 1,
  fundraising: 2,
  in_progress: 3,
  on_hold: 3, // paused during in_progress
  completed: 4,
};

export function ProjectTimeline({
  status,
  className,
}: {
  status: ProjectStatus;
  className?: string;
}) {
  const currentIndex = STAGE_ORDER[status] ?? 0;
  const isPaused = status === "on_hold";

  return (
    <div className={cn("rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm sm:p-8", className)}>
      <h3 className="font-serif text-lg font-bold text-purple-950">Development Project Lifecycle</h3>
      <p className="mt-1 text-xs text-charcoal/60">
        Standardized milestone progression from proposal to community delivery
      </p>

      <div className="mt-6">
        <ol className="relative grid gap-4 sm:grid-cols-5">
          {STAGES.map((stage, i) => {
            const isPassed = i < currentIndex;
            const isCurrent = i === currentIndex;

            return (
              <li key={stage.key} className="relative flex flex-col items-start sm:items-center text-left sm:text-center">
                {/* Horizontal connector line on larger screens */}
                {i < STAGES.length - 1 && (
                  <div
                    aria-hidden="true"
                    className={cn(
                      "hidden sm:block absolute top-4 left-1/2 w-full h-1 -z-0",
                      i < currentIndex ? "bg-emerald-600" : "bg-purple-100",
                    )}
                  />
                )}

                <div
                  className={cn(
                    "relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ring-4",
                    isPassed
                      ? "bg-emerald-600 text-white ring-emerald-100"
                      : isCurrent
                      ? isPaused
                        ? "bg-amber-500 text-white ring-amber-100 animate-pulse"
                        : "bg-purple-700 text-white ring-purple-100"
                      : "bg-purple-50 text-charcoal/40 ring-purple-50",
                  )}
                >
                  {isPassed ? (
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  ) : isCurrent ? (
                    <Clock className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Circle className="h-3 w-3" aria-hidden="true" />
                  )}
                </div>

                <div className="mt-2.5">
                  <p
                    className={cn(
                      "text-xs font-bold uppercase tracking-wider",
                      isCurrent
                        ? isPaused
                          ? "text-amber-700"
                          : "text-purple-700"
                        : isPassed
                        ? "text-emerald-800"
                        : "text-charcoal/50",
                    )}
                  >
                    {isCurrent && isPaused ? "Paused" : stage.label}
                  </p>
                  <p className="hidden sm:block mt-1 text-2xs text-charcoal/60 leading-tight">
                    {stage.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
