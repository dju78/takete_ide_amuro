import { getPublicSupabase } from "@/lib/supabase/server";
import { getBranchNetwork } from "@/lib/data/tipu-branches";

export interface FormOption {
  value: string;
  label: string;
}

/**
 * Choices for the news editor's category and relationship fields.
 *
 * Branches come from the shipped registry rather than a query, so the selector
 * is populated even before a branch has ever been edited into the database.
 */
export async function getNewsFormOptions(): Promise<{
  categories: FormOption[];
  branches: FormOption[];
  projects: FormOption[];
}> {
  const supabase = getPublicSupabase();
  const branchList = await getBranchNetwork({ includeInactive: true });
  const branches = branchList.map((b) => ({ value: b.slug, label: b.name }));

  if (!supabase) return { categories: [], branches, projects: [] };

  const [categories, projects] = await Promise.all([
    supabase.from("news_categories").select("id, name").order("name"),
    supabase.from("projects").select("id, title").order("title"),
  ]);

  return {
    categories: (categories.data ?? []).map((c) => ({ value: c.id, label: c.name })),
    branches,
    projects: (projects.data ?? []).map((p) => ({ value: p.id, label: p.title })),
  };
}
