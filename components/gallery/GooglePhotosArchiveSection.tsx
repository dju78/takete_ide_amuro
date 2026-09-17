import { ExternalLink, Image as ImageIcon } from "lucide-react";
import { validateGooglePhotosUrl, siteConfig } from "@/lib/site-config";

export interface GooglePhotosAlbum {
  label: string;
  url: string;
  ariaLabel?: string;
}

export const DEFAULT_PHOTO_ALBUMS: GooglePhotosAlbum[] = [
  {
    label: "View Community Photo Album",
    url: "https://photos.app.goo.gl/Fg9JZ7Bo8Qh76MS88",
    ariaLabel: "View Community Photo Album on Google Photos (opens in a new tab)",
  },
  {
    label: "View More Takete-Ide Photos",
    url: "https://photos.app.goo.gl/xgqqHrcE9isZDhUP8",
    ariaLabel: "View More Takete-Ide Photos on Google Photos (opens in a new tab)",
  },
];

interface GooglePhotosArchiveSectionProps {
  url?: string | null;
  albums?: GooglePhotosAlbum[];
  enabled?: boolean;
  title?: string;
  description?: string;
  className?: string;
}

export function GooglePhotosArchiveSection({
  url,
  albums,
  enabled = true,
  title = siteConfig.photoArchive.title,
  description = siteConfig.photoArchive.description,
  className = "",
}: GooglePhotosArchiveSectionProps) {
  if (!enabled) {
    return null;
  }

  const sourceAlbums = albums && albums.length > 0 ? albums : DEFAULT_PHOTO_ALBUMS;
  const validAlbums = sourceAlbums
    .map((album) => {
      const validUrl = validateGooglePhotosUrl(album.url);
      return validUrl ? { ...album, url: validUrl } : null;
    })
    .filter((a): a is GooglePhotosAlbum => a !== null);

  if (validAlbums.length === 0 && url) {
    const validUrl = validateGooglePhotosUrl(url);
    if (validUrl) {
      validAlbums.push({
        label: "View Community Photo Album",
        url: validUrl,
        ariaLabel: "View Community Photo Album on Google Photos (opens in a new tab)",
      });
    }
  }

  if (validAlbums.length === 0) {
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

        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3.5 shrink-0">
          {validAlbums.map((album, idx) => (
            <a
              key={album.url + idx}
              href={album.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={album.ariaLabel ?? `${album.label} on Google Photos (opens in a new tab)`}
              className={
                idx === 0
                  ? "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-gold-500 px-5 py-3.5 text-sm font-bold text-purple-950 shadow-md transition-all duration-200 hover:bg-gold-400 hover:shadow-lg focus:outline-hidden focus:ring-2 focus:ring-gold-300 focus:ring-offset-2 focus:ring-offset-purple-900 text-center"
                  : "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl border border-gold-400/40 bg-purple-950/60 px-5 py-3.5 text-sm font-bold text-gold-300 shadow-sm backdrop-blur-xs transition-all duration-200 hover:bg-purple-900 hover:text-white hover:border-gold-300 focus:outline-hidden focus:ring-2 focus:ring-gold-300 focus:ring-offset-2 focus:ring-offset-purple-900 text-center"
              }
            >
              <span>{album.label}</span>
              <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
