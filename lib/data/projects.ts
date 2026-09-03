import { getPublicSupabase } from "@/lib/supabase/server";
import type { DevelopmentProject } from "@/types/content";

const SELECT =
  "*, project_images(image_url, caption), project_updates(title, body, update_date), project_documents(title, document_url, document_type), project_timeline_events(milestone, event_date, notes)";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProject(row: any): DevelopmentProject {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    description: row.description,
    objective: row.objective,
    status: row.status,
    location: row.location,
    start_date: row.start_date,
    expected_completion: row.expected_completion,
    budget: row.budget,
    amount_raised: row.amount_raised,
    funding_target: row.funding_target,
    currency: row.currency,
    funding_source: row.funding_source,
    responsible_organisation: row.responsible_organisation,
    verification_status: row.verification_status,
    images: row.project_images ?? [],
    updates: row.project_updates ?? [],
    documents: row.project_documents ?? [],
    timeline: row.project_timeline_events ?? [],
  };
}

export async function getProjects(category?: string): Promise<DevelopmentProject[]> {
  const supabase = getPublicSupabase();
  if (!supabase) return [];
  let query = supabase.from("projects").select(SELECT).order("created_at", { ascending: false });
  if (category) query = query.eq("category", category);
  const { data, error } = await query;
  if (error || !data) return [];
  return data.map(mapProject);
}

export async function getProjectBySlug(slug: string): Promise<DevelopmentProject | null> {
  const supabase = getPublicSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase.from("projects").select(SELECT).eq("slug", slug).maybeSingle();
  if (error || !data) return null;
  return mapProject(data);
}
