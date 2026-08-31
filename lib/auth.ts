import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/content";

export interface StaffUser {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
}

export const roleRank: Record<UserRole, number> = {
  media_manager: 1,
  project_manager: 1,
  historian: 1,
  // A treasurer's authority is financial, not editorial: ranked with the other
  // specialists so the role grants no extra reach over ordinary content.
  treasurer: 1,
  editor: 2,
  administrator: 3,
  super_admin: 4,
};

/** Roles permitted to change public financial information. */
export const FINANCIAL_ROLES: UserRole[] = ["super_admin", "treasurer"];

/**
 * Resolves the active Takete role for a given user id from app_memberships.
 * Returns null if the user has no active Takete membership (e.g. Kogi Quest user or suspended user).
 */
export async function getTaketeRole(userId: string): Promise<UserRole | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data: membership } = await supabase
    .from("app_memberships")
    .select("role, status")
    .eq("user_id", userId)
    .eq("app_key", "takete")
    .eq("status", "active")
    .maybeSingle();

  if (!membership || !membership.role) return null;
  return membership.role as UserRole;
}

/** Redirects to /admin/login if not authenticated as active Takete staff. Use at the top of every admin page/layout. */
export async function requireStaff(minRole: UserRole = "editor"): Promise<StaffUser> {
  const supabase = await createClient();
  if (!supabase) redirect("/admin/login?error=not_configured");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle();

  const { data: membership } = await supabase
    .from("app_memberships")
    .select("role, status")
    .eq("user_id", user.id)
    .eq("app_key", "takete")
    .eq("status", "active")
    .maybeSingle();

  if (!membership || !membership.role) {
    redirect("/admin/login?error=no_membership");
  }

  const role = membership.role as UserRole;

  if (roleRank[role] < roleRank[minRole]) {
    redirect("/admin?error=insufficient_role");
  }

  return { id: user.id, email: user.email ?? "", full_name: profile?.full_name ?? null, role };
}

/**
 * The lowest rank that must be able to reach a financial screen.
 *
 * A treasurer is a specialist, ranked with the other specialists rather than
 * above an editor, because the role carries no editorial authority. That makes
 * any rank floor above a treasurer's the wrong gate for financial screens — it
 * would exclude the one role they exist for. Naming the floor after the role
 * keeps the two in step if the ranking is ever revised.
 */
export const FINANCIAL_MIN_ROLE: UserRole = "treasurer";

/**
 * Gate for screens that change publicly displayed financial information — the
 * union's contribution account above all.
 *
 * Authorization here is the conjunction the shared database enforces in
 * is_takete_financial_staff(): an authenticated user, holding an *active*
 * membership for app_key 'takete', whose role is in FINANCIAL_ROLES. The first
 * three come from requireStaff, which resolves app_memberships and admits
 * nobody without one — so a Kogi Quest user, or a suspended Takete treasurer,
 * never reaches the role test. The fourth is checked here.
 *
 * Membership, not rank, is the test. Rank would be wrong in both directions: an
 * administrator outranks a treasurer editorially and still must not touch
 * banking details, and a treasurer ranks below an editor and must.
 */
export async function requireFinancialAdmin(): Promise<StaffUser> {
  const user = await requireStaff(FINANCIAL_MIN_ROLE);
  if (!FINANCIAL_ROLES.includes(user.role)) {
    redirect("/admin?error=financial_role_required");
  }
  return user;
}

/** Whether a signed-in user may edit financial information. */
export function isFinancialAdmin(role: UserRole) {
  return FINANCIAL_ROLES.includes(role);
}
