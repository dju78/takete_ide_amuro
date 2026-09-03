import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { NewsCard } from "@/components/cards/NewsCard";
import { formatDate } from "@/lib/utils";
import { getAllNews, getNewsBySlug, getRelatedNews } from "@/lib/data/news";
import { siteConfig } from "@/lib/site-config";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const articles = await getAllNews();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) return { title: "Article not found" };
  return {
    title: article.title,
    description: article.excerpt ?? undefined,
    alternates: { canonical: `${siteConfig.url}/news/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt ?? undefined,
      publishedTime: article.published_at ?? undefined,
      ...(article.featured_image ? { images: [article.featured_image] } : {}),
    },
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) notFound();
  const related = await getRelatedNews(article, 3);

  // NewsArticle rather than the generic Article, and only fields actually held:
  // an absent image or publication date is omitted rather than guessed.
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    ...(article.excerpt ? { description: article.excerpt } : {}),
    ...(article.featured_image ? { image: [article.featured_image] } : {}),
    ...(article.published_at ? { datePublished: article.published_at } : {}),
    ...(article.category ? { articleSection: article.category.name } : {}),
    author: { "@type": "Organization", name: article.source_name ?? siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
    mainEntityOfPage: `${siteConfig.url}/news/${article.slug}`,
  };

  return (
    <div className="bg-ivory">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Container className="py-16">
        <Breadcrumb
          items={[
            { label: "News", href: "/news" },
            ...(article.category
              ? [{ label: article.category.name, href: `/news?category=${article.category.slug}` }]
              : []),
            { label: article.title },
          ]}
        />

        <article className="mx-auto mt-8 max-w-3xl">
          {article.category && (
            <span className="text-xs font-semibold uppercase tracking-wide text-gold-700">{article.category.name}</span>
          )}
          <h1 className="mt-2 font-serif text-3xl font-bold text-purple-600 sm:text-4xl">{article.title}</h1>
          {article.published_at && (
            <time dateTime={article.published_at} className="mt-3 block text-sm text-charcoal/50">
              {formatDate(article.published_at)}
            </time>
          )}

          {article.featured_image && (
            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl">
              <Image src={article.featured_image} alt={article.featured_image_alt ?? ""} fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" priority />
            </div>
          )}

          <div className="prose-heritage mt-10">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.body}</ReactMarkdown>
          </div>

          {/* Attribution only where an external source was recorded; community
              articles are attributed to the union by the publisher field above. */}
          {article.source_name && (
            <p className="mt-8 rounded-xl bg-purple-50 px-4 py-3 text-sm text-charcoal/75">
              Source:{" "}
              {article.source_url ? (
                <a
                  href={article.source_url}
                  rel="noopener noreferrer nofollow"
                  target="_blank"
                  className="font-semibold text-purple-600 underline underline-offset-2"
                >
                  {article.source_name}
                </a>
              ) : (
                <span className="font-semibold text-charcoal">{article.source_name}</span>
              )}
            </p>
          )}

          {(article.related_project || article.related_branch_slug || article.related_event_year) && (
            <nav aria-label="Related on this site" className="mt-6 flex flex-wrap gap-2">
              {article.related_project && (
                <Link
                  href={`/development/projects/${article.related_project.slug}`}
                  className="inline-flex min-h-8 items-center rounded-full border border-purple-600/20 px-3 py-1 text-sm font-medium text-purple-600 hover:bg-purple-50"
                >
                  Project: {article.related_project.title}
                </Link>
              )}
              {article.related_branch_slug && (
                <Link
                  href="/tipu/branches"
                  className="inline-flex min-h-8 items-center rounded-full border border-purple-600/20 px-3 py-1 text-sm font-medium text-purple-600 hover:bg-purple-50"
                >
                  TIPU branch network
                </Link>
              )}
              {article.related_event_year && (
                <Link
                  href={`/takete-ide-day/${article.related_event_year}`}
                  className="inline-flex min-h-8 items-center rounded-full border border-purple-600/20 px-3 py-1 text-sm font-medium text-purple-600 hover:bg-purple-50"
                >
                  Takete-Ide Day {article.related_event_year}
                </Link>
              )}
            </nav>
          )}

          {article.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-600">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>

        {related.length > 0 && (
          <section className="mx-auto mt-20 max-w-5xl">
            <h2 className="font-serif text-2xl font-bold text-purple-600">Related Stories</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {related.map((a) => (
                <NewsCard key={a.id} article={a} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </div>
  );
}
