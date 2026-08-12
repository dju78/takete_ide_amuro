import { createClient } from "@/lib/supabase/server";

export interface DashboardStats {
  draftCount: number;
  publishedCount: number;
  pendingReviewCount: number;
  activeProjectsCount: number;
  newSubmissionsCount: number;
  recentActivity: { id: string; action: string; entity_type: string; created_at: string; user_id: string | null }[];
}

const empty: DashboardStats = {
  draftCount: 0,
  publishedCount: 0,
  pendingReviewCount: 0,
  activeProjectsCount: 0,
  newSubmissionsCount: 0,
  recentActivity: [],
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();
  if (!supabase) return empty;

  const [draft, published, pending, activeProjects, contactNew, diasporaNew, volunteerNew, heritageNew, activity] = await Promise.all([
    supabase.from("news_articles").select("id", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("news_articles").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("news_articles").select("id", { count: "exact", head: true }).eq("status", "pending_review"),
    supabase.from("projects").select("id", { count: "exact", head: true }).in("status", ["planning", "fundraising", "in_progress"]),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("diaspora_members").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("volunteer_submissions").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("heritage_submissions").select("id", { count: "exact", head: true }).eq("review_status", "pending"),
    supabase.from("audit_logs").select("id, action, entity_type, created_at, user_id").order("created_at", { ascending: false }).limit(10),
  ]);

  return {
    draftCount: draft.count ?? 0,
    publishedCount: published.count ?? 0,
    pendingReviewCount: pending.count ?? 0,
    activeProjectsCount: activeProjects.count ?? 0,
    newSubmissionsCount: (contactNew.count ?? 0) + (diasporaNew.count ?? 0) + (volunteerNew.count ?? 0) + (heritageNew.count ?? 0),
    recentActivity: activity.data ?? [],
  };
}

export async function logAudit(userId: string | null, action: string, entityType: string, entityId?: string, metadata?: Record<string, unknown>) {
  const supabase = await createClient();
  if (!supabase) return;
  await supabase.from("audit_logs").insert({ user_id: userId, action, entity_type: entityType, entity_id: entityId, metadata: metadata ?? {} });
}
