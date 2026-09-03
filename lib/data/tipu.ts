import { getPublicSupabase } from "@/lib/supabase/server";

export async function getTipuLeadership() {
  const supabase = getPublicSupabase();
  if (!supabase) return [];
  const { data } = await supabase.from("tipu_leadership").select("*").order("sort_order");
  return data ?? [];
}

export async function getTipuBranches() {
  const supabase = getPublicSupabase();
  if (!supabase) return [];
  const { data } = await supabase.from("tipu_branches").select("*").order("name");
  return data ?? [];
}

export async function getTipuProjects() {
  const supabase = getPublicSupabase();
  if (!supabase) return [];
  const { data } = await supabase.from("tipu_projects").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

export async function getTipuAnnouncements() {
  const supabase = getPublicSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("tipu_announcements")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  return data ?? [];
}

export async function getTipuDocuments() {
  const supabase = getPublicSupabase();
  if (!supabase) return [];
  const { data } = await supabase.from("tipu_documents").select("*").order("published_at", { ascending: false });
  return data ?? [];
}
