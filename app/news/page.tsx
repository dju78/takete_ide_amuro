import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EmptyState } from "@/components/ui/EmptyState";
import { NewsCard } from "@/components/cards/NewsCard";
import { SearchInput } from "@/components/ui/SearchInput";
import { HeritageImage } from "@/components/ui/HeritageImage";
import { getAllNews, getNewsCategories, getFeaturedNews } from "@/lib/data/news";
import { formatDate, truncate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "News",
  description: "Community news, announcements and updates from Takete-Ide Amuro.",
};

export const revalidate = 3600;

interface Props {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function NewsPage({ searchParams }: Props) {
  const { category, q } = await searchParams;
  const [articles, categories, featured] = await Promise.all([
    getAllNews({ category, search: q }),
    getNewsCategories(),
    getFeaturedNews(),
  ]);

  // The lead article is only pulled out when the reader is browsing everything;
  // once they filter or search, showing an unrelated lead would be noise.
  const isBrowsingAll = !category && !q;
  const lead = isBrowsingAll && featured ? featured : null;
  const rest = lead ? articles.filter((a) => a.id !== lead.id) : articles;

  const chip = (active: boolean) =>
    `inline-flex min-h-9 items-center rounded-full px-4 py-2 text-sm font-medium ${
      active ? "bg-purple-600 text-white" : "bg-white text-charcoal/70 hover:bg-purple-50"
    }`;

  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "News" }]} />
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">News</h1>
          <p className="mt-3 max-w-2xl text-white/85">
            Community news, announcements and updates from Takete-Ide and the TIPU network.
          </p>
        </Container>
      </div>

      <Container className="py-14 sm:py-16">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <nav aria-label="Filter news by category" className="flex flex-wrap gap-2">
            <Link href="/news" className={chip(!category)}>
              All
            </Link>
            {categories.map((c) => (
              <Link key={c.slug} href={`/news?category=${c.slug}`} className={chip(category === c.slug)}>
                {c.name}
              </Link>
            ))}
          </nav>
          <div className="lg:w-64 lg:shrink-0">
            <SearchInput placeholder="Search news…" basePath="/news" defaultValue={q} />
          </div>
        </div>

        {q && (
          <p className="mt-6 text-sm text-charcoal/60">
            {articles.length} {articles.length === 1 ? "article" : "articles"} matching{" "}
            <span className="font-semibold text-charcoal">“{q}”</span>
          </p>
        )}

        {/* Featured lead */}
        {lead && (
          <article className="mt-10 overflow-hidden rounded-3xl border border-purple-600/10 bg-white shadow-sm lg:grid lg:grid-cols-2 lg:items-stretch">
            {lead.featured_image && (
              <div className="relative aspect-[16/9] lg:aspect-auto lg:min-h-[20rem]">
                <HeritageImage
                  src={lead.featured_image}
                  alt={lead.featured_image_alt ?? ""}
                  label={lead.title}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex flex-col justify-center p-8 lg:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-700">
                Featured{lead.category ? ` · ${lead.category.name}` : ""}
              </p>
              <h2 className="mt-2 font-serif text-2xl font-bold text-purple-600 sm:text-3xl">
                <Link href={`/news/${lead.slug}`} className="hover:text-purple-400">
                  {lead.title}
                </Link>
              </h2>
              {lead.published_at && (
                <time dateTime={lead.published_at} className="mt-2 block text-sm text-charcoal/50">
                  {formatDate(lead.published_at)}
                </time>
              )}
              {lead.excerpt && (
                <p className="mt-4 leading-relaxed text-charcoal/80">{truncate(lead.excerpt, 220)}</p>
              )}
              <Link
                href={`/news/${lead.slug}`}
                className="mt-6 inline-flex min-h-6 items-center self-start text-sm font-semibold text-community-green hover:underline"
              >
                Read the full story →
              </Link>
            </div>
          </article>
        )}

        <div className="mt-10">
          {rest.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((a) => (
                <NewsCard key={a.id} article={a} />
              ))}
            </div>
          ) : lead ? null : (
            <EmptyState
              icon={Newspaper}
              title={q || category ? "No articles match that filter" : "No news published yet"}
              message={
                q || category
                  ? "Try a different category or search term, or browse all news."
                  : "Community news and announcements will be published here as the newsroom is populated. Nothing is drafted automatically — every article is written and approved by the community."
              }
            />
          )}
        </div>
      </Container>
    </div>
  );
}
