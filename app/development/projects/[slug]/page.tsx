import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MapPin, Calendar, FileText } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProjectStatusBadge, VerificationBadge } from "@/components/ui/Badge";
import { getProjectBySlug } from "@/lib/data/projects";
import { formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  return { title: project.title, description: project.description ?? undefined };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const hasFunding = project.budget != null || project.amount_raised != null || project.funding_target != null;

  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "Development", href: "/development" }, { label: project.title }]} />
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">{project.title}</h1>
          <div className="mt-4 flex flex-wrap gap-3">
            <ProjectStatusBadge status={project.status} />
            <VerificationBadge status={project.verification_status} />
          </div>
        </Container>
      </div>

      <Container className="grid gap-12 py-16 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-10">
          {project.images[0] && (
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
              <Image src={project.images[0].image_url} alt={project.images[0].caption ?? ""} fill sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover" />
            </div>
          )}

          {project.description && (
            <section className="prose-heritage">
              <h2>About this Project</h2>
              <p>{project.description}</p>
            </section>
          )}

          {project.objective && (
            <section className="prose-heritage">
              <h2>Objective</h2>
              <p>{project.objective}</p>
            </section>
          )}

          {project.timeline.length > 0 && (
            <section>
              <h2 className="font-serif text-xl font-bold text-purple-600">Progress Timeline</h2>
              <ol className="mt-4 space-y-4 border-l-2 border-gold-500/40 pl-6">
                {project.timeline.map((t, i) => (
                  <li key={i}>
                    <p className="font-semibold text-purple-600">{t.milestone}</p>
                    {t.event_date && <p className="text-xs text-charcoal/50">{formatDate(t.event_date)}</p>}
                    {t.notes && <p className="mt-1 text-sm text-charcoal/70">{t.notes}</p>}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {project.updates.length > 0 && (
            <section>
              <h2 className="font-serif text-xl font-bold text-purple-600">Updates</h2>
              <div className="mt-4 space-y-4">
                {project.updates.map((u, i) => (
                  <div key={i} className="rounded-xl border border-purple-600/10 bg-white p-5">
                    <p className="font-semibold text-purple-600">{u.title}</p>
                    <p className="text-xs text-charcoal/50">{formatDate(u.update_date)}</p>
                    {u.body && <p className="mt-2 text-sm text-charcoal/80">{u.body}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {project.documents.length > 0 && (
            <section>
              <h2 className="font-serif text-xl font-bold text-purple-600">Documents</h2>
              <ul className="mt-4 space-y-2">
                {project.documents.map((d, i) => (
                  <li key={i}>
                    <a href={d.document_url} className="flex items-center gap-2 text-sm font-medium text-community-green hover:underline">
                      <FileText className="h-4 w-4" aria-hidden="true" />
                      {d.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="flex flex-col gap-6">
          <div className="rounded-2xl border border-purple-600/10 bg-white p-6">
            <h3 className="font-serif text-lg font-bold text-purple-600">Project Details</h3>
            <dl className="mt-4 space-y-3 text-sm">
              {project.location && (
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-purple-600/60" aria-hidden="true" />
                  <div>
                    <dt className="text-charcoal/50">Location</dt>
                    <dd>{project.location}</dd>
                  </div>
                </div>
              )}
              {project.start_date && (
                <div className="flex items-start gap-2">
                  <Calendar className="mt-0.5 h-4 w-4 text-purple-600/60" aria-hidden="true" />
                  <div>
                    <dt className="text-charcoal/50">Started</dt>
                    <dd>{formatDate(project.start_date)}</dd>
                  </div>
                </div>
              )}
              {project.expected_completion && (
                <div className="flex items-start gap-2">
                  <Calendar className="mt-0.5 h-4 w-4 text-purple-600/60" aria-hidden="true" />
                  <div>
                    <dt className="text-charcoal/50">Expected Completion</dt>
                    <dd>{formatDate(project.expected_completion)}</dd>
                  </div>
                </div>
              )}
              {project.responsible_organisation && (
                <div>
                  <dt className="text-charcoal/50">Responsible Organisation</dt>
                  <dd>{project.responsible_organisation}</dd>
                </div>
              )}
              {project.funding_source && (
                <div>
                  <dt className="text-charcoal/50">Funding Source</dt>
                  <dd>{project.funding_source}</dd>
                </div>
              )}
            </dl>
          </div>

          {hasFunding && (
            <div className="rounded-2xl border border-gold-500/30 bg-gold-100/50 p-6">
              <h3 className="font-serif text-lg font-bold text-purple-600">Funding</h3>
              <dl className="mt-4 space-y-2 text-sm">
                {project.budget != null && (
                  <div className="flex justify-between">
                    <dt>Budget</dt>
                    <dd className="font-semibold">{project.currency} {project.budget.toLocaleString()}</dd>
                  </div>
                )}
                {project.amount_raised != null && (
                  <div className="flex justify-between">
                    <dt>Raised</dt>
                    <dd className="font-semibold">{project.currency} {project.amount_raised.toLocaleString()}</dd>
                  </div>
                )}
                {project.funding_target != null && (
                  <div className="flex justify-between">
                    <dt>Target</dt>
                    <dd className="font-semibold">{project.currency} {project.funding_target.toLocaleString()}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </aside>
      </Container>
    </div>
  );
}
