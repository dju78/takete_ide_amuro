import { cn } from "@/lib/utils";
import type { ContentStatus, ProjectStatus, VerificationStatus } from "@/types/content";
import type { FamilyVerificationStatus } from "@/types/family";
import { CheckCircle2, HelpCircle, BookOpen, FileText, AlertTriangle, Clock } from "lucide-react";

const verificationConfig: Record<
  VerificationStatus | FamilyVerificationStatus,
  { label: string; className: string; icon: React.ComponentType<{ className?: string }> }
> = {
  unverified: { label: "Unverified", className: "bg-charcoal/10 text-charcoal", icon: HelpCircle },
  draft: { label: "Draft", className: "bg-charcoal/10 text-charcoal", icon: Clock },
  family_submitted: { label: "Family Submitted", className: "bg-purple-50 text-purple-600", icon: FileText },
  oral_history: { label: "Oral History", className: "bg-gold-100 text-gold-700", icon: BookOpen },
  community_tradition: { label: "Community Tradition", className: "bg-gold-100 text-gold-700", icon: BookOpen },
  documentary_evidence: { label: "Documentary Evidence", className: "bg-purple-50 text-purple-600", icon: FileText },
  community_reviewed: { label: "Community Reviewed", className: "bg-green-600/10 text-green-700", icon: CheckCircle2 },
  verified: { label: "Verified", className: "bg-green-600/10 text-green-700", icon: CheckCircle2 },
  disputed: { label: "Disputed", className: "bg-red-100 text-red-700", icon: AlertTriangle },
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
