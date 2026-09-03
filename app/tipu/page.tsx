import type { Metadata } from "next";
import { FileText, Globe2, HeartHandshake, Route, Sparkles } from "lucide-react";
import { HeritageImage } from "@/components/ui/HeritageImage";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";
import { ProjectStatusBadge } from "@/components/ui/Badge";
import { IconCard } from "@/components/cards/IconCard";
import { NewsCard } from "@/components/cards/NewsCard";
import { BranchCard } from "@/components/tipu/BranchCard";
import { CentenaryCountdown } from "@/components/community/CentenaryCountdown";
import { formatDate } from "@/lib/utils";
import {
  getTipuLeadership,
  getTipuProjects,
  getTipuAnnouncements,
  getTipuDocuments,
} from "@/lib/data/tipu";
import { getBranchNetwork, getBranchUpdates, summariseUpdates } from "@/lib/data/tipu-branches";
import { getCentenary } from "@/lib/data/community-programme";
import { getLatestNews } from "@/lib/data/news";

export const metadata: Metadata = {
  title: "TIPU — Takete-Ide Progressive Union",
  description:
    "Connecting Takete-Ide people at home, across Nigeria and around the world in support of heritage, unity and community development.",
};

export const revalidate = 3600;

/** Branches surfaced on the overview — media-backed first, then two representative others. */
const FEATURED_ON_OVERVIEW = ["lokoja", "ilorin", "uk-europe", "abuja", "kaduna"];

export default async function TipuPage() {
  const [leadership, projects, announcements, documents, branches, updates, centenary, news] =
    await Promise.all([
      getTipuLeadership(),
      getTipuProjects(),
      getTipuAnnouncements(),
      getTipuDocuments(),
      getBranchNetwork(),
      getBranchUpdates(),
      getCentenary(),
      getLatestNews(3),
    ]);

  // Every count is derived — adding a branch in the admin area updates them all.
  const stats = {
    total: branches.length,
    nigeria: branches.filter((b) => b.group === "nigeria" || b.group === "home").length,
    diaspora: branches.filter((b) => b.group === "diaspora").length,
    growing: branches.filter((b) => b.status === "forming" || b.group === "growing").length,
  };

  const featured = FEATURED_ON_OVERVIEW.map((slug) => branches.find((b) => b.slug === slug)).filter(
    (b): b is NonNullable<typeof b> => Boolean(b),
  );

  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "TIPU" }]} />
          <div className="mt-4 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-white ring-4 ring-gold-500/40">
              <HeritageImage
                src="/images/takete-ide/tipu-emblem.png"
                alt="Takete-Ide Progressive Union emblem"
                label="TIPU Emblem"
                fill
                sizes="96px"
                className="object-contain p-1"
              />
            </div>
            <div>
              <h1 className="font-serif text-4xl font-bold sm:text-5xl">Takete-Ide Progressive Union</h1>
              <p className="mt-2 text-lg font-medium text-gold-300">Faith, Unity and Progress</p>
            </div>
          </div>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85">
            Connecting Takete-Ide people at home, across Nigeria and around the world in support of
            heritage, unity and community development.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <ButtonLink href="/tipu/branches">Explore Our Branches</ButtonLink>
            <ButtonLink href="/support" variant="secondary" className="border-white/30 text-white hover:bg-white/10">
              Support Takete-Ide
            </ButtonLink>
          </div>
        </Container>
      </div>

      <Container className="py-14 sm:py-16">
        <section className="prose-heritage">
          <h2 className="mt-0">About TIPU</h2>
          <p>
            The Takete-Ide Progressive Union (TIPU) is the community&rsquo;s union organisation, uniting
            indigenes around the shared motto of Faith, Unity and Progress. TIPU operates alongside — and
            distinctly from — the traditional institution, coordinating union-led projects, branch
            activity and community reporting.
          </p>
          <p className="text-sm italic text-charcoal/60">
            TIPU&rsquo;s detailed founding history is not yet documented on this site and will be added
            once supplied by union leadership.
          </p>
        </section>

        {/* Our Network — every figure computed from the branch registry. */}
        <section className="mt-16">
          <SectionHeading eyebrow="Our Network" title="A Union That Spans Continents" align="left" className="mx-0" />
          <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat value={stats.total} label="Documented branch and community records" />
            <Stat value={stats.nigeria} label="Locations in Nigeria, including home" />
            <Stat value={stats.diaspora} label="Diaspora chapters" />
            <Stat value={stats.growing} label="Records still being documented" />
          </dl>
          <p className="mt-4 text-sm text-charcoal/60">
            A growing network across Nigeria and the diaspora. Some records are still being confirmed with
            union leadership — the network page shows the position for each.
          </p>
        </section>

        {/* Featured branches — a curated few, not all of them. */}
        {featured.length > 0 && (
          <section className="mt-16">
            <SectionHeading
              eyebrow="Branches"
              title="Featured Branches"
              align="left"
              className="mx-0"
              description="A few of the union's branches. The full network — at home, across Nigeria and abroad — is on the network page."
            />
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.slice(0, 3).map((branch) => {
                const { latest, upcoming } = summariseUpdates(updates.get(branch.slug));
                return <BranchCard key={branch.slug} branch={branch} latest={latest} upcoming={upcoming} />;
              })}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <ButtonLink href="/tipu/branches" variant="secondary">
                Explore the Full TIPU Network →
              </ButtonLink>
              <p className="text-sm text-charcoal/60">
                Also documented: {featured.slice(3).map((b) => b.shortName).join(", ")} and{" "}
                {stats.total - 5} more.
              </p>
            </div>
          </section>
        )}

        {/* Where the union's work connects to the rest of the site. */}
        <section className="mt-16">
          <SectionHeading eyebrow="The union's work" title="What TIPU Does" align="left" className="mx-0" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <IconCard
              icon={Route}
              title="Community Development"
              description="Roads, security, education and civic infrastructure, driven by community self-help."
              href="/development"
            />
            <IconCard
              icon={Sparkles}
              title="Centenary 2026"
              description="Takete-Ide Day and the Centenary Celebration on 31 October 2026."
              href="/centenary"
              tone="gold"
            />
            <IconCard
              icon={Globe2}
              title="Diaspora"
              description="Connecting indigenes in the UK, Europe, North America and beyond."
              href="/diaspora"
              tone="green"
            />
            <IconCard
              icon={HeartHandshake}
              title="Support Takete-Ide"
              description="The union's official contribution account and the funds it supports."
              href="/support"
            />
          </div>
        </section>

        {/* Centenary strip — the union's biggest upcoming date. */}
        <section className="mt-16 overflow-hidden rounded-3xl bg-purple-700 p-8 text-white lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-300">
                {centenary.title}
              </p>
              <h2 className="mt-2 font-serif text-2xl font-bold sm:text-3xl">{centenary.headline}</h2>
              <p className="mt-3 text-white/85">
                {centenary.eventDateLabel} &middot; {centenary.venue}
              </p>
              <ButtonLink href="/centenary" className="mt-6">
                Centenary 2026
              </ButtonLink>
            </div>
            <CentenaryCountdown eventDate={centenary.eventDate} tone="light" />
          </div>
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
              <EmptyState
                title="Leadership list not yet published"
                message="TIPU's national and branch officers will be listed here once confirmed by union leadership."
              />
            )}
          </div>
        </section>

        <section className="mt-16">
          <SectionHeading eyebrow="Newsroom" title="Latest TIPU News" align="left" className="mx-0" />
          <div className="mt-6">
            {news.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {news.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No union news published yet"
                message="Curated summaries of union announcements will appear here as the newsroom is populated."
              />
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
              <EmptyState
                title="No TIPU projects published yet"
                message="Union-led projects will be listed here as they are announced. Community development projects are tracked separately."
              />
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
                    {a.published_at && (
                      <p className="text-xs text-charcoal/50">{formatDate(a.published_at)}</p>
                    )}
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
                  <a
                    key={d.id}
                    href={d.document_url}
                    className="flex items-center gap-2 rounded-xl border border-purple-600/10 bg-white p-4 text-sm font-medium text-community-green hover:underline"
                  >
                    <FileText className="h-4 w-4" aria-hidden="true" /> {d.title}
                  </a>
                ))
              ) : (
                <EmptyState
                  title="No documents published yet"
                  message="Constitutions, reports and meeting documents will be listed here."
                />
              )}
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl border border-purple-600/10 bg-white p-5 shadow-sm">
      <dt className="sr-only">{label}</dt>
      <dd>
        <span className="block font-serif text-3xl font-bold text-purple-600">{value}</span>
        <span className="mt-1 block text-sm leading-snug text-charcoal/70">{label}</span>
      </dd>
    </div>
  );
}
