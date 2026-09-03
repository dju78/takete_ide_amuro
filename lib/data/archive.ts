import { getPublicSupabase } from "@/lib/supabase/server";
import type { ArchiveItem, OralHistory } from "@/types/content";

/**
 * Canonical pre-seeded archive records that ship with the platform.
 */
export const CANONICAL_ARCHIVE_ITEMS: ArchiveItem[] = [
  {
    id: "archive-takete-history-original",
    title: "Takete-Ide Historical Community Account",
    slug: "takete-history-original",
    description:
      "A preserved community historical account covering Takete-Ide, Amuro, migration traditions, landscape, cultural memory and the movement to the present settlement around 1926.",
    item_date: null,
    is_approximate_date: false,
    category: "document",
    contributor: "Not stated in supplied copy",
    rights_notes:
      "Preserved for community documentation and continuing historical verification. Full raw manuscript retained in community archive.",
    verification_status: "community_tradition",
    tags: [
      "history",
      "amuro",
      "migration",
      "ilu-oke",
      "takete-idera",
      "c1926",
      "agbagba-ide",
      "ileteju",
      "olude",
      "alamuro",
    ],
    file_url: null,
    thumbnail_url: null,
    access_level: "public",
  },
  {
    id: "archive-takete-ide-day-2025",
    title: "Takete-Ide Day 2025 Celebration & Cultural Ambassador Conferment",
    slug: "takete-ide-day-2025-records",
    description:
      "Documentation of the 2025 Takete-Ide Day celebration held on 25 October 2025, including the state visit of Deputy Governor Comrade Joel Salifu Oyibo and the conferment of Cultural Ambassador on Amb. Chief Samuel O. Ipinlaiye by HRH Oba Philip Ebilakun (JP).",
    item_date: "2025-10-25",
    is_approximate_date: false,
    category: "photograph",
    contributor: "The Takete-Ide Progressive Union (TIPU) & Community Archive",
    rights_notes: "Preserved for community documentation and public archive reference.",
    verification_status: "verified",
    tags: ["takete-ide-day", "2025", "ipinlaiye", "cultural-ambassador", "deputy-governor", "olude", "tipu", "celebration"],
    file_url: "/videos/takete-ide/arrival-of-deputy-governor.mp4",
    thumbnail_url: "/images/takete-ide/celebrations/cultural-ambassador-award-conferment-2025.jpg",
    access_level: "public",
  },
];

export async function getArchiveItems(options?: { category?: string; search?: string }): Promise<ArchiveItem[]> {
  const supabase = getPublicSupabase();
  let dbItems: ArchiveItem[] = [];
  if (supabase) {
    try {
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
    } catch {
      // ignore and use canonical
    }
  }

  // Combine canonical pre-seeded items with database records
  let all = [...CANONICAL_ARCHIVE_ITEMS, ...dbItems];

  // Apply in-memory search/category filter to canonical items if specified
  if (options?.category) {
    all = all.filter((item) => item.category === options.category);
  }
  if (options?.search) {
    const term = options.search.toLowerCase();
    all = all.filter(
      (item) =>
        item.title.toLowerCase().includes(term) ||
        (item.description && item.description.toLowerCase().includes(term))
    );
  }

  return all;
}

export async function getArchiveItemBySlug(slug: string): Promise<ArchiveItem | null> {
  const canonical = CANONICAL_ARCHIVE_ITEMS.find((item) => item.slug === slug);
  if (canonical) return canonical;

  const supabase = getPublicSupabase();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("archive_items")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .eq("access_level", "public")
      .maybeSingle();
    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

export async function getOralHistories(): Promise<OralHistory[]> {
  const supabase = getPublicSupabase();
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("oral_histories")
      .select("*")
      .eq("status", "published")
      .order("interview_date", { ascending: false });
    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}
