"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import { logAudit } from "@/lib/data/admin";

const allowedTables = new Set([
  "contact_messages",
  "diaspora_members",
  "volunteer_submissions",
  "community_profile_nominations",
  "heritage_submissions",
]);

export async function updateInboxStatusAction(table: string, id: string, statusColumn: string, formData: FormData) {
  if (!allowedTables.has(table)) throw new Error("Unknown inbox table");
  const user = await requireStaff("editor");
  const status = String(formData.get(statusColumn));

  const supabase = await createClient();
  if (!supabase) return;
  await supabase.from(table).update({ [statusColumn]: status }).eq("id", id);
  await logAudit(user.id, "status_change", table, id, { [statusColumn]: status });
  revalidatePath(`/admin/${table}`);
}
