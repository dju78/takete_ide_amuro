import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { ProjectStatusBadge } from "@/components/ui/Badge";
import type { DevelopmentProject } from "@/types/content";

const categoryLabels: Record<string, string> = {
  roads_access: "Roads & Access",
  education: "Education",
  healthcare: "Healthcare",
  water: "Water",
  electricity: "Electricity",
  civic_infrastructure: "Civic Infrastructure",
  ict_digital: "ICT & Digital Development",
  youth_development: "Youth Development",
};

export function ProjectCard({ project }: { project: DevelopmentProject }) {
  return (
    <Link
      href={`/development/projects/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-purple-600/10 bg-white shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] bg-purple-50">
        {project.images[0] ? (
          <Image src={project.images[0].image_url} alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-purple-600/30">
            <span className="font-serif text-sm">{categoryLabels[project.category]}</span>
          </div>
        )}
        <ProjectStatusBadge status={project.status} className="absolute left-3 top-3" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-gold-700">
          {categoryLabels[project.category] ?? project.category}
        </span>
        <h3 className="mt-1 font-serif text-lg font-bold text-purple-600 group-hover:text-purple-400">{project.title}</h3>
        {project.location && (
          <span className="mt-1 flex items-center gap-1 text-xs text-charcoal/50">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {project.location}
          </span>
        )}
        {project.description && <p className="mt-3 flex-1 text-sm text-charcoal/70">{project.description}</p>}
      </div>
    </Link>
  );
}
