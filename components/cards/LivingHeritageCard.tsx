import Link from "next/link";
import { HeritageImage } from "@/components/ui/HeritageImage";
import { PlayCircle } from "lucide-react";

interface LivingHeritageCardProps {
  href: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  isVideo?: boolean;
}

export function LivingHeritageCard({ href, title, description, image, imageAlt, isVideo }: LivingHeritageCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-3xl border border-purple-600/10 bg-white shadow-sm transition-shadow hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-purple-50">
        {image && (
          <HeritageImage
            src={image}
            alt={imageAlt ?? ""}
            label={title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        {isVideo && (
          <span className="absolute inset-0 flex items-center justify-center bg-purple-900/20">
            <PlayCircle className="h-14 w-14 text-white drop-shadow-lg" aria-hidden="true" />
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif text-xl font-bold text-purple-600 group-hover:text-purple-400">{title}</h3>
        <p className="mt-3 flex-1 text-base leading-relaxed text-charcoal/75">{description}</p>
        <span className="mt-4 text-sm font-semibold text-community-green">Explore →</span>
      </div>
    </Link>
  );
}
