import { createClient } from "@/lib/supabase/server";
import type { ArchiveItem, OralHistory } from "@/types/content";

/**
 * Canonical pre-seeded archive records that ship with the platform.
 *
 * Preserves the distinction between original sources and edited public summaries.
 * The raw manuscript is preserved in the community archive, with descriptive metadata
 * published here for discovery and research reference.
 */
export const CANONICAL_ARCHIVE_ITEMS: ArchiveItem[] = [
  {
    id: "archive-takete-history-original",
    title: "Takete-Ide Historical Community Account",
    slug: "takete-history-original",
    description:
      "A preserved historical narrative covering Takete-Ide, Amuro, migration traditions, landscape, cultural memory and the movement from the uplands to the present settlement around 1926.",
    item_date: "2026-01-01",
    is_approximate_date: true,
    category: "document",
    contributor: "Community Historical Archive / Oral Tradition Compilation",
    rights_notes:
      "Preserved in the community archive for research, documentation and verified publication. Full raw manuscript retained pending community editorial confirmation.",
    verification_status: "community_tradition",
    tags: ["history", "amuro", "migration", "ilu-oke", "takete-idera", "c1926", "agbagba-ide"],
    file_url: null,
    thumbnail_url: null,
    access_level: "public",
  },
];

export async function getArchiveItems(options?: { category?: string; search?: string }): Promise<ArchiveItem[]> {
  const supabase = await createClient();
  let dbItems: ArchiveItem[] = [];
  if (supabase) {
    let query = supabase
      .from("archive_items")
      .select("*")
      .eq("status", "published")
      .eq("access_level", "public")
      .order("created_at", { ascending: false });
    if (options?.category) query = query.eq("category", options.category);
    if (options?.search) query = query.ilike("title", `%${options.search}%`);
    const { data, error } = await query;
    if (!error && data) dbItems = data;
  }

  // Combine canonical pre-seeded items with database records
  let all = [...CANONICAL_ARCHIVE_ITEMS, ...dbItems];
  if (options?.category) {
    all = all.filter((item) => item.category === options.category);
  }
  if (options?.search) {
    const q = options.search.toLowerCase();
    all = all.filter(
      (item) => item.title.toLowerCase().includes(q) || (item.description?.toLowerCase().includes(q) ?? false),
    );
  }
  return all;
}

/**
 * A single archive item for the public detail page.
 */
export async function getArchiveItemBySlug(slug: string): Promise<ArchiveItem | null> {
  const canonical = CANONICAL_ARCHIVE_ITEMS.find((item) => item.slug === slug);
  if (canonical) return canonical;

  const supabase = await createClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("archive_items")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .eq("access_level", "public")
    .maybeSingle();
  if (error || !data) return null;
  return data;
}

export async function getOralHistories(): Promise<OralHistory[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("oral_histories")
    .select("*")
    .eq("status", "published")
    .order("interview_date", { ascending: false });
  if (error || !data) return [];
  return data;
}
