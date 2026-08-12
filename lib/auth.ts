import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/content";

export interface StaffUser {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
}

const roleRank: Record<UserRole, number> = {
  media_manager: 1,
  project_manager: 1,
  historian: 1,
  editor: 2,
  administrator: 3,
  super_admin: 4,
};

/** Redirects to /admin/login if not authenticated as staff. Use at the top of every admin page/layout. */
export async function requireStaff(minRole: UserRole = "editor"): Promise<StaffUser> {
  const supabase = await createClient();
  if (!supabase) redirect("/admin/login?error=not_configured");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase.from("profiles").select("full_name, role").eq("id", user.id).maybeSingle();
  if (!profile) redirect("/admin/login?error=no_profile");

  if (roleRank[profile.role as UserRole] < roleRank[minRole]) {
    redirect("/admin?error=insufficient_role");
  }

  return { id: user.id, email: user.email ?? "", full_name: profile.full_name, role: profile.role as UserRole };
}
