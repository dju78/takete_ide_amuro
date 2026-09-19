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

import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "TIPU — Takete-Ide Progressive Union",
  description:
    "Connecting Takete-Ide people at home, across Nigeria and around the world in support of heritage, unity and community development.",
  alternates: {
    canonical: `${siteConfig.url}/tipu`,
  },
  openGraph: {
    title: "TIPU — Takete-Ide Progressive Union | Takete-Ide",
    description:
      "Connecting Takete-Ide people at home, across Nigeria and around the world in support of heritage, unity and community development.",
    url: `${siteConfig.url}/tipu`,
    siteName: siteConfig.name,
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TIPU — Takete-Ide Progressive Union | Takete-Ide",
    description:
      "Connecting Takete-Ide people at home, across Nigeria and around the world in support of heritage, unity and community development.",
  },
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
          <p className="mt-4 text-base leading-relaxed text-charcoal/80">
            Takete-Ide Progressive Union represents the central community development and administrative union
            for all sons and daughters of Takete-Ide at home and in the diaspora.
          </p>
        </section>

        {/* Our Network — every figure computed from the branch registry. */}
        <section className="mt-16">
          <SectionHeading eyebrow="Our Network" title="A Union That Spans Continents" align="left" className="mx-0" />
          <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat value={stats.total} label="Documented branch and community records" />
            <Stat value={stats.nigeria} label="Locations in Nigeria, including home" />
            <Stat value={stats.diaspora} label="Diaspora chapters" />
            <Stat value={stats.growing} label="Growing network branches" />
          </dl>
          <p className="mt-4 text-sm text-charcoal/60">
            A united network across Nigeria and the diaspora, connecting members and advancing community initiatives.
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
          <div className="flex flex-wrap items-center justify-between gap-4">
            <SectionHeading eyebrow="National Executive" title="Union Leadership" align="left" className="mx-0" />
            <ButtonLink href="/contact" variant="outline" size="sm">
              Contact Secretariat
            </ButtonLink>
          </div>
          <div className="mt-6">
            {leadership.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {leadership.map((l) => (
                  <div key={l.id} className="rounded-2xl border border-purple-600/10 bg-white p-5 shadow-xs">
                    <p className="font-serif font-bold text-purple-950">{l.full_name}</p>
                    <p className="text-sm font-medium text-gold-800">{l.position}</p>
                    {l.branch && <p className="mt-1 text-xs text-charcoal/60">{l.branch}</p>}
                    {l.term && <p className="text-2xs text-charcoal/50">Term: {l.term}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="National Executive &amp; Officer Roster"
                message="Official TIPU National Executive records and branch executive rosters are currently being compiled and verified in accordance with union secretariat documentation."
                action={{
                  label: "Contact TIPU Secretariat",
                  href: "/contact",
                  variant: "outline",
                }}
                secondaryAction={{
                  label: "Explore TIPU Branches",
                  href: "/tipu/branches",
                }}
              />
            )}
          </div>
        </section>

        <section className="mt-16">
          <SectionHeading eyebrow="Newsroom" title="Latest TIPU News &amp; Bulletins" align="left" className="mx-0" />
          <div className="mt-6">
            {news.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {news.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Union Bulletins &amp; Updates"
                message="Curated summaries of union announcements and official press statements will appear here as they are published."
                action={{
                  label: "View General News",
                  href: "/news",
                  variant: "primary",
                }}
              />
            )}
          </div>
        </section>

        <section className="mt-16">
          <SectionHeading eyebrow="Projects" title="TIPU Projects &amp; Initiatives" align="left" className="mx-0" />
          <div className="mt-6">
            {projects.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((p) => (
                  <div key={p.id} className="rounded-2xl border border-purple-600/10 bg-white p-5 shadow-xs">
                    <ProjectStatusBadge status={p.status} />
                    <p className="mt-2 font-serif font-bold text-purple-950">{p.title}</p>
                    {p.description && <p className="mt-1 text-sm leading-relaxed text-charcoal/70">{p.description}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Union Development Initiatives"
                message="Union-led community initiatives and welfare schemes will be published here as they are officially ratified. Community infrastructure projects are tracked on the Development register."
                action={{
                  label: "Explore Community Development",
                  href: "/development",
                  variant: "secondary",
                }}
              />
            )}
          </div>
        </section>

        <section className="mt-16 grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Updates" title="Union Notices &amp; Announcements" align="left" className="mx-0" />
            <div className="mt-6 space-y-4">
              {announcements.length > 0 ? (
                announcements.map((a) => (
                  <div key={a.id} className="rounded-2xl border border-purple-600/10 bg-white p-5 shadow-xs">
                    <p className="font-serif font-bold text-purple-950">{a.title}</p>
                    {a.published_at && (
                      <p className="text-xs text-charcoal/50">{formatDate(a.published_at)}</p>
                    )}
                    {a.body && <p className="mt-2 text-sm leading-relaxed text-charcoal/75">{a.body}</p>}
                  </div>
                ))
              ) : (
                <EmptyState
                  title="Official Notices"
                  message="Meeting notices, communique resolutions, and union circulars will appear here as they are released."
                  compact
                />
              )}
            </div>
          </div>
          <div>
            <SectionHeading eyebrow="Records" title="Constitutions, Documents &amp; Reports" align="left" className="mx-0" />
            <div className="mt-6 space-y-2">
              {documents.length > 0 ? (
                documents.map((d) => (
                  <a
                    key={d.id}
                    href={d.document_url}
                    className="flex items-center gap-2 rounded-xl border border-purple-600/10 bg-white p-4 text-sm font-medium text-purple-900 shadow-2xs hover:bg-purple-50"
                  >
                    <FileText className="h-4 w-4 text-purple-700" aria-hidden="true" /> {d.title}
                  </a>
                ))
              ) : (
                <EmptyState
                  title="Official Publications Archive"
                  message="Constitutions, annual general meeting reports, and union resolutions will be accessible here."
                  compact
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

