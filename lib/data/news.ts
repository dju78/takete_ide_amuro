import { createClient } from "@/lib/supabase/server";
import type { NewsArticle } from "@/types/content";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapArticle(row: any): NewsArticle {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    body: row.body,
    featured_image: row.featured_image,
    featured_image_alt: row.featured_image_alt,
    category: row.news_categories ? { name: row.news_categories.name, slug: row.news_categories.slug } : null,
    status: row.status,
    published_at: row.published_at,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tags: (row.news_article_tags ?? []).map((t: any) => t.tags?.name).filter(Boolean),
  };
}

const SELECT = "*, news_categories(name, slug), news_article_tags(tags(name))";

export async function getLatestNews(limit = 3): Promise<NewsArticle[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("news_articles")
    .select(SELECT)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data.map(mapArticle);
}

export async function getNewsBySlug(slug: string): Promise<NewsArticle | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from("news_articles").select(SELECT).eq("slug", slug).eq("status", "published").maybeSingle();
  if (error || !data) return null;
  return mapArticle(data);
}

export async function getAllNews(options?: { category?: string; search?: string }): Promise<NewsArticle[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  let query = supabase.from("news_articles").select(SELECT).eq("status", "published").order("published_at", { ascending: false });
  if (options?.search) query = query.ilike("title", `%${options.search}%`);
  const { data, error } = await query;
  if (error || !data) return [];
  const mapped = data.map(mapArticle);
  return options?.category ? mapped.filter((a) => a.category?.slug === options.category) : mapped;
}

export async function getNewsCategories() {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase.from("news_categories").select("name, slug").order("name");
  return data ?? [];
}
