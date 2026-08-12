import type { Metadata } from "next";
import Image from "next/image";
import { FileText, MapPinned } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProjectStatusBadge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { getTipuLeadership, getTipuBranches, getTipuProjects, getTipuAnnouncements, getTipuDocuments } from "@/lib/data/tipu";

export const metadata: Metadata = {
  title: "TIPU — Takete-Ide Progressive Union",
  description: "About the Takete-Ide Progressive Union: leadership, branches, projects, announcements and reports.",
};

export default async function TipuPage() {
  const [leadership, branches, projects, announcements, documents] = await Promise.all([
    getTipuLeadership(),
    getTipuBranches(),
    getTipuProjects(),
    getTipuAnnouncements(),
    getTipuDocuments(),
  ]);

  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "TIPU" }]} />
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-white ring-4 ring-gold-500/40">
              <Image src="/images/source/tipu-emblem.jpg" alt="Takete-Ide Progressive Union emblem" fill className="object-cover" />
            </div>
            <div>
              <h1 className="font-serif text-4xl font-bold sm:text-5xl">Takete-Ide Progressive Union</h1>
              <p className="mt-2 text-lg font-medium text-gold-300">Faith, Unity and Progress</p>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-16">
        <section className="prose-heritage">
          <h2>About TIPU</h2>
          <p>
            The Takete-Ide Progressive Union (TIPU) is the community&rsquo;s union organisation, uniting
            indigenes around the shared motto of Faith, Unity and Progress. TIPU operates alongside — and
            distinctly from — the traditional institution, coordinating union-led projects, branch activity
            and community reporting.
          </p>
          <p className="text-sm italic text-charcoal/60">
            TIPU&rsquo;s detailed founding history is not yet documented on this site and will be added once
            supplied by union leadership.
          </p>
        </section>

        <section className="mt-16">
          <SectionHeading eyebrow="Leadership" title="Union Leadership" align="left" className="mx-0" />
          <div className="mt-6">
            {leadership.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {leadership.map((l) => (
                  <div key={l.id} className="rounded-2xl border border-purple-600/10 bg-white p-5">
                    <p className="font-semibold text-purple-600">{l.full_name}</p>
                    <p className="text-sm text-charcoal/60">{l.position}</p>
                    {l.branch && <p className="text-xs text-charcoal/50">{l.branch}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="Leadership list not yet published" message="TIPU's national and branch officers will be listed here once confirmed by union leadership." />
            )}
          </div>
        </section>

        <section className="mt-16">
          <SectionHeading eyebrow="Network" title="Branches" align="left" className="mx-0" />
          <div className="mt-6">
            {branches.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {branches.map((b) => (
                  <div key={b.id} className="flex items-start gap-3 rounded-2xl border border-purple-600/10 bg-white p-5">
                    <MapPinned className="mt-0.5 h-5 w-5 shrink-0 text-purple-600/60" aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-purple-600">{b.name}</p>
                      {b.region && <p className="text-sm text-charcoal/60">{b.region}</p>}
                      {b.description && <p className="mt-1 text-sm text-charcoal/70">{b.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="Branch directory coming soon" message="TIPU branches in Nigeria and the diaspora will be listed here." />
            )}
          </div>
        </section>

        <section className="mt-16">
          <SectionHeading eyebrow="Projects" title="TIPU Projects" align="left" className="mx-0" />
          <div className="mt-6">
            {projects.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((p) => (
                  <div key={p.id} className="rounded-2xl border border-purple-600/10 bg-white p-5">
                    <ProjectStatusBadge status={p.status} />
                    <p className="mt-2 font-semibold text-purple-600">{p.title}</p>
                    {p.description && <p className="mt-1 text-sm text-charcoal/70">{p.description}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No TIPU projects published yet" message="Union-led projects will be listed here as they are announced." />
            )}
          </div>
        </section>

        <section className="mt-16 grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Updates" title="Announcements" align="left" className="mx-0" />
            <div className="mt-6 space-y-4">
              {announcements.length > 0 ? (
                announcements.map((a) => (
                  <div key={a.id} className="rounded-2xl border border-purple-600/10 bg-white p-5">
                    <p className="font-semibold text-purple-600">{a.title}</p>
                    {a.published_at && <p className="text-xs text-charcoal/50">{formatDate(a.published_at)}</p>}
                    {a.body && <p className="mt-1 text-sm text-charcoal/70">{a.body}</p>}
                  </div>
                ))
              ) : (
                <EmptyState title="No announcements yet" message="Union announcements will appear here." />
              )}
            </div>
          </div>
          <div>
            <SectionHeading eyebrow="Records" title="Documents & Reports" align="left" className="mx-0" />
            <div className="mt-6 space-y-2">
              {documents.length > 0 ? (
                documents.map((d) => (
                  <a key={d.id} href={d.document_url} className="flex items-center gap-2 rounded-xl border border-purple-600/10 bg-white p-4 text-sm font-medium text-community-green hover:underline">
                    <FileText className="h-4 w-4" aria-hidden="true" /> {d.title}
                  </a>
                ))
              ) : (
                <EmptyState title="No documents published yet" message="Constitutions, reports and meeting documents will be listed here." />
              )}
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}
