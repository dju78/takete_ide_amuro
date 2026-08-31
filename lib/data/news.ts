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
    is_featured: Boolean(row.is_featured),
    source_name: row.source_name ?? null,
    source_url: row.source_url ?? null,
    related_project: row.projects ? { title: row.projects.title, slug: row.projects.slug } : null,
    related_branch_slug: row.related_branch_slug ?? null,
    related_event_year: row.related_event_year ?? null,
  };
}

const SELECT =
  "*, news_categories(name, slug), news_article_tags(tags(name)), projects(title, slug)";

/**
 * Every public query filters on `status = 'published'`.
 *
 * `archived` is a distinct state from `published` in the content_status enum, so
 * archiving an article withdraws it from the site without deleting it — the row
 * and its history survive, but no public route will serve it.
 */
const PUBLISHED = "published" as const;

export async function getLatestNews(limit = 3): Promise<NewsArticle[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("news_articles")
    .select(SELECT)
    .eq("status", PUBLISHED)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data.map(mapArticle);
}

/** The article an editor has chosen to lead the newsroom with, if any. */
export async function getFeaturedNews(): Promise<NewsArticle | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("news_articles")
    .select(SELECT)
    .eq("status", PUBLISHED)
    .eq("is_featured", true)
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return mapArticle(data);
}

export async function getNewsBySlug(slug: string): Promise<NewsArticle | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("news_articles")
    .select(SELECT)
    .eq("slug", slug)
    .eq("status", PUBLISHED)
    .maybeSingle();
  if (error || !data) return null;
  return mapArticle(data);
}

export async function getAllNews(options?: { category?: string; search?: string }): Promise<NewsArticle[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  let query = supabase
    .from("news_articles")
    .select(SELECT)
    .eq("status", PUBLISHED)
    .order("published_at", { ascending: false });

  if (options?.search) {
    // Searching only the headline missed articles whose subject appears in the
    // standfirst or the body. Commas and parentheses are stripped because they
    // delimit PostgREST's `or=` filter.
    const term = options.search.replace(/[(),*]/g, " ").replace(/\s+/g, " ").trim();
    if (term) query = query.or(`title.ilike.%${term}%,excerpt.ilike.%${term}%,body.ilike.%${term}%`);
  }

  const { data, error } = await query;
  if (error || !data) return [];
  const mapped = data.map(mapArticle);
  return options?.category ? mapped.filter((a) => a.category?.slug === options.category) : mapped;
}

/**
 * Further reading for an article: same category first, then anything else
 * recent. Excludes the article itself, and never reaches beyond published rows.
 */
export async function getRelatedNews(article: NewsArticle, limit = 3): Promise<NewsArticle[]> {
  const all = await getAllNews();
  const others = all.filter((a) => a.slug !== article.slug);
  const sameCategory = article.category
    ? others.filter((a) => a.category?.slug === article.category?.slug)
    : [];
  const rest = others.filter((a) => !sameCategory.includes(a));
  return [...sameCategory, ...rest].slice(0, limit);
}

/** Published articles tagged as relating to a given TIPU branch. */
export async function getNewsForBranch(branchSlug: string, limit = 3): Promise<NewsArticle[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("news_articles")
    .select(SELECT)
    .eq("status", PUBLISHED)
    .eq("related_branch_slug", branchSlug)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data.map(mapArticle);
}

export async function getNewsCategories() {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase.from("news_categories").select("name, slug").order("name");
  return data ?? [];
}
