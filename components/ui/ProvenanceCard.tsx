import { BookOpen, UserCheck, Calendar, Bookmark, ExternalLink } from "lucide-react";
import { VerificationBadge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { VerificationStatus } from "@/types/content";
import { cn } from "@/lib/utils";

interface ProvenanceCardProps {
  provenance?: {
    source_title?: string | null;
    source_author?: string | null;
    source_type?: string | null;
    source_date?: string | null;
    source_url?: string | null;
    page_reference?: string | null;
    submitted_by?: string | null;
    verified_by?: string | null;
    last_verified_at?: string | null;
    verification_status?: VerificationStatus | string;
    notes?: string | null;
  };
  sourceTitle?: string | null;
  sourceAuthor?: string | null;
  sourceType?: string | null;
  sourceDate?: string | null;
  sourceUrl?: string | null;
  pageReference?: string | null;
  submittedBy?: string | null;
  verifiedBy?: string | null;
  verificationStatus?: VerificationStatus | string;
  lastVerifiedAt?: string | null;
  notes?: string | null;
  className?: string;
  compact?: boolean;
}

export function ProvenanceCard({
  provenance,
  sourceTitle,
  sourceAuthor,
  sourceType,
  sourceDate,
  sourceUrl,
  pageReference,
  submittedBy,
  verifiedBy,
  verificationStatus,
  lastVerifiedAt,
  notes,
  className,
  compact = false,
}: ProvenanceCardProps) {
  const title = sourceTitle ?? provenance?.source_title;
  const author = sourceAuthor ?? provenance?.source_author;
  const type = sourceType ?? provenance?.source_type;
  const date = sourceDate ?? provenance?.source_date;
  const url = sourceUrl ?? provenance?.source_url;
  const pageRef = pageReference ?? provenance?.page_reference;
  const submitter = submittedBy ?? provenance?.submitted_by;
  const reviewer = verifiedBy ?? provenance?.verified_by;
  const status = (verificationStatus ?? provenance?.verification_status ?? "community_record") as VerificationStatus;
  const verifiedAt = lastVerifiedAt ?? provenance?.last_verified_at;
  const note = notes ?? provenance?.notes;

  const hasSource = Boolean(title || author || type || date);
  const hasReviewer = Boolean(submitter || reviewer || verifiedAt);

  return (
    <div
      className={cn(
        "rounded-2xl border border-purple-600/15 bg-purple-50/40 p-5 shadow-2xs",
        compact ? "p-4 text-xs" : "p-6 text-sm",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-600/10 pb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-purple-700" aria-hidden="true" />
          <span className="font-serif font-bold text-purple-950">Record Provenance &amp; Verification</span>
        </div>
        <VerificationBadge status={status} />
      </div>

      <div className="mt-3.5 grid gap-3 sm:grid-cols-2">
        {hasSource && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gold-800">Source Documentation</p>
            {title && (
              <p className="font-medium text-charcoal">
                {url ? (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-purple-700 underline hover:text-purple-900"
                  >
                    {title} <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                ) : (
                  title
                )}
              </p>
            )}
            {author && <p className="text-charcoal/70">Author/Compiler: {author}</p>}
            {date && <p className="text-charcoal/60 text-xs">Date: {date}</p>}
            {type && <p className="text-charcoal/60">Type: {type}</p>}
            {pageRef && (
              <p className="inline-flex items-center gap-1 text-charcoal/60">
                <Bookmark className="h-3 w-3" aria-hidden="true" /> Ref: {pageRef}
              </p>
            )}
          </div>
        )}

        {hasReviewer && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gold-800">Community Review</p>
            {submitter && (
              <p className="text-charcoal/75">
                Submitted by: <span className="font-medium text-charcoal">{submitter}</span>
              </p>
            )}
            {reviewer && (
              <p className="inline-flex items-center gap-1 text-charcoal/75">
                <UserCheck className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
                Verified by: <span className="font-medium text-charcoal">{reviewer}</span>
              </p>
            )}
            {verifiedAt && (
              <p className="inline-flex items-center gap-1 text-charcoal/60 text-xs">
                <Calendar className="h-3 w-3" aria-hidden="true" />
                Last verified: {formatDate(verifiedAt)}
              </p>
            )}
          </div>
        )}
      </div>

      {note && (
        <p className="mt-3 border-t border-purple-600/10 pt-3 text-xs leading-relaxed text-charcoal/70 italic">
          {note}
        </p>
      )}
    </div>
  );
}
