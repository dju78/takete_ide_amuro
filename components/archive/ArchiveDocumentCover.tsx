import { ScrollText, BookOpen, ShieldCheck } from "lucide-react";

interface ArchiveDocumentCoverProps {
  title?: string;
  subtitle?: string;
  category?: string;
  className?: string;
}

export function ArchiveDocumentCover({
  title = "Historical Community Account",
  subtitle = "Heritage • Migration • Landscape • Community Memory",
  category = "Community Historical Archive",
  className = "",
}: ArchiveDocumentCoverProps) {
  return (
    <div
      className={`relative flex h-full min-h-[280px] w-full flex-col justify-between overflow-hidden rounded-2xl border border-gold-500/30 bg-gradient-to-br from-purple-950 via-purple-900 to-purple-950 p-6 sm:p-8 text-white shadow-md ${className}`}
      aria-label="Archive document cover"
    >
      {/* Decorative background watermarks */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-gold-500/5 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-community-green/10 blur-2xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-gold-500 via-community-green to-gold-500" />

      {/* Header / Seal */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-gold-300">
            Takete-Ide Amuro
          </p>
          <p className="mt-0.5 text-xs text-white/60">{category}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-gold-500/30 bg-gold-500/10 text-gold-300">
          <ScrollText className="h-4 w-4" aria-hidden="true" />
        </div>
      </div>

      {/* Central Title */}
      <div className="my-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-gold-300 shadow-inner">
          <BookOpen className="h-6 w-6" aria-hidden="true" />
        </div>
        <h2 className="font-serif text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {title}
        </h2>
        <div className="mx-auto my-3 h-0.5 w-16 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
        <p className="text-xs font-medium uppercase tracking-widest text-gold-300/90">
          Manuscript &amp; Oral Tradition Record
        </p>
      </div>

      {/* Footer Meta */}
      <div className="border-t border-white/10 pt-4 text-center">
        <p className="text-xs text-white/70">{subtitle}</p>
        <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-gold-400/80">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Preserved for Community Documentation</span>
        </div>
      </div>
    </div>
  );
}
