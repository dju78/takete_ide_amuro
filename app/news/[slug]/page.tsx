import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { NewsCard } from "@/components/cards/NewsCard";
import { formatDate } from "@/lib/utils";
import { getNewsBySlug, getLatestNews } from "@/lib/data/news";
import { siteConfig } from "@/lib/site-config";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) return { title: "Article not found" };
  return {
    title: article.title,
    description: article.excerpt ?? undefined,
    openGraph: article.featured_image ? { images: [article.featured_image] } : undefined,
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const [article, related] = await Promise.all([getNewsBySlug(slug), getLatestNews(3)]);
  if (!article) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt ?? undefined,
    image: article.featured_image ? [article.featured_image] : undefined,
    datePublished: article.published_at ?? undefined,
    author: { "@type": "Organization", name: siteConfig.name },
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
        <Breadcrumb items={[{ label: "News", href: "/news" }, { label: article.title }]} />

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

        {related.filter((a) => a.slug !== article.slug).length > 0 && (
          <section className="mx-auto mt-20 max-w-5xl">
            <h2 className="font-serif text-2xl font-bold text-purple-600">Related Stories</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {related
                .filter((a) => a.slug !== article.slug)
                .slice(0, 3)
                .map((a) => (
                  <NewsCard key={a.id} article={a} />
                ))}
            </div>
          </section>
        )}
      </Container>
    </div>
  );
}
