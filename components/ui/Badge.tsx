import { cn } from "@/lib/utils";
import type { ContentStatus, ProjectStatus, VerificationStatus } from "@/types/content";
import type { FamilyVerificationStatus } from "@/types/family";
import { CheckCircle2, HelpCircle, BookOpen, FileText, Clock } from "lucide-react";

const verificationConfig: Record<
  string,
  { label: string; className: string; icon: React.ComponentType<{ className?: string }> }
> = {
  unverified: { label: "Pending Verification", className: "bg-ivory text-charcoal/70 ring-1 ring-charcoal/15", icon: Clock },
  pending_verification: { label: "Pending Verification", className: "bg-ivory text-charcoal/70 ring-1 ring-charcoal/15", icon: Clock },
  draft: { label: "Draft Record", className: "bg-charcoal/5 text-charcoal/60 ring-1 ring-charcoal/10", icon: Clock },
  family_submitted: { label: "Family Contributed", className: "bg-purple-50 text-purple-700 ring-1 ring-purple-600/20", icon: FileText },
  oral_history: { label: "Oral History", className: "bg-gold-100/70 text-gold-900 ring-1 ring-gold-600/25", icon: BookOpen },
  community_record: { label: "Community Record", className: "bg-purple-50 text-purple-700 ring-1 ring-purple-600/20", icon: BookOpen },
  community_tradition: { label: "Community Tradition", className: "bg-purple-50 text-purple-700 ring-1 ring-purple-600/20", icon: BookOpen },
  historical_archive: { label: "Historical Archive", className: "bg-blue-50 text-blue-800 ring-1 ring-blue-600/20", icon: FileText },
  documentary_evidence: { label: "Documentary Evidence", className: "bg-blue-50 text-blue-800 ring-1 ring-blue-600/20", icon: FileText },
  community_reviewed: { label: "Community Reviewed", className: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600/20", icon: CheckCircle2 },
  verified: { label: "Verified Record", className: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600/20", icon: CheckCircle2 },
  disputed: { label: "Under Review", className: "bg-amber-50 text-amber-800 ring-1 ring-amber-600/20", icon: HelpCircle },
};

export function VerificationBadge({
  status,
  className,
}: {
  status: VerificationStatus | FamilyVerificationStatus;
  className?: string;
}) {
  const config = verificationConfig[status] ?? verificationConfig.unverified;
  const Icon = config.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
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
  pending_review: { label: "Pending Review", className: "bg-gold-100 text-gold-700" },
  verified: { label: "Verified", className: "bg-green-600/10 text-green-700" },
  published: { label: "Published", className: "bg-green-600/10 text-green-700" },
  archived: { label: "Archived", className: "bg-charcoal/10 text-charcoal" },
};

export function StatusBadge({ status, className }: { status: ContentStatus; className?: string }) {
  const config = statusConfig[status];
  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", config.className, className)}>
      {config.label}
    </span>
  );
}

const projectStatusConfig: Record<ProjectStatus, { label: string; className: string }> = {
  proposed: { label: "Proposed", className: "bg-charcoal/10 text-charcoal" },
  planning: { label: "Planning", className: "bg-purple-50 text-purple-600" },
  fundraising: { label: "Fundraising", className: "bg-gold-100 text-gold-700" },
  in_progress: { label: "In Progress", className: "bg-blue-100 text-blue-700" },
  completed: { label: "Completed", className: "bg-green-600/10 text-green-700" },
  on_hold: { label: "On Hold", className: "bg-red-100 text-red-700" },
};

export function ProjectStatusBadge({ status, className }: { status: ProjectStatus; className?: string }) {
  const config = projectStatusConfig[status];
  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", config.className, className)}>
      {config.label}
    </span>
  );
}
