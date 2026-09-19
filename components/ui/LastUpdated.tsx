import { Calendar, ShieldCheck } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface LastUpdatedProps {
  date: string | null | undefined;
  type?: "updated" | "verified";
  className?: string;
  verifiedBy?: string | null;
}

export function LastUpdated({
  date,
  type = "verified",
  className,
  verifiedBy,
}: LastUpdatedProps) {
  if (!date) return null;

  const label = type === "verified" ? "Last verified" : "Last updated";
  const formatted = formatDate(date);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-charcoal/60 font-medium",
        className,
      )}
    >
      {type === "verified" ? (
        <ShieldCheck className="h-3.5 w-3.5 text-purple-600/70" aria-hidden="true" />
      ) : (
        <Calendar className="h-3.5 w-3.5 text-charcoal/40" aria-hidden="true" />
      )}
      <span>
        {label}: <time dateTime={date} className="font-semibold text-charcoal/80">{formatted}</time>
        {verifiedBy && <span className="text-charcoal/50"> ({verifiedBy})</span>}
      </span>
    </div>
  );
}
