"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import { logAudit } from "@/lib/data/admin";
import { slugify } from "@/lib/utils";
import { flattenZodError, type AdminFormState } from "@/lib/zod-helpers";

const schoolTypes = ["public", "community", "mission", "private"] as const;
const schoolLevels = ["primary", "secondary", "vocational", "nursery_primary"] as const;
const verificationStatuses = [
  "unverified",
  "oral_history",
  "community_tradition",
  "documentary_evidence",
  "verified",
  "community_record",
  "disputed",
] as const;

const schema = z.object({
  name: z.string().trim().min(2, "School name is required."),
  slug: z.string().trim().optional(),
  school_type: z.enum(schoolTypes),
  level: z.enum(schoolLevels),
  location: z.string().trim().optional(),
  year_established: z.string().trim().optional(),
  historical_description: z.string().trim().optional(),
  current_head: z.string().trim().optional(),
  approximate_enrolment: z.string().trim().optional(),
  facilities: z.string().trim().optional(), // Comma or newline separated
  community_needs: z.string().trim().optional(), // Comma or newline separated
  current_projects: z.string().trim().optional(), // Comma or newline separated
  source_title: z.string().trim().optional(),
  source_author: z.string().trim().optional(),
  source_date: z.string().trim().optional(),
  verified_by: z.string().trim().optional(),
  last_verified_at: z.string().trim().optional(),
  verification_status: z.enum(verificationStatuses),
  display_order: z.string().trim().optional(),
});

function numOrNull(v?: string) {
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function parseList(v?: string): string[] {
  if (!v) return [];
  return v
    .split(/\r?\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function toRow(data: z.infer<typeof schema>) {
  return {
    name: data.name,
    slug: data.slug || slugify(data.name),
    school_type: data.school_type,
    level: data.level,
    location: data.location || "Takete-Ide",
    year_established: numOrNull(data.year_established),
    historical_description: data.historical_description || null,
    current_head: data.current_head || null,
    approximate_enrolment: numOrNull(data.approximate_enrolment),
    facilities: parseList(data.facilities),
    community_needs: parseList(data.community_needs),
    current_projects: parseList(data.current_projects),
    source_title: data.source_title || null,
    source_author: data.source_author || null,
    source_date: data.source_date || null,
    verified_by: data.verified_by || null,
    last_verified_at: data.last_verified_at || null,
    verification_status: data.verification_status,
    display_order: numOrNull(data.display_order) ?? 0,
    status: "published",
  };
}

export async function createSchoolAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const user = await requireStaff("editor");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: flattenZodError(parsed.error) };
  }
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Supabase is not configured." };

  const { data, error } = await supabase.from("schools").insert({ ...toRow(parsed.data) }).select("id").single();
  if (error || !data) {
    return { status: "error", message: `Could not create school: ${error?.message ?? "unknown error"}` };
  }

  await logAudit(user.id, "create", "school", data.id, { name: parsed.data.name });
  revalidatePath("/education");
  revalidatePath("/admin/schools");
  redirect("/admin/schools");
}

export async function updateSchoolAction(id: string, _prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const user = await requireStaff("editor");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: flattenZodError(parsed.error) };
  }
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Supabase is not configured." };

  const { error } = await supabase.from("schools").update(toRow(parsed.data)).eq("id", id);
  if (error) return { status: "error", message: `Could not update school: ${error.message}` };

  await logAudit(user.id, "update", "school", id);
  revalidatePath("/education");
  revalidatePath("/admin/schools");
  redirect("/admin/schools");
}

export async function deleteSchoolAction(id: string) {
  const user = await requireStaff("editor");
  const supabase = await createClient();
  if (!supabase) return;
  await supabase.from("schools").delete().eq("id", id);
  await logAudit(user.id, "delete", "school", id);
  revalidatePath("/education");
  revalidatePath("/admin/schools");
}
