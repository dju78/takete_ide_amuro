import { ExternalLink, Image as ImageIcon } from "lucide-react";
import { validateGooglePhotosUrl } from "@/lib/site-config";

interface GooglePhotosArchiveSectionProps {
  url?: string | null;
  enabled?: boolean;
  title?: string;
  description?: string;
  className?: string;
}

export function GooglePhotosArchiveSection({
  url,
  enabled = true,
  title = "Explore More Takete-Ide Photographs",
  description = "Explore more photographs documenting the people, places, celebrations, institutions and community life of Takete-Ide in our extended Google Photos archive.",
  className = "",
}: GooglePhotosArchiveSectionProps) {
  const validUrl = validateGooglePhotosUrl(url);

  // If disabled or URL is missing/invalid, do not render broken button
  if (!enabled || !validUrl) {
    return null;
  }

  return (
    <section
      id="extended-archive"
      aria-labelledby="extended-archive-heading"
      className={`mt-16 overflow-hidden rounded-3xl border border-purple-600/15 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-950 p-8 text-white shadow-md sm:p-10 lg:p-12 ${className}`}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-300 ring-1 ring-inset ring-gold-400/30">
            <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Extended Community Collection
          </span>
          <h2 id="extended-archive-heading" className="mt-3 font-serif text-2xl font-bold sm:text-3xl lg:text-4xl text-white">
            {title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/85 sm:text-base">
            {description}
          </p>
        </div>

        <div className="flex shrink-0 items-center">
          <a
            href={validUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View Full Photo Archive on Google Photos (opens in a new tab)"
            className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-gold-500 px-6 py-3.5 text-sm font-bold text-purple-950 shadow-md transition-all duration-200 hover:bg-gold-400 hover:shadow-lg focus:outline-hidden focus:ring-2 focus:ring-gold-300 focus:ring-offset-2 focus:ring-offset-purple-900"
          >
            <span>View Full Photo Archive</span>
            <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
