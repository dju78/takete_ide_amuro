import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { HeritageImage } from "@/components/ui/HeritageImage";

/**
 * A card that *looks* like a video but costs one poster image — the clip itself
 * is only fetched on the page the card links to. Used where a section wants to
 * surface footage without pulling several megabytes into the initial page.
 */
export function VideoPosterCard({
  href,
  poster,
  title,
  description,
  durationLabel,
  posterAlt,
}: {
  href: string;
  poster?: string;
  title: string;
  description: string;
  durationLabel?: string;
  posterAlt: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-3xl border border-purple-600/10 bg-white shadow-sm transition-shadow hover:shadow-xl"
    >
      <div className="relative aspect-video overflow-hidden bg-purple-50">
        {poster && (
          <HeritageImage
            src={poster}
            alt={posterAlt}
            label={title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-purple-900/25">
          <PlayCircle className="h-14 w-14 text-white drop-shadow-lg" aria-hidden="true" />
        </span>
        {durationLabel && (
          <span className="absolute bottom-2 right-2 rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white">
            {durationLabel}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif text-lg font-bold text-purple-600 group-hover:text-purple-400">{title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal/75">{description}</p>
        <span className="mt-4 text-sm font-semibold text-community-green">Watch video →</span>
      </div>
    </Link>
  );
}
