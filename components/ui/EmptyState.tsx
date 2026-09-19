import Link from "next/link";
import { cn } from "@/lib/utils";
import { ShieldCheck, LucideIcon } from "lucide-react";

interface ActionItem {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "outline";
}

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  className?: string;
  children?: React.ReactNode;
  headingLevel?: "h2" | "h3" | "p";
  action?: ActionItem;
  secondaryAction?: ActionItem;
  compact?: boolean;
  tone?: "purple" | "gold" | "green" | "neutral";
}

const toneStyles = {
  purple: {
    wrapper: "border-purple-600/20 bg-purple-50/50",
    icon: "text-purple-600/60 bg-purple-100/70 ring-purple-600/10",
    title: "text-purple-950",
    accent: "text-purple-700",
  },
  gold: {
    wrapper: "border-gold-500/20 bg-gold-50/40",
    icon: "text-gold-700 bg-gold-100 ring-gold-500/20",
    title: "text-purple-950",
    accent: "text-gold-800",
  },
  green: {
    wrapper: "border-emerald-600/20 bg-emerald-50/40",
    icon: "text-emerald-700 bg-emerald-100 ring-emerald-600/20",
    title: "text-purple-950",
    accent: "text-emerald-800",
  },
  neutral: {
    wrapper: "border-charcoal/15 bg-white/70",
    icon: "text-charcoal/50 bg-charcoal/5 ring-charcoal/10",
    title: "text-charcoal",
    accent: "text-charcoal/80",
  },
};

export function EmptyState({
  title = "Records Under Verification",
  message = "Community records are currently being verified and prepared for publication.",
  icon: Icon = ShieldCheck,
  className,
  children,
  headingLevel = "h2",
  action,
  secondaryAction,
  compact = false,
  tone = "purple",
}: EmptyStateProps) {
  const HeadingTag = headingLevel;
  const currentTone = toneStyles[tone] ?? toneStyles.purple;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-3xl border border-dashed text-center shadow-xs transition-colors",
        currentTone.wrapper,
        compact ? "px-5 py-8 sm:py-10" : "px-6 py-12 sm:px-10 sm:py-16",
        className,
      )}
    >
      <div
        className={cn(
          "mb-3.5 flex items-center justify-center rounded-2xl p-3 ring-1",
          currentTone.icon,
        )}
      >
        <Icon className={compact ? "h-6 w-6" : "h-8 w-8"} aria-hidden="true" />
      </div>

      <HeadingTag
        className={cn(
          "font-serif font-bold tracking-tight",
          compact ? "text-base sm:text-lg" : "text-xl sm:text-2xl",
          currentTone.title,
        )}
      >
        {title}
      </HeadingTag>

      <p className={cn("mt-2 max-w-lg text-sm leading-relaxed text-charcoal/75", compact && "text-xs max-w-sm")}>
        {message}
      </p>

      {(action || secondaryAction || children) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {action && (
            <Link
              href={action.href}
              className={cn(
                "inline-flex min-h-10 items-center justify-center rounded-xl px-5 py-2 text-xs font-bold shadow-xs transition-all",
                action.variant === "outline"
                  ? "border border-purple-700/20 bg-white text-purple-900 hover:bg-purple-50"
                  : action.variant === "secondary"
                  ? "bg-gold-500 text-purple-950 hover:bg-gold-400"
                  : "bg-purple-700 text-white hover:bg-purple-800",
              )}
            >
              {action.label}
            </Link>
          )}

          {secondaryAction && (
            <Link
              href={secondaryAction.href}
              className="inline-flex min-h-10 items-center justify-center rounded-xl px-4 py-2 text-xs font-semibold text-charcoal/70 hover:text-purple-700 hover:underline"
            >
              {secondaryAction.label}
            </Link>
          )}

          {children}
        </div>
      )}
    </div>
  );
}

