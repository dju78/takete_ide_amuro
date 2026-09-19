import type { Metadata } from "next";
import Link from "next/link";
import { Route, GraduationCap, HeartPulse, Droplet, Zap, Building2, Cpu, Sprout, ShieldCheck, Landmark, Lightbulb, Crown, Trees, BookOpen, ArrowRight, Filter } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { VideoPosterCard } from "@/components/media/VideoPosterCard";
import { HeritageImage } from "@/components/ui/HeritageImage";
import { getProjects } from "@/lib/data/projects";
import { getCommunityMedia } from "@/lib/data/community-media";
import {
  BOOK_DEVELOPMENT_INTERVENTIONS,
} from "@/content/history/web/from-hilltops-to-valley";
import { siteConfig } from "@/lib/site-config";
import type { ProjectStatus } from "@/types/content";

export const metadata: Metadata = {
  title: "Development & Transparency",
  description: "Community development projects and financial transparency across roads, education, healthcare, water, electricity and civic infrastructure.",
  alternates: {
    canonical: `${siteConfig.url}/development`,
  },
  openGraph: {
    title: "Development & Transparency | Takete-Ide",
    description: "Community development projects and financial transparency across roads, education, healthcare, water, electricity and civic infrastructure.",
    url: `${siteConfig.url}/development`,
    siteName: siteConfig.name,
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Development & Transparency | Takete-Ide",
    description: "Community development projects and financial transparency across roads, education, healthcare, water, electricity and civic infrastructure.",
  },
};

export const revalidate = 3600;

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

const statuses: { key: ProjectStatus; label: string }[] = [
  { key: "proposed", label: "Proposed" },
  { key: "planning", label: "Planning" },
  { key: "fundraising", label: "Fundraising" },
  { key: "in_progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "on_hold", label: "Paused" },
];

interface Props {
  searchParams: Promise<{ category?: string; status?: string; year?: string }>;
}

export default async function DevelopmentPage({ searchParams }: Props) {
  const { category, status, year } = await searchParams;
  const [projects, footage, facilities] = await Promise.all([
    getProjects({ category, status, year }),
    getCommunityMedia({ category: "Development", mediaType: "video" }),
    getCommunityMedia({ category: "Development", mediaType: "image" }),
  ]);

  const hasFilter = Boolean(category || status || year);

  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "Development" }]} />
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Building Takete-Ide Together</h1>
          <p className="mt-3 max-w-2xl text-white/85 leading-relaxed">
            Community-led infrastructure and civic initiatives — tracked openly with verifiable progress,
            accountability, and milestone reporting.
          </p>
        </Container>
      </div>

      <Container className="py-14 sm:py-16">
        {/* Historical Development Milestones */}
        <section className="mb-14 overflow-hidden rounded-3xl border border-purple-600/10 bg-white shadow-sm">
          <div className="border-b border-purple-100 bg-purple-50/60 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                <BookOpen className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-700">Historical Foundations</p>
                <h2 className="mt-1 font-serif text-2xl font-bold text-purple-950">Historical Development Milestones</h2>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-charcoal/75">
                  Historical community infrastructure initiatives that laid the groundwork for modern civic and social development in Takete-Ide.
                </p>
              </div>
            </div>
          </div>
          <div className="grid gap-px bg-purple-100 sm:grid-cols-2 lg:grid-cols-3">
            {BOOK_DEVELOPMENT_INTERVENTIONS.map((item) => (
              <article key={`${item.period}-${item.title}`} className="bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-gold-700">{item.period}</p>
                <h3 className="mt-2 font-serif text-lg font-bold text-purple-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/75">{item.detail}</p>
              </article>
            ))}
          </div>
          <p className="border-t border-purple-100 px-6 py-4 text-xs font-medium leading-relaxed text-charcoal/60 sm:px-8">
            Source: Takete-Ide Historical Development Archive
          </p>
        </section>

        {/* Settlement & Community Progress Documentary Feature */}
        <section className="mb-14 overflow-hidden rounded-3xl border border-purple-600/10 bg-white shadow-sm">
          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-0.5 text-xs font-semibold text-gold-800">
                <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
                Physical Growth &amp; Housing
              </span>
              <h2 className="mt-3 font-serif text-2xl font-bold text-purple-950 sm:text-3xl">
                Settlement &amp; Community Progress
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/80 sm:text-base">
                A photographic record of contemporary residential development and the changing built
                environment of Takete-Ide, documenting the physical growth of the community across different areas.
              </p>
              <div className="mt-5">
                <Link
                  href="/development/settlement-progress"
                  className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-purple-700 px-5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-purple-800"
                >
                  Explore Settlement Progress <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-purple-50 shadow-inner">
              <HeritageImage
                src="/images/takete-ide/development/settlement-progress/settlement-progress-01.jpg"
                alt="Contemporary residential development in Takete-Ide"
                label="Contemporary Residential Growth"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Filter Controls */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal/60 mr-2 flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" /> Category:
            </span>
            <Link
              href={status ? `/development?status=${status}` : "/development"}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                !category ? "bg-purple-700 text-white" : "bg-white text-charcoal/70 hover:bg-purple-50"
              }`}
            >
              All Categories
            </Link>
            {categories.map((c) => {
              const isActive = category === c.key;
              const href = status ? `/development?category=${c.key}&status=${status}` : `/development?category=${c.key}`;
              return (
                <Link
                  key={c.key}
                  href={href}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                    isActive ? "bg-purple-700 text-white" : "bg-white text-charcoal/70 hover:bg-purple-50"
                  }`}
                >
                  <c.icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {c.label}
                </Link>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal/60 mr-2">Status:</span>
            <Link
              href={category ? `/development?category=${category}` : "/development"}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                !status ? "bg-gold-500 text-purple-950 font-bold" : "bg-white text-charcoal/70 hover:bg-purple-50"
              }`}
            >
              All Statuses
            </Link>
            {statuses.map((s) => {
              const isActive = status === s.key;
              const href = category ? `/development?category=${category}&status=${s.key}` : `/development?status=${s.key}`;
              return (
                <Link
                  key={s.key}
                  href={href}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    isActive ? "bg-purple-700 text-white font-bold" : "bg-white text-charcoal/70 hover:bg-purple-50"
                  }`}
                >
                  {s.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Project Listings */}
        <SectionHeading
          eyebrow="Register"
          title="Community Development Projects"
          align="left"
          className="mx-0 mt-12"
          description="Verified projects initiated by the community, TIPU, and development partners."
        />

        <div className="mt-8">
          {projects.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          ) : (
            <EmptyState
              title={hasFilter ? "No projects match the selected filters" : "Community Development Projects Register"}
              message={
                hasFilter
                  ? "Try selecting a different category or status, or view all recorded projects."
                  : "Community development project records and verified progress updates are currently being compiled and reviewed by project coordinators."
              }
              action={{
                label: "Submit a Project Update",
                href: "/contact",
                variant: "primary",
              }}
              secondaryAction={
                hasFilter
                  ? { label: "Reset Filters", href: "/development" }
                  : { label: "Support Development", href: "/support" }
              }
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

