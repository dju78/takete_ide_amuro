import { createClient } from "@/lib/supabase/server";
import type { ArchiveItem, OralHistory } from "@/types/content";

export async function getArchiveItems(options?: { category?: string; search?: string }): Promise<ArchiveItem[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  let query = supabase
    .from("archive_items")
    .select("*")
    .eq("status", "published")
    .eq("access_level", "public")
    .order("created_at", { ascending: false });
  if (options?.category) query = query.eq("category", options.category);
  if (options?.search) query = query.ilike("title", `%${options.search}%`);
  const { data, error } = await query;
  if (error || !data) return [];
  return data;
}

export async function getArchiveItemBySlug(slug: string): Promise<ArchiveItem | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from("archive_items").select("*").eq("slug", slug).maybeSingle();
  if (error || !data) return null;
  return data;
}

export async function getOralHistories(): Promise<OralHistory[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("oral_histories").select("*").eq("status", "published").order("interview_date", { ascending: false });
  if (error || !data) return [];
  return data;
}
