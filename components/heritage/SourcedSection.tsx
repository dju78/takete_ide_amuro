import type { VerificationStatus } from "@/types/content";

interface SourcedSectionProps {
  title: string;
  status?: VerificationStatus;
  sourceNote?: string;
  children: React.ReactNode;
}

/** Wraps a block of historical narrative in a clean editorial layout. */
export function SourcedSection({ title, children }: SourcedSectionProps) {
  return (
    <section className="scroll-mt-24">
      <h2 className="font-serif text-2xl font-bold text-purple-600 sm:text-3xl">{title}</h2>
      <div className="prose-heritage mt-4 text-charcoal/85">{children}</div>
    </section>
  );
}

