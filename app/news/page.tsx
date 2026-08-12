import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EmptyState } from "@/components/ui/EmptyState";
import { NewsCard } from "@/components/cards/NewsCard";
import { SearchInput } from "@/components/ui/SearchInput";
import { getAllNews, getNewsCategories } from "@/lib/data/news";

export const metadata: Metadata = {
  title: "News",
  description: "Community news, announcements and updates from Takete-Ide Amuro.",
};

interface Props {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function NewsPage({ searchParams }: Props) {
  const { category, q } = await searchParams;
  const [articles, categories] = await Promise.all([getAllNews({ category, search: q }), getNewsCategories()]);

  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "News" }]} />
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">News</h1>
          <p className="mt-3 max-w-2xl text-white/80">Community news, announcements and updates.</p>
        </Container>
      </div>

      <Container className="py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <Link href="/news" className="rounded-full bg-purple-600 px-4 py-2 text-sm font-medium text-white">All</Link>
            {categories.map((c) => (
              <Link key={c.slug} href={`/news?category=${c.slug}`} className="rounded-full bg-white px-4 py-2 text-sm font-medium text-charcoal/70 hover:bg-purple-50">
                {c.name}
              </Link>
            ))}
          </div>
          <SearchInput placeholder="Search news…" basePath="/news" />
        </div>

        <div className="mt-10">
          {articles.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <NewsCard key={a.id} article={a} />
              ))}
            </div>
          ) : (
            <EmptyState title="No news to show" message="Check back soon — community news and announcements will be published here." />
          )}
        </div>
      </Container>
    </div>
  );
}
