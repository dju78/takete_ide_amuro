import React from "react";
import Link from "next/link";
import { Church, BookOpen, Clock, AlertCircle } from "lucide-react";
import { HeritageImage } from "@/components/ui/HeritageImage";
import { VerificationBadge } from "@/components/ui/Badge";
import type { ChurchDirectoryItem } from "@/content/heritage/faith/churches";

interface ChurchCardProps {
  church: ChurchDirectoryItem;
}

export function ChurchCard({ church }: ChurchCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-purple-600/10 bg-white shadow-sm transition-all hover:border-purple-600/20 hover:shadow-md">
      {/* Visual Header / Authentic Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-purple-900/5">
        {church.image ? (
          <HeritageImage
            src={church.image}
            alt={church.imageAlt || `${church.name} building in Takete-Ide`}
            label={church.name}
            fill
            sizes="(min-width: 1280px) 380px, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-purple-100/50 to-gold-50/50 p-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 shadow-inner">
              <Church className="h-7 w-7" aria-hidden="true" />
            </div>
            <p className="mt-3 font-serif text-sm font-bold text-purple-950">{church.shortName}</p>
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-gold-100/80 px-2.5 py-0.5 text-[11px] font-semibold text-gold-800">
              <Clock className="h-3 w-3" aria-hidden="true" />
              Archival photo pending
            </span>
          </div>
        )}

        {/* Order badge */}
        <div className="absolute left-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-purple-900/85 text-xs font-bold text-white shadow-sm backdrop-blur-xs">
          {church.displayOrder}
        </div>
      </div>

      {/* Content Body */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gold-700">
            {church.denomination}
          </span>
          <VerificationBadge status={church.sourceStatus} />
        </div>

        <h3 className="mt-2 font-serif text-xl font-bold text-purple-950">
          {church.name}
        </h3>

        {church.imageCaption && (
          <p className="mt-1 text-xs italic text-charcoal/60">
            {church.imageCaption}
          </p>
        )}

        {church.established && (
          <div className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-purple-900">
            <span className="font-semibold text-charcoal/70">Established:</span>
            <span>{church.established}</span>
          </div>
        )}

        <p className="mt-3 text-sm leading-relaxed text-charcoal/80">
          {church.summary}
        </p>

        {/* Card Footer / Action */}
        <div className="mt-auto pt-5">
          {church.hasFullProfile && church.profileHref ? (
            <Link
              href={church.profileHref}
              className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-purple-700 px-4 py-2 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-purple-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-700"
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Read church history →
            </Link>
          ) : (
            <div className="flex items-center gap-2 rounded-xl border border-gold-200 bg-gold-50/60 px-3.5 py-2.5 text-xs font-medium text-gold-900">
              <AlertCircle className="h-4 w-4 shrink-0 text-gold-700" aria-hidden="true" />
              <span>Historical profile being documented.</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
