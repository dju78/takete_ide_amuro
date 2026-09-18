import { cn } from "@/lib/utils";
import { Archive } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  children?: React.ReactNode;
  headingLevel?: "h2" | "h3";
}

export function EmptyState({
  title = "Nothing here yet",
  message = "More information will be added as it is verified by the community archive team.",
  icon: Icon = Archive,
  className,
  children,
  headingLevel = "h2",
}: EmptyStateProps) {
  const HeadingTag = headingLevel;
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-2xl border border-dashed border-purple-600/20 bg-purple-50/60 px-6 py-16 text-center",
        className,
      )}
    >
      <Icon className="mb-4 h-10 w-10 text-purple-600/40" aria-hidden="true" />
      <HeadingTag className="font-serif text-xl font-semibold text-purple-600">{title}</HeadingTag>
      <p className="mt-2 max-w-md text-sm text-charcoal/70">{message}</p>
      {children}
    </div>
  );
}
