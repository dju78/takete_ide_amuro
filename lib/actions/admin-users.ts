"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import { logAudit } from "@/lib/data/admin";
import type { UserRole } from "@/types/content";

const validRoles: UserRole[] = [
  "super_admin",
  "administrator",
  "treasurer",
  "editor",
  "historian",
  "project_manager",
  "media_manager",
];

export async function updateUserRoleAction(userId: string, formData: FormData) {
  const staff = await requireStaff("super_admin");
  const role = String(formData.get("role"));
  if (!validRoles.includes(role as UserRole)) return;

  const supabase = await createClient();
  if (!supabase) return;
  await supabase
    .from("app_memberships")
    .upsert(
      { user_id: userId, app_key: "takete", role: role as UserRole, status: "active" },
      { onConflict: "user_id,app_key" }
    );
  await logAudit(staff.id, "role_change", "app_membership", userId, { app_key: "takete", newRole: role });
  revalidatePath("/admin/users");
}
