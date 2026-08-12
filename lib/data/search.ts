import { createClient } from "@/lib/supabase/server";

export interface SearchResult {
  id: string;
  type: "news" | "archive" | "people" | "event" | "project" | "family" | "oriki";
  title: string;
  excerpt: string | null;
  href: string;
}

const typeLabels: Record<SearchResult["type"], string> = {
  news: "News",
  archive: "Digital Archive",
  people: "Our People",
  event: "Takete-Ide Day",
  project: "Development",
  family: "Families",
  oriki: "Oríkì",
};

export { typeLabels };

export async function siteSearch(query: string): Promise<SearchResult[]> {
  const supabase = await createClient();
  if (!supabase || !query.trim()) return [];
  const q = `%${query.trim()}%`;

  const [news, archive, people, events, projects, families, oriki] = await Promise.all([
    supabase.from("news_articles").select("id, title, excerpt, slug").eq("status", "published").ilike("title", q).limit(8),
    supabase.from("archive_items").select("id, title, description, slug").eq("status", "published").ilike("title", q).limit(8),
    supabase.from("historical_people").select("id, name, achievements, slug").eq("status", "published").ilike("name", q).limit(8),
    supabase.from("events").select("id, year, theme, description").eq("status", "published").ilike("theme", q).limit(8),
    supabase.from("projects").select("id, title, description, slug").ilike("title", q).limit(8),
    supabase.from("families").select("id, name, summary, slug").eq("status", "published").ilike("name", q).limit(8),
    supabase.from("oriki").select("id, title, cultural_notes, slug").eq("status", "published").ilike("title", q).limit(8),
  ]);

  const results: SearchResult[] = [];

  (news.data ?? []).forEach((r) => results.push({ id: r.id, type: "news", title: r.title, excerpt: r.excerpt, href: `/news/${r.slug}` }));
  (archive.data ?? []).forEach((r) => results.push({ id: r.id, type: "archive", title: r.title, excerpt: r.description, href: `/archive/${r.slug}` }));
  (people.data ?? []).forEach((r) => results.push({ id: r.id, type: "people", title: r.name, excerpt: r.achievements, href: `/our-people/${r.slug}` }));
  (events.data ?? []).forEach((r) => results.push({ id: r.id, type: "event", title: `Takete-Ide Day ${r.year}`, excerpt: r.description, href: `/takete-ide-day/${r.year}` }));
  (projects.data ?? []).forEach((r) => results.push({ id: r.id, type: "project", title: r.title, excerpt: r.description, href: `/development/projects/${r.slug}` }));
  (families.data ?? []).forEach((r) => results.push({ id: r.id, type: "family", title: r.name, excerpt: r.summary, href: `/families/${r.slug}` }));
  (oriki.data ?? []).forEach((r) => results.push({ id: r.id, type: "oriki", title: r.title, excerpt: r.cultural_notes, href: `/oriki/${r.slug}` }));

  return results;
}
