"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import { logAudit } from "@/lib/data/admin";
import type { UserRole } from "@/types/content";

const validRoles: UserRole[] = ["super_admin", "administrator", "editor", "historian", "project_manager", "media_manager"];

export async function updateUserRoleAction(userId: string, formData: FormData) {
  const staff = await requireStaff("super_admin");
  const role = String(formData.get("role"));
  if (!validRoles.includes(role as UserRole)) return;

  const supabase = await createClient();
  if (!supabase) return;
  await supabase.from("profiles").update({ role }).eq("id", userId);
  await logAudit(staff.id, "role_change", "profile", userId, { newRole: role });
  revalidatePath("/admin/users");
}
