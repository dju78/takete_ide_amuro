import Image from "next/image";
import Link from "next/link";
import { MapPin, Building2, TrendingUp } from "lucide-react";
import { ProjectStatusBadge, VerificationBadge } from "@/components/ui/Badge";
import type { DevelopmentProject } from "@/types/content";

const categoryLabels: Record<string, string> = {
  roads_access: "Roads & Infrastructure",
  education: "Education",
  healthcare: "Healthcare",
  water: "Water",
  electricity: "Electricity",
  civic_infrastructure: "Civic Infrastructure",
  ict_digital: "ICT & Digital",
  youth_development: "Youth Development",
  security: "Security",
  town_hall: "Town Hall",
  community_lighting: "Community Lighting",
  traditional_institution: "Traditional Institution",
  environment: "Environment",
};

export function ProjectCard({ project }: { project: DevelopmentProject }) {
  const hasProgress = project.progress_percentage != null;

  return (
    <Link
      href={`/development/projects/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-purple-600/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] bg-purple-50 overflow-hidden">
        {project.images[0] ? (
          <Image
            src={project.images[0].image_url}
            alt={project.images[0].caption ?? project.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-purple-50 p-6 text-center text-purple-600/40">
            <span className="font-serif text-sm font-semibold">{categoryLabels[project.category] ?? project.category}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <ProjectStatusBadge status={project.status} />
        </div>
        <div className="absolute right-3 top-3">
          <VerificationBadge status={project.verification_status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <span className="text-xs font-bold uppercase tracking-wider text-gold-700">
          {categoryLabels[project.category] ?? project.category}
        </span>
        <h3 className="mt-1 font-serif text-xl font-bold text-purple-950 transition-colors group-hover:text-purple-700">
          {project.title}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-charcoal/60">
          {project.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-purple-600/70" aria-hidden="true" />
              {project.location}
            </span>
          )}
          {project.responsible_organisation && (
            <span className="inline-flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5 text-gold-700" aria-hidden="true" />
              {project.responsible_organisation}
            </span>
          )}
        </div>

        {project.description && (
          <p className="mt-3 flex-1 text-sm leading-relaxed text-charcoal/75 line-clamp-3">
            {project.description}
          </p>
        )}

        {hasProgress && (
          <div className="mt-4 border-t border-purple-100 pt-3">
            <div className="flex items-center justify-between text-xs text-charcoal/70">
              <span className="font-medium inline-flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-purple-600" aria-hidden="true" /> Progress
              </span>
              <span className="font-serif font-bold text-purple-900">{project.progress_percentage}%</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-purple-50">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold-500 to-purple-600"
                style={{ width: `${Math.min(100, Math.max(0, project.progress_percentage ?? 0))}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

