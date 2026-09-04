import React from "react";
import { BookMarked, HelpCircle } from "lucide-react";

interface VerificationBoxProps {
  title?: string;
  notes: string[];
  sourceDescription?: string;
}

export function VerificationBox({
  title = "Community Heritage Record & Verification Notice",
  notes,
  sourceDescription,
}: VerificationBoxProps) {
  return (
    <div className="rounded-3xl border border-gold-300/60 bg-gradient-to-br from-gold-50/70 to-purple-50/40 p-6 sm:p-8 shadow-xs">
      <div className="flex items-start gap-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-200/80 text-gold-900 shadow-inner">
          <BookMarked className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-gold-800">
            Source Transparency &amp; Research Note
          </span>
          <h3 className="mt-0.5 font-serif text-lg font-bold text-purple-950 sm:text-xl">
            {title}
          </h3>
        </div>
      </div>

      {sourceDescription && (
        <p className="mt-3.5 text-sm leading-relaxed text-charcoal/85">
          {sourceDescription}
        </p>
      )}

      {notes.length > 0 && (
        <div className="mt-4 rounded-2xl border border-gold-200/60 bg-white/80 p-4 sm:p-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-950">
            <HelpCircle className="h-4 w-4 text-gold-700" aria-hidden="true" />
            <span>Points Subject to Elder &amp; Register Confirmation:</span>
          </div>
          <ul className="mt-3 space-y-2 text-xs leading-relaxed text-charcoal/80">
            {notes.map((note, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-600" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
