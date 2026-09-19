import { cn } from "@/lib/utils";
import type { ContentStatus, ProjectStatus, VerificationStatus } from "@/types/content";
import type { FamilyVerificationStatus } from "@/types/family";
import { CheckCircle2, HelpCircle, BookOpen, FileText, Clock, Mic2 } from "lucide-react";

const verificationConfig: Record<
  string,
  { label: string; className: string; icon: React.ComponentType<{ className?: string }> }
> = {
  verified: { label: "Verified", className: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600/25", icon: CheckCircle2 },
  community_record: { label: "Community Record", className: "bg-purple-50 text-purple-700 ring-1 ring-purple-600/20", icon: BookOpen },
  historical_source: { label: "Historical Source", className: "bg-blue-50 text-blue-800 ring-1 ring-blue-600/25", icon: FileText },
  oral_testimony: { label: "Oral Testimony", className: "bg-gold-100 text-gold-900 ring-1 ring-gold-600/30", icon: Mic2 },
  awaiting_verification: { label: "Awaiting Verification", className: "bg-amber-50 text-amber-800 ring-1 ring-amber-600/25", icon: Clock },
  // Semantic fallbacks and aliases:
  documentary_evidence: { label: "Documentary Evidence", className: "bg-blue-50 text-blue-800 ring-1 ring-blue-600/25", icon: FileText },
  oral_history: { label: "Oral Testimony", className: "bg-gold-100 text-gold-900 ring-1 ring-gold-600/30", icon: Mic2 },
  community_tradition: { label: "Community Tradition", className: "bg-purple-50 text-purple-700 ring-1 ring-purple-600/20", icon: BookOpen },
  community_reviewed: { label: "Verified", className: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600/25", icon: CheckCircle2 },
  family_submitted: { label: "Community Record", className: "bg-purple-50 text-purple-700 ring-1 ring-purple-600/20", icon: BookOpen },
  pending_verification: { label: "Awaiting Verification", className: "bg-amber-50 text-amber-800 ring-1 ring-amber-600/25", icon: Clock },
  draft: { label: "Draft", className: "bg-charcoal/5 text-charcoal/60 ring-1 ring-charcoal/10", icon: Clock },
  unverified: { label: "Awaiting Verification", className: "bg-amber-50 text-amber-800 ring-1 ring-amber-600/25", icon: HelpCircle },
  disputed: { label: "Under Review", className: "bg-rose-50 text-rose-800 ring-1 ring-rose-600/25", icon: HelpCircle },
};

export function VerificationBadge({
  status,
  className,
}: {
  status: VerificationStatus | FamilyVerificationStatus | string;
  className?: string;
}) {
  const config = verificationConfig[status] ?? verificationConfig.unverified;
  const Icon = config.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-tight shadow-2xs",
        config.className,
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {config.label}
    </span>
  );
}

const statusConfig: Record<ContentStatus, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-charcoal/10 text-charcoal" },
  pending_review: { label: "Pending Review", className: "bg-gold-100 text-gold-700 ring-1 ring-gold-600/20" },
  verified: { label: "Verified", className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20" },
  published: { label: "Published", className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20" },
  archived: { label: "Archived", className: "bg-charcoal/10 text-charcoal/70" },
};

export function StatusBadge({ status, className }: { status: ContentStatus; className?: string }) {
  const config = statusConfig[status] ?? statusConfig.draft;
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", config.className, className)}>
      {config.label}
    </span>
  );
}

const projectStatusConfig: Record<ProjectStatus, { label: string; className: string }> = {
  proposed: { label: "Proposed", className: "bg-charcoal/10 text-charcoal ring-1 ring-charcoal/15" },
  planning: { label: "Planning", className: "bg-purple-50 text-purple-700 ring-1 ring-purple-600/20" },
  fundraising: { label: "Fundraising", className: "bg-gold-100 text-gold-900 ring-1 ring-gold-600/25" },
  in_progress: { label: "In Progress", className: "bg-blue-50 text-blue-800 ring-1 ring-blue-600/25" },
  completed: { label: "Completed", className: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600/25" },
  on_hold: { label: "Paused", className: "bg-amber-50 text-amber-800 ring-1 ring-amber-600/25" },
};

export function ProjectStatusBadge({ status, className }: { status: ProjectStatus; className?: string }) {
  const config = projectStatusConfig[status] ?? projectStatusConfig.proposed;
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", config.className, className)}>
      {config.label}
    </span>
  );
}

