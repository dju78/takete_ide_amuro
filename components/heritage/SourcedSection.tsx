import { VerificationBadge } from "@/components/ui/Badge";
import type { VerificationStatus } from "@/types/content";

interface SourcedSectionProps {
  title: string;
  status: VerificationStatus;
  sourceNote?: string;
  children: React.ReactNode;
}

/** Wraps a block of historical narrative with its verification status and source note — spec §9. */
export function SourcedSection({ title, status, sourceNote, children }: SourcedSectionProps) {
  return (
    <section className="scroll-mt-24">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-2xl font-bold text-purple-600 sm:text-3xl">{title}</h2>
        <VerificationBadge status={status} />
      </div>
      <div className="prose-heritage mt-4 text-charcoal/85">{children}</div>
      {sourceNote && <p className="mt-3 text-xs italic text-charcoal/50">Source note: {sourceNote}</p>}
    </section>
  );
}
