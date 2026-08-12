"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import { logAudit } from "@/lib/data/admin";
import { slugify } from "@/lib/utils";
import { flattenZodError, type AdminFormState } from "@/lib/zod-helpers";

const categories = [
  "roads_access", "education", "healthcare", "water", "electricity",
  "civic_infrastructure", "ict_digital", "youth_development",
] as const;
const projectStatuses = ["proposed", "planning", "fundraising", "in_progress", "completed", "on_hold"] as const;
const verificationStatuses = ["unverified", "oral_history", "community_tradition", "documentary_evidence", "verified", "disputed"] as const;

const schema = z.object({
  title: z.string().trim().min(2, "Title is required."),
  slug: z.string().trim().optional(),
  category: z.enum(categories),
  description: z.string().trim().optional(),
  objective: z.string().trim().optional(),
  status: z.enum(projectStatuses),
  location: z.string().trim().optional(),
  start_date: z.string().trim().optional(),
  expected_completion: z.string().trim().optional(),
  budget: z.string().trim().optional(),
  amount_raised: z.string().trim().optional(),
  funding_target: z.string().trim().optional(),
  currency: z.string().trim().default("NGN"),
  funding_source: z.string().trim().optional(),
  responsible_organisation: z.string().trim().optional(),
  verification_status: z.enum(verificationStatuses),
  image_url: z.string().trim().optional(),
});

function numOrNull(v?: string) {
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function toRow(data: z.infer<typeof schema>) {
  return {
    title: data.title,
    slug: data.slug || slugify(data.title),
    category: data.category,
    description: data.description || null,
    objective: data.objective || null,
    status: data.status,
    location: data.location || null,
    start_date: data.start_date || null,
    expected_completion: data.expected_completion || null,
    budget: numOrNull(data.budget),
    amount_raised: numOrNull(data.amount_raised),
    funding_target: numOrNull(data.funding_target),
    currency: data.currency || "NGN",
    funding_source: data.funding_source || null,
    responsible_organisation: data.responsible_organisation || null,
    verification_status: data.verification_status,
  };
}

export async function createProjectAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const user = await requireStaff("project_manager");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Please fix the errors below.", fieldErrors: flattenZodError(parsed.error) };
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Supabase is not configured." };

  const { data, error } = await supabase.from("projects").insert({ ...toRow(parsed.data), created_by: user.id }).select("id").single();
  if (error || !data) return { status: "error", message: `Could not create project: ${error?.message ?? "unknown error"}` };

  if (parsed.data.image_url) {
    await supabase.from("project_images").insert({ project_id: data.id, image_url: parsed.data.image_url, sort_order: 0 });
  }

  await logAudit(user.id, "create", "project", data.id, { title: parsed.data.title });
  revalidatePath("/admin/projects");
  revalidatePath("/development");
  redirect("/admin/projects");
}

export async function updateProjectAction(id: string, _prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const user = await requireStaff("project_manager");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Please fix the errors below.", fieldErrors: flattenZodError(parsed.error) };
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Supabase is not configured." };

  const { error } = await supabase.from("projects").update(toRow(parsed.data)).eq("id", id);
  if (error) return { status: "error", message: `Could not update project: ${error.message}` };

  if (parsed.data.image_url) {
    const { data: existingImages } = await supabase.from("project_images").select("id").eq("project_id", id).limit(1);
    if (!existingImages || existingImages.length === 0) {
      await supabase.from("project_images").insert({ project_id: id, image_url: parsed.data.image_url, sort_order: 0 });
    }
  }

  await logAudit(user.id, "update", "project", id);
  revalidatePath("/admin/projects");
  revalidatePath("/development");
  redirect("/admin/projects");
}

export async function deleteProjectAction(id: string) {
  const user = await requireStaff("project_manager");
  const supabase = await createClient();
  if (!supabase) return;
  await supabase.from("projects").delete().eq("id", id);
  await logAudit(user.id, "delete", "project", id);
  revalidatePath("/admin/projects");
  revalidatePath("/development");
}

const updateSchema = z.object({
  title: z.string().trim().min(2, "Update title is required."),
  body: z.string().trim().optional(),
  update_date: z.string().trim().min(1, "Date is required."),
});

export async function addProjectUpdateAction(projectId: string, _prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const user = await requireStaff("project_manager");
  const parsed = updateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Please fix the errors below.", fieldErrors: flattenZodError(parsed.error) };
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Supabase is not configured." };

  await supabase.from("project_updates").insert({
    project_id: projectId,
    title: parsed.data.title,
    body: parsed.data.body || null,
    update_date: parsed.data.update_date,
    created_by: user.id,
  });

  await logAudit(user.id, "create", "project_update", projectId);
  revalidatePath(`/admin/projects/${projectId}/edit`);
  revalidatePath("/development");
  return { status: "idle" };
}
