import Image from "next/image";
import { School as SchoolIcon, MapPin, Calendar, Users, Wrench, Sparkles, CheckCircle2 } from "lucide-react";
import { VerificationBadge } from "@/components/ui/Badge";
import { LastUpdated } from "@/components/ui/LastUpdated";
import type { School } from "@/types/content";

const typeLabels: Record<string, string> = {
  public: "Public / Government",
  community: "Community Established",
  mission: "Mission / Voluntary",
  private: "Private Institution",
};

const levelLabels: Record<string, string> = {
  nursery_primary: "Nursery & Primary Education",
  primary: "Basic Primary Education",
  secondary: "Senior Secondary Education",
  vocational: "Vocational & Digital Skills",
  tertiary: "Higher Learning",
};

export function SchoolCard({ school }: { school: School }) {
  const hasPhoto = school.photographs && school.photographs.length > 0;

  return (
    <article className="overflow-hidden rounded-3xl border border-purple-600/10 bg-white shadow-sm transition hover:shadow-md">
      {hasPhoto && (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-purple-50">
          <Image
            src={school.photographs[0]}
            alt={school.name}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      )}

      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-community-green">
            {levelLabels[school.level] ?? school.level}
          </span>
          <VerificationBadge status={school.verification_status} />
        </div>

        <h3 className="mt-2 font-serif text-2xl font-bold text-purple-950">{school.name}</h3>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-charcoal/65">
          <span className="inline-flex items-center gap-1">
            <SchoolIcon className="h-3.5 w-3.5 text-purple-700" aria-hidden="true" />
            {typeLabels[school.school_type] ?? school.school_type}
          </span>

          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-gold-700" aria-hidden="true" />
            {school.location}
          </span>

          {school.year_established && !school.establishment_milestones?.length && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-purple-700" aria-hidden="true" />
              Est. {school.year_established}
            </span>
          )}

          {school.approximate_enrolment != null && (
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-charcoal/60" aria-hidden="true" />
              ~{school.approximate_enrolment.toLocaleString()} students
            </span>
          )}
        </div>

        {school.establishment_milestones && school.establishment_milestones.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {school.establishment_milestones.map((m, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-900 ring-1 ring-inset ring-purple-600/15"
              >
                <Calendar className="h-3 w-3 text-purple-600" aria-hidden="true" />
                <span className="text-charcoal/70">{m.label}:</span>
                <strong className="font-bold text-purple-950">{m.year}</strong>
              </span>
            ))}
          </div>
        )}

        {school.historical_description && (
          <p className="mt-4 text-sm leading-relaxed text-charcoal/80">{school.historical_description}</p>
        )}

        {school.facilities.length > 0 && (
          <div className="mt-5 border-t border-purple-100 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900">Documented Facilities</h4>
            <ul className="mt-2 grid gap-1.5 text-xs text-charcoal/75 sm:grid-cols-2">
              {school.facilities.map((f, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {school.community_needs.length > 0 && (
          <div className="mt-4 border-t border-purple-100 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gold-800 flex items-center gap-1.5">
              <Wrench className="h-3.5 w-3.5" aria-hidden="true" /> Priority Needs &amp; Community Assistance
            </h4>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {school.community_needs.map((n, i) => (
                <li key={i} className="rounded-lg bg-gold-50 px-2.5 py-1 text-xs text-gold-900 ring-1 ring-gold-600/20">
                  {n}
                </li>
              ))}
            </ul>
          </div>
        )}

        {school.current_projects.length > 0 && (
          <div className="mt-4 border-t border-purple-100 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-purple-600" aria-hidden="true" /> Active Interventions
            </h4>
            <ul className="mt-2 space-y-1 text-xs text-charcoal/80">
              {school.current_projects.map((p, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-purple-100 pt-4 text-xs text-charcoal/60">
          {school.source_title && (
            <span>Source: <strong className="text-charcoal/80">{school.source_title}</strong></span>
          )}
          <LastUpdated date={school.last_verified_at} verifiedBy={school.verified_by} />
        </div>
      </div>
    </article>
  );
}
