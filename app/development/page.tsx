import type { Metadata } from "next";
import Link from "next/link";
import { Route, GraduationCap, HeartPulse, Droplet, Zap, Building2, Cpu, Sprout } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { getProjects } from "@/lib/data/projects";

export const metadata: Metadata = {
  title: "Development",
  description: "Community development projects across roads, education, healthcare, water, electricity and more.",
};

const categories: { key: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "roads_access", label: "Roads & Access", icon: Route },
  { key: "education", label: "Education", icon: GraduationCap },
  { key: "healthcare", label: "Healthcare", icon: HeartPulse },
  { key: "water", label: "Water", icon: Droplet },
  { key: "electricity", label: "Electricity", icon: Zap },
  { key: "civic_infrastructure", label: "Civic Infrastructure", icon: Building2 },
  { key: "ict_digital", label: "ICT & Digital Development", icon: Cpu },
  { key: "youth_development", label: "Youth Development", icon: Sprout },
];

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function DevelopmentPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const projects = await getProjects(category);

  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "Development" }]} />
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Development</h1>
          <p className="mt-3 max-w-2xl text-white/80">
            Community-led projects building the infrastructure Takete-Ide needs — tracked openly from
            proposal through completion.
          </p>
        </Container>
      </div>

      <Container className="py-16">
        <div className="flex flex-wrap gap-2">
          <Link href="/development" className="rounded-full bg-purple-600 px-4 py-2 text-sm font-medium text-white">
            All Categories
          </Link>
          {categories.map((c) => (
            <Link
              key={c.key}
              href={`/development?category=${c.key}`}
              className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-charcoal/70 hover:bg-purple-50"
            >
              <c.icon className="h-4 w-4" aria-hidden="true" />
              {c.label}
            </Link>
          ))}
        </div>

        <SectionHeading eyebrow="Projects" title="Community Development Projects" align="left" className="mx-0 mt-12" />
        <div className="mt-8">
          {projects.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Project records are being compiled"
              message="Development projects will appear here as they are added by the project management team, each with a transparent status, funding information (where supplied) and progress updates."
            />
          )}
        </div>
      </Container>
    </div>
  );
}
