"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import { logAudit } from "@/lib/data/admin";
import { revalidateOrikiPaths } from "@/lib/revalidation";
import { flattenZodError, type AdminFormState } from "@/lib/zod-helpers";

const orikiRecordSchema = z.object({
  family_origin: z.string().trim().min(1, "Family/origin is required."),
  male_oriki: z.string().trim().min(1, "Male Oríkì is required."),
  female_oriki: z.string().trim().min(1, "Female Oríkì is required."),
  notes: z.string().trim().optional(),
  display_order: z.coerce.number().default(0),
  published: z.string().optional(),
});

export async function createOrikiRecordAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const user = await requireStaff("historian");
  const parsed = orikiRecordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: flattenZodError(parsed.error) };
  }
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Supabase is not configured." };

  const { data, error } = await supabase
    .from("oriki_records")
    .insert({
      family_origin: parsed.data.family_origin,
      male_oriki: parsed.data.male_oriki,
      female_oriki: parsed.data.female_oriki,
      notes: parsed.data.notes || null,
      display_order: parsed.data.display_order,
      published: parsed.data.published === "on" || parsed.data.published === "true",
      updated_by: user.id,
    })
    .select("id")
    .single();

  if (error || !data) return { status: "error", message: `Could not create Oríkì record: ${error?.message ?? "unknown error"}` };

  await logAudit(user.id, "create", "oriki_record", data.id, { family: parsed.data.family_origin });
  revalidateOrikiPaths();
  redirect("/admin/oriki");
}

export async function updateOrikiRecordAction(id: string, _prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const user = await requireStaff("historian");
  const parsed = orikiRecordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: flattenZodError(parsed.error) };
  }
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Supabase is not configured." };

  const { error } = await supabase
    .from("oriki_records")
    .update({
      family_origin: parsed.data.family_origin,
      male_oriki: parsed.data.male_oriki,
      female_oriki: parsed.data.female_oriki,
      notes: parsed.data.notes || null,
      display_order: parsed.data.display_order,
      published: parsed.data.published === "on" || parsed.data.published === "true",
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { status: "error", message: `Could not update Oríkì record: ${error.message}` };

  await logAudit(user.id, "update", "oriki_record", id, { family: parsed.data.family_origin });
  revalidateOrikiPaths();
  redirect("/admin/oriki");
}

export async function deleteOrikiRecordAction(id: string) {
  const user = await requireStaff("historian");
  const supabase = await createClient();
  if (!supabase) return;

  await supabase.from("oriki_records").delete().eq("id", id);
  await logAudit(user.id, "delete", "oriki_record", id);
  revalidateOrikiPaths();
}

export async function togglePublishOrikiRecordAction(id: string, currentPublished: boolean) {
  const user = await requireStaff("historian");
  const supabase = await createClient();
  if (!supabase) return;

  await supabase
    .from("oriki_records")
    .update({
      published: !currentPublished,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  await logAudit(user.id, "update", "oriki_record", id, { published: !currentPublished });
  revalidateOrikiPaths();
}
