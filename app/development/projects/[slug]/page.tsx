import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, FileText, Building2, ChevronLeft, ArrowRight, Image as ImageIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProjectStatusBadge, VerificationBadge } from "@/components/ui/Badge";
import { ProjectTransparency } from "@/components/development/ProjectTransparency";
import { ProjectTimeline } from "@/components/development/ProjectTimeline";
import { ProvenanceCard } from "@/components/ui/ProvenanceCard";
import { LastUpdated } from "@/components/ui/LastUpdated";
import { getProjectBySlug, getProjects } from "@/lib/data/projects";
import { formatDate } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: `${project.title} | Development Projects`,
    description: project.description ?? `Community development project in Takete-Ide: ${project.title}`,
    alternates: {
      canonical: `${siteConfig.url}/development/projects/${project.slug}`,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const stageLabels = {
    before: "Before Work Commenced",
    progress: "In Progress / Execution",
    completion: "Completed Work",
    general: "Site Photograph",
  };

  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "Development", href: "/development" }, { label: project.title }]} />
          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            <ProjectStatusBadge status={project.status} />
            <VerificationBadge status={project.verification_status} />
          </div>
          <h1 className="mt-3 font-serif text-3xl font-bold sm:text-4xl lg:text-5xl">{project.title}</h1>
          {project.location && (
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-white/85">
              <MapPin className="h-4 w-4 text-gold-300" aria-hidden="true" />
              {project.location}
            </p>
          )}
        </Container>
      </div>

      <Container className="grid gap-12 py-14 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-10">
          {/* Main Hero Photograph */}
          {project.images[0] && (
            <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-purple-50 shadow-md">
              <Image
                src={project.images[0].image_url}
                alt={project.images[0].caption ?? project.title}
                fill
                priority
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="object-cover"
              />
              {project.images[0].caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-xs text-white">
                  {project.images[0].caption}
                </div>
              )}
            </div>
          )}

          {/* Project Lifecycle Pipeline */}
          <ProjectTimeline status={project.status} />

          {/* Financial Transparency Component */}
          <ProjectTransparency project={project} />

          {/* Description & Objectives */}
          {project.description && (
            <section className="rounded-3xl border border-purple-600/10 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="font-serif text-2xl font-bold text-purple-950">About this Project</h2>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/80 whitespace-pre-line sm:text-base">
                {project.description}
              </p>
            </section>
          )}

          {project.objective && (
            <section className="rounded-3xl border border-purple-600/10 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="font-serif text-2xl font-bold text-purple-950">Project Objectives &amp; Scope</h2>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/80 whitespace-pre-line sm:text-base">
                {project.objective}
              </p>
            </section>
          )}

          {/* Categorized Photo Gallery (Before / Progress / Completion) */}
          {project.images.length > 1 && (
            <section className="rounded-3xl border border-purple-600/10 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 border-b border-purple-100 pb-4">
                <ImageIcon className="h-5 w-5 text-purple-700" aria-hidden="true" />
                <h2 className="font-serif text-xl font-bold text-purple-950">Project Photographic Record</h2>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {project.images.slice(1).map((img, i) => (
                  <div key={i} className="group overflow-hidden rounded-2xl border border-purple-100 bg-purple-50/50">
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <Image
                        src={img.image_url}
                        alt={img.caption ?? `${project.title} photo ${i + 1}`}
                        fill
                        sizes="(min-width: 1024px) 25vw, 50vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {img.stage && (
                        <span className="absolute left-2 top-2 rounded-md bg-purple-950/80 px-2 py-0.5 text-2xs font-semibold uppercase text-gold-300 backdrop-blur-xs">
                          {stageLabels[img.stage] ?? img.stage}
                        </span>
                      )}
                    </div>
                    {img.caption && (
                      <p className="p-3 text-xs leading-relaxed text-charcoal/75">{img.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Milestones Timeline */}
          {project.timeline.length > 0 && (
            <section className="rounded-3xl border border-purple-600/10 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="font-serif text-xl font-bold text-purple-950">Milestones &amp; History</h2>
              <ol className="mt-6 space-y-4 border-l-2 border-gold-500/40 pl-6">
                {project.timeline.map((t, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[1.85rem] top-1.5 h-3 w-3 rounded-full bg-gold-500 ring-4 ring-white" />
                    <p className="font-semibold text-purple-950">{t.milestone}</p>
                    {t.event_date && <p className="text-xs text-charcoal/50">{formatDate(t.event_date)}</p>}
                    {t.notes && <p className="mt-1 text-sm text-charcoal/70">{t.notes}</p>}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Updates List */}
          {project.updates.length > 0 && (
            <section className="rounded-3xl border border-purple-600/10 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="font-serif text-xl font-bold text-purple-950">Field Updates &amp; Notices</h2>
              <div className="mt-6 space-y-4">
                {project.updates.map((u, i) => (
                  <div key={i} className="rounded-2xl border border-purple-100 bg-purple-50/40 p-5">
                    <p className="font-semibold text-purple-950">{u.title}</p>
                    <p className="text-xs text-charcoal/50">{formatDate(u.update_date)}</p>
                    {u.body && <p className="mt-2 text-sm leading-relaxed text-charcoal/80">{u.body}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Supporting Documents */}
          {project.documents.length > 0 && (
            <section className="rounded-3xl border border-purple-600/10 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="font-serif text-xl font-bold text-purple-950">Supporting Documents &amp; Reports</h2>
              <ul className="mt-4 space-y-2.5">
                {project.documents.map((d, i) => (
                  <li key={i}>
                    <a
                      href={d.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-xl border border-purple-100 bg-purple-50/40 p-3.5 text-sm font-medium text-purple-900 transition hover:bg-purple-100/60"
                    >
                      <FileText className="h-4 w-4 text-purple-700" aria-hidden="true" />
                      <span>{d.title}</span>
                      {d.document_type && (
                        <span className="ml-auto text-xs uppercase text-charcoal/50">{d.document_type}</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Provenance Card */}
          <ProvenanceCard
            sourceTitle={project.source_name}
            sourceUrl={project.source_url}
            verifiedBy={project.verified_by}
            verificationStatus={project.verification_status}
            lastVerifiedAt={project.last_verified_at}
          />
        </div>

        {/* Sidebar details */}
        <aside className="flex flex-col gap-6">
          <div className="rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-purple-950">Project Information</h3>
            <dl className="mt-4 space-y-4 text-sm divide-y divide-purple-100">
              {project.location && (
                <div className="pt-3 first:pt-0 flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 text-purple-700 shrink-0" aria-hidden="true" />
                  <div>
                    <dt className="text-xs font-semibold uppercase text-charcoal/50">Location</dt>
                    <dd className="font-medium text-charcoal">{project.location}</dd>
                  </div>
                </div>
              )}

              {project.responsible_organisation && (
                <div className="pt-3 flex items-start gap-2.5">
                  <Building2 className="mt-0.5 h-4 w-4 text-gold-700 shrink-0" aria-hidden="true" />
                  <div>
                    <dt className="text-xs font-semibold uppercase text-charcoal/50">Responsible Organisation</dt>
                    <dd className="font-medium text-charcoal">{project.responsible_organisation}</dd>
                  </div>
                </div>
              )}

              {project.start_date && (
                <div className="pt-3 flex items-start gap-2.5">
                  <Calendar className="mt-0.5 h-4 w-4 text-purple-700 shrink-0" aria-hidden="true" />
                  <div>
                    <dt className="text-xs font-semibold uppercase text-charcoal/50">Commenced</dt>
                    <dd className="font-medium text-charcoal">{formatDate(project.start_date)}</dd>
                  </div>
                </div>
              )}

              {project.expected_completion && (
                <div className="pt-3 flex items-start gap-2.5">
                  <Calendar className="mt-0.5 h-4 w-4 text-purple-700 shrink-0" aria-hidden="true" />
                  <div>
                    <dt className="text-xs font-semibold uppercase text-charcoal/50">Target Completion</dt>
                    <dd className="font-medium text-charcoal">{formatDate(project.expected_completion)}</dd>
                  </div>
                </div>
              )}

              {project.funding_source && (
                <div className="pt-3">
                  <dt className="text-xs font-semibold uppercase text-charcoal/50">Funding Source</dt>
                  <dd className="font-medium text-charcoal">{project.funding_source}</dd>
                </div>
              )}

              <div className="pt-3">
                <LastUpdated date={project.last_verified_at} verifiedBy={project.verified_by} />
              </div>
            </dl>
          </div>

          <div className="rounded-3xl border border-purple-600/10 bg-purple-50/50 p-6 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-purple-950">Support this Project</h3>
            <p className="mt-2 text-xs leading-relaxed text-charcoal/75">
              Contributions are received into the verified Takete-Ide Progressive Union account. Quote this project title as your payment reference.
            </p>
            <Link
              href="/support"
              className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-purple-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-purple-800"
            >
              Support Development <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <Link
            href="/development"
            className="inline-flex items-center gap-2 text-xs font-semibold text-charcoal/70 hover:text-purple-700"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Back to All Development Projects
          </Link>
        </aside>
      </Container>
    </div>
  );
}

