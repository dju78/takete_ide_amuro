import { getPublicSupabase } from "@/lib/supabase/server";
import type { HistoricalPerson, TraditionalRuler } from "@/types/content";

export async function getPeople(category?: string): Promise<HistoricalPerson[]> {
  const supabase = getPublicSupabase();
  if (!supabase) return [];
  let query = supabase.from("historical_people").select("*").eq("status", "published").order("name");
  if (category) query = query.eq("category", category);
  const { data, error } = await query;
  if (error || !data) return [];
  return data;
}

export async function getPersonBySlug(slug: string): Promise<HistoricalPerson | null> {
  const supabase = getPublicSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase.from("historical_people").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
  if (error || !data) return null;
  return data;
}

export async function getTraditionalRulers(): Promise<TraditionalRuler[]> {
  const supabase = getPublicSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase.from("traditional_rulers").select("*").order("sort_order");
  if (error || !data) return [];
  return data;
}

export async function getTraditionalCouncil() {
  const supabase = getPublicSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase.from("traditional_council_members").select("*").order("sort_order");
  if (error || !data) return [];
  return data;
}
