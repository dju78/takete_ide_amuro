import { getPublicSupabase } from "@/lib/supabase/server";
import type { DevelopmentProject, ProjectStatus } from "@/types/content";

const SELECT =
  "*, project_images(image_url, caption, stage), project_updates(title, body, update_date), project_documents(title, document_url, document_type), project_timeline_events(milestone, event_date, notes)";

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
    budget: row.budget != null ? Number(row.budget) : null,
    amount_raised: row.amount_raised != null ? Number(row.amount_raised) : null,
    amount_spent: row.amount_spent != null ? Number(row.amount_spent) : null,
    funding_target: row.funding_target != null ? Number(row.funding_target) : null,
    progress_percentage: row.progress_percentage != null ? Number(row.progress_percentage) : null,
    currency: row.currency || "NGN",
    funding_source: row.funding_source,
    responsible_organisation: row.responsible_organisation,
    publication_status: row.publication_status || "published",
    verification_status: row.verification_status || "community_record",
    source_name: row.source_name,
    source_url: row.source_url,
    last_financial_update: row.last_financial_update,
    expenditure_notes: row.expenditure_notes,
    last_verified_at: row.last_verified_at,
    verified_by: row.verified_by,
    images: row.project_images ?? [],
    updates: row.project_updates ?? [],
    documents: row.project_documents ?? [],
    timeline: row.project_timeline_events ?? [],
  };
}

export interface ProjectFilterOptions {
  category?: string;
  status?: ProjectStatus | string;
  year?: number | string;
  search?: string;
}

export async function getProjects(
  categoryOrOptions?: string | ProjectFilterOptions,
): Promise<DevelopmentProject[]> {
  const options: ProjectFilterOptions =
    typeof categoryOrOptions === "string"
      ? { category: categoryOrOptions }
      : categoryOrOptions ?? {};

  const supabase = getPublicSupabase();
  if (!supabase) return [];

  let query = supabase
    .from("projects")
    .select(SELECT)
    .eq("publication_status", "published")
    .neq("verification_status", "disputed")
    .order("created_at", { ascending: false });

  if (options.category) query = query.eq("category", options.category);
  if (options.status) query = query.eq("status", options.status);
  if (options.year) {
    const y = Number(options.year);
    if (!isNaN(y)) {
      query = query.gte("start_date", `${y}-01-01`).lte("start_date", `${y}-12-31`);
    }
  }

  const { data, error } = await query;
  if (error || !data) return [];

  let list = data.map(mapProject);
  if (options.search) {
    const q = options.search.trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.location && p.location.toLowerCase().includes(q)),
    );
  }

  return list;
}

export async function getProjectBySlug(slug: string): Promise<DevelopmentProject | null> {
  const supabase = getPublicSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("projects")
    .select(SELECT)
    .eq("slug", slug)
    .eq("publication_status", "published")
    .neq("verification_status", "disputed")
    .maybeSingle();
  if (error || !data) return null;
  return mapProject(data);
}

