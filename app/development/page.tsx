import type { Metadata } from "next";
import Link from "next/link";
import { Route, GraduationCap, HeartPulse, Droplet, Zap, Building2, Cpu, Sprout, ShieldCheck, Landmark, Lightbulb, Crown, Trees } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { VideoPosterCard } from "@/components/media/VideoPosterCard";
import { HeritageImage } from "@/components/ui/HeritageImage";
import { getProjects } from "@/lib/data/projects";
import { getCommunityMedia } from "@/lib/data/community-media";

export const metadata: Metadata = {
  title: "Development",
  description: "Community development projects across roads, education, healthcare, water, electricity and more.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

const categories: { key: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "roads_access", label: "Roads & Infrastructure", icon: Route },
  { key: "security", label: "Security", icon: ShieldCheck },
  { key: "town_hall", label: "Town Hall", icon: Landmark },
  { key: "community_lighting", label: "Community Lighting", icon: Lightbulb },
  { key: "education", label: "Education", icon: GraduationCap },
  { key: "traditional_institution", label: "Traditional Institution", icon: Crown },
  { key: "environment", label: "Environment", icon: Trees },
  { key: "healthcare", label: "Healthcare", icon: HeartPulse },
  { key: "water", label: "Water", icon: Droplet },
  { key: "electricity", label: "Electricity", icon: Zap },
  { key: "civic_infrastructure", label: "Civic Infrastructure", icon: Building2 },
  { key: "ict_digital", label: "ICT & Digital", icon: Cpu },
  { key: "youth_development", label: "Youth Development", icon: Sprout },
];

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function DevelopmentPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const [projects, footage, facilities] = await Promise.all([
    getProjects(category),
    getCommunityMedia({ category: "Development", mediaType: "video" }),
    getCommunityMedia({ category: "Development", mediaType: "image" }),
  ]);

  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "Development" }]} />
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Building Takete-Ide Together</h1>
          <p className="mt-3 max-w-2xl text-white/85">
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

        {footage.length > 0 && (
          <section className="mt-16">
            <SectionHeading
              eyebrow="On the ground"
              title="Community Footage"
              align="left"
              className="mx-0"
              description="Video recorded and shared by the community itself. Clips are only downloaded when you open them."
            />
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {footage.map((video) => (
                <VideoPosterCard
                  key={video.id}
                  href="/development/community-at-work"
                  poster={video.poster}
                  posterAlt={video.altText}
                  title={video.title}
                  description={video.description}
                  durationLabel={video.durationLabel}
                />
              ))}
            </div>
          </section>
        )}

        {facilities.length > 0 && (
          <section className="mt-16">
            <SectionHeading
              eyebrow="Facilities"
              title="Community Infrastructure &amp; Facilities"
              align="left"
              className="mx-0"
              description="Photographs of civic and healthcare facilities serving the Takete-Ide community."
            />
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {facilities.map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-purple-600/10 bg-white shadow-sm"
                >
                  <div className="relative aspect-[4/3]">
                    <HeritageImage
                      src={item.src}
                      alt={item.altText}
                      label={item.title}
                      fill
                      sizes="(min-width: 1024px) 30vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-base font-bold text-purple-950">{item.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-charcoal/75">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </Container>
    </div>
  );
}
