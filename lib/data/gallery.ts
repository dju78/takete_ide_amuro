import { createClient } from "@/lib/supabase/server";
import type { GalleryItem } from "@/types/content";

export async function getGalleryItems(options?: { category?: string; year?: number }): Promise<GalleryItem[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  let query = supabase.from("gallery_items").select("*").eq("status", "published").order("created_at", { ascending: false });
  if (options?.category) query = query.eq("category", options.category);
  if (options?.year) query = query.eq("event_year", options.year);
  const { data, error } = await query;
  if (error || !data) return [];
  return data;
}

export async function getGalleryHighlights(limit = 8): Promise<GalleryItem[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data;
}

export async function getGalleryCategories(): Promise<string[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase.from("albums").select("category").order("category");
  return [...new Set((data ?? []).map((a) => a.category))];
}
