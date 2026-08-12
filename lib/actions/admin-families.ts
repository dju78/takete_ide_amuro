"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import { logAudit } from "@/lib/data/admin";
import { slugify } from "@/lib/utils";
import { flattenZodError, type AdminFormState } from "@/lib/zod-helpers";

const verificationStatuses = ["draft", "family_submitted", "oral_history", "documentary_evidence", "community_reviewed", "verified", "disputed"] as const;
const contentStatuses = ["draft", "pending_review", "verified", "published", "archived"] as const;

const familySchema = z.object({
  name: z.string().trim().min(2, "Family name is required."),
  slug: z.string().trim().optional(),
  alternative_names: z.string().trim().optional(),
  compound_id: z.string().trim().optional(),
  summary: z.string().trim().optional(),
  history: z.string().trim().optional(),
  known_ancestral_accounts: z.string().trim().optional(),
  migration_settlement_history: z.string().trim().optional(),
  values_and_traditions: z.string().trim().optional(),
  notable_contributions: z.string().trim().optional(),
  verification_status: z.enum(verificationStatuses),
  status: z.enum(contentStatuses),
});

function toRow(data: z.infer<typeof familySchema>) {
  return {
    name: data.name,
    slug: data.slug || slugify(data.name),
    alternative_names: data.alternative_names ? data.alternative_names.split(",").map((s) => s.trim()).filter(Boolean) : [],
    compound_id: data.compound_id || null,
    summary: data.summary || null,
    history: data.history || null,
    known_ancestral_accounts: data.known_ancestral_accounts || null,
    migration_settlement_history: data.migration_settlement_history || null,
    values_and_traditions: data.values_and_traditions || null,
    notable_contributions: data.notable_contributions || null,
    verification_status: data.verification_status,
    status: data.status,
  };
}

export async function createFamilyAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const user = await requireStaff("historian");
  const parsed = familySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Please fix the errors below.", fieldErrors: flattenZodError(parsed.error) };
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Supabase is not configured." };

  const { data, error } = await supabase.from("families").insert({ ...toRow(parsed.data), created_by: user.id }).select("id").single();
  if (error || !data) return { status: "error", message: `Could not create family: ${error?.message ?? "unknown error"}` };

  await logAudit(user.id, "create", "family", data.id, { name: parsed.data.name });
  revalidatePath("/admin/families");
  revalidatePath("/families");
  redirect("/admin/families");
}

export async function updateFamilyAction(id: string, _prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const user = await requireStaff("historian");
  const parsed = familySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Please fix the errors below.", fieldErrors: flattenZodError(parsed.error) };
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Supabase is not configured." };

  const { error } = await supabase.from("families").update(toRow(parsed.data)).eq("id", id);
  if (error) return { status: "error", message: `Could not update family: ${error.message}` };

  await logAudit(user.id, "update", "family", id);
  revalidatePath("/admin/families");
  revalidatePath("/families");
  redirect("/admin/families");
}

export async function deleteFamilyAction(id: string) {
  const user = await requireStaff("historian");
  const supabase = await createClient();
  if (!supabase) return;
  await supabase.from("families").delete().eq("id", id);
  await logAudit(user.id, "delete", "family", id);
  revalidatePath("/admin/families");
  revalidatePath("/families");
}
