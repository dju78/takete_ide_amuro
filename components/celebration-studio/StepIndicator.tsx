import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3 | 4 | 5;
  onStepClick: (step: 1 | 2 | 3 | 4 | 5) => void;
  canNavigateToStep: (step: 1 | 2 | 3 | 4 | 5) => boolean;
}

const STEPS = [
  { step: 1, label: "Template", description: "Choose layout" },
  { step: 2, label: "Photo", description: "Upload & crop" },
  { step: 3, label: "Personalise", description: "Name & message" },
  { step: 4, label: "Preview", description: "Inspect design" },
  { step: 5, label: "Download", description: "Export & share" },
] as const;

export function StepIndicator({
  currentStep,
  onStepClick,
  canNavigateToStep,
}: StepIndicatorProps) {
  return (
    <nav aria-label="Celebration Studio Steps" className="w-full">
      {/* Mobile Bar */}
      <div className="flex items-center justify-between sm:hidden">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-700 text-xs font-bold text-white shadow-xs">
            {currentStep}
          </span>
          <span className="text-xs font-bold text-purple-900">
            Step {currentStep} of 5: {STEPS[currentStep - 1].label}
          </span>
        </div>
        <div className="flex gap-1">
          {STEPS.map((s) => (
            <div
              key={s.step}
              className={cn(
                "h-1.5 w-5 rounded-full transition-all duration-300",
                s.step === currentStep
                  ? "w-8 bg-purple-700"
                  : s.step < currentStep
                  ? "bg-gold-500"
                  : "bg-purple-200/60"
              )}
            />
          ))}
        </div>
      </div>

      {/* Desktop / Tablet Breadcrumb Track */}
      <ol className="hidden sm:grid sm:grid-cols-5 gap-2">
        {STEPS.map((s) => {
          const isCompleted = s.step < currentStep;
          const isCurrent = s.step === currentStep;
          const isClickable = canNavigateToStep(s.step as 1 | 2 | 3 | 4 | 5);

          return (
            <li key={s.step} className="relative">
              <button
                type="button"
                onClick={() => isClickable && onStepClick(s.step as 1 | 2 | 3 | 4 | 5)}
                disabled={!isClickable}
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "group flex w-full flex-col rounded-xl border p-3 text-left transition-all",
                  isCurrent
                    ? "border-purple-600 bg-purple-50/80 shadow-xs ring-2 ring-purple-600/20"
                    : isCompleted
                    ? "border-gold-400/40 bg-white hover:border-gold-500 hover:bg-gold-50/30 cursor-pointer"
                    : "border-purple-100 bg-white/60 opacity-60 cursor-not-allowed"
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors",
                      isCurrent
                        ? "bg-purple-700 text-white"
                        : isCompleted
                        ? "bg-gold-500 text-purple-950 font-black"
                        : "bg-purple-100 text-purple-600"
                    )}
                  >
                    {isCompleted ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : s.step}
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-charcoal/50">
                    Step {s.step}
                  </span>
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs font-bold leading-tight",
                    isCurrent
                      ? "text-purple-950"
                      : isCompleted
                      ? "text-purple-900 group-hover:text-purple-950"
                      : "text-charcoal/60"
                  )}
                >
                  {s.label}
                </span>
                <span className="text-[11px] text-charcoal/60 hidden lg:inline-block truncate">
                  {s.description}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
