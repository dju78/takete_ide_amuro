"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import { logAudit } from "@/lib/data/admin";
import { flattenZodError, type AdminFormState } from "@/lib/zod-helpers";

const verificationStatuses = ["unverified", "oral_history", "community_tradition", "documentary_evidence", "verified", "disputed"] as const;

const rulerSchema = z.object({
  full_name: z.string().trim().min(2, "Name is required."),
  regnal_title: z.string().trim().min(2, "Regnal title is required."),
  reign_start: z.string().trim().optional(),
  reign_end: z.string().trim().optional(),
  is_current: z.string().optional(),
  biography: z.string().trim().optional(),
  photo_url: z.string().trim().optional(),
  verification_status: z.enum(verificationStatuses),
  sort_order: z.coerce.number().default(0),
});

function rulerRow(data: z.infer<typeof rulerSchema>) {
  return {
    full_name: data.full_name,
    regnal_title: data.regnal_title,
    reign_start: data.reign_start || null,
    reign_end: data.reign_end || null,
    is_current: data.is_current === "on",
    biography: data.biography || null,
    photo_url: data.photo_url || null,
    verification_status: data.verification_status,
    sort_order: data.sort_order,
  };
}

export async function createRulerAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const user = await requireStaff("historian");
  const parsed = rulerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Please fix the errors below.", fieldErrors: flattenZodError(parsed.error) };
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Supabase is not configured." };

  const { data, error } = await supabase.from("traditional_rulers").insert(rulerRow(parsed.data)).select("id").single();
  if (error || !data) return { status: "error", message: `Could not create: ${error?.message ?? "unknown error"}` };

  await logAudit(user.id, "create", "traditional_ruler", data.id, { full_name: parsed.data.full_name });
  revalidatePath("/admin/traditional-institution");
  revalidatePath("/heritage/traditional-institution");
  redirect("/admin/traditional-institution");
}

export async function updateRulerAction(id: string, _prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const user = await requireStaff("historian");
  const parsed = rulerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Please fix the errors below.", fieldErrors: flattenZodError(parsed.error) };
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Supabase is not configured." };

  const { error } = await supabase.from("traditional_rulers").update(rulerRow(parsed.data)).eq("id", id);
  if (error) return { status: "error", message: `Could not update: ${error.message}` };

  await logAudit(user.id, "update", "traditional_ruler", id);
  revalidatePath("/admin/traditional-institution");
  revalidatePath("/heritage/traditional-institution");
  redirect("/admin/traditional-institution");
}

export async function deleteRulerAction(id: string) {
  const user = await requireStaff("historian");
  const supabase = await createClient();
  if (!supabase) return;
  await supabase.from("traditional_rulers").delete().eq("id", id);
  await logAudit(user.id, "delete", "traditional_ruler", id);
  revalidatePath("/admin/traditional-institution");
  revalidatePath("/heritage/traditional-institution");
}

const councilSchema = z.object({
  full_name: z.string().trim().min(2, "Name is required."),
  title: z.string().trim().min(2, "Title is required."),
  responsibilities: z.string().trim().optional(),
  photo_url: z.string().trim().optional(),
  sort_order: z.coerce.number().default(0),
});

export async function createCouncilMemberAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const user = await requireStaff("historian");
  const parsed = councilSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Please fix the errors below.", fieldErrors: flattenZodError(parsed.error) };
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Supabase is not configured." };

  const { error } = await supabase.from("traditional_council_members").insert({
    full_name: parsed.data.full_name,
    title: parsed.data.title,
    responsibilities: parsed.data.responsibilities || null,
    photo_url: parsed.data.photo_url || null,
    sort_order: parsed.data.sort_order,
  });
  if (error) return { status: "error", message: `Could not create: ${error.message}` };

  await logAudit(user.id, "create", "traditional_council_member", undefined, { full_name: parsed.data.full_name });
  revalidatePath("/admin/traditional-institution");
  revalidatePath("/heritage/traditional-institution");
  redirect("/admin/traditional-institution");
}

export async function deleteCouncilMemberAction(id: string) {
  const user = await requireStaff("historian");
  const supabase = await createClient();
  if (!supabase) return;
  await supabase.from("traditional_council_members").delete().eq("id", id);
  await logAudit(user.id, "delete", "traditional_council_member", id);
  revalidatePath("/admin/traditional-institution");
  revalidatePath("/heritage/traditional-institution");
}
