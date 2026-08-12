import Link from "next/link";
import { BookMarked } from "lucide-react";

export function ResearchDisclaimer() {
  return (
    <div className="flex gap-3 rounded-2xl border border-gold-500/30 bg-gold-100/60 p-5 text-sm text-charcoal/80">
      <BookMarked className="mt-0.5 h-5 w-5 shrink-0 text-gold-700" aria-hidden="true" />
      <p>
        Takete-Ide&rsquo;s history is being preserved through documentary evidence, community records and
        oral testimony. Some accounts on this page continue to be researched and verified with elders,
        family representatives and the traditional institution — see the status badge beside each section.
        If you can help confirm, correct or expand this record, please{" "}
        <Link href="/families/contribute" className="font-semibold text-purple-600 underline underline-offset-2">
          contribute what you know
        </Link>
        .
      </p>
    </div>
  );
}
