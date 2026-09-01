"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import { logAudit } from "@/lib/data/admin";
import { revalidateTipuPaths } from "@/lib/revalidation";
import { flattenZodError, type AdminFormState } from "@/lib/zod-helpers";

const leaderSchema = z.object({
  full_name: z.string().trim().min(2, "Name is required."),
  position: z.string().trim().min(2, "Position is required."),
  branch: z.string().trim().optional(),
  photo_url: z.string().trim().optional(),
  sort_order: z.coerce.number().default(0),
});

export async function createTipuLeaderAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const user = await requireStaff("administrator");
  const parsed = leaderSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Please fix the errors below.", fieldErrors: flattenZodError(parsed.error) };
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Supabase is not configured." };

  const { error } = await supabase.from("tipu_leadership").insert({
    full_name: parsed.data.full_name,
    position: parsed.data.position,
    branch: parsed.data.branch || null,
    photo_url: parsed.data.photo_url || null,
    sort_order: parsed.data.sort_order,
  });
  if (error) return { status: "error", message: `Could not add leader: ${error.message}` };

  await logAudit(user.id, "create", "tipu_leadership", undefined, { full_name: parsed.data.full_name });
  revalidateTipuPaths();
  redirect("/admin/tipu");
}

export async function deleteTipuLeaderAction(id: string) {
  const user = await requireStaff("administrator");
  const supabase = await createClient();
  if (!supabase) return;
  await supabase.from("tipu_leadership").delete().eq("id", id);
  await logAudit(user.id, "delete", "tipu_leadership", id);
  revalidateTipuPaths();
}

const announcementSchema = z.object({
  title: z.string().trim().min(2, "Title is required."),
  body: z.string().trim().optional(),
  status: z.enum(["draft", "pending_review", "verified", "published", "archived"]),
});

export async function createTipuAnnouncementAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const user = await requireStaff("administrator");
  const parsed = announcementSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Please fix the errors below.", fieldErrors: flattenZodError(parsed.error) };
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Supabase is not configured." };

  const { error } = await supabase.from("tipu_announcements").insert({
    title: parsed.data.title,
    body: parsed.data.body || null,
    status: parsed.data.status,
    published_at: parsed.data.status === "published" ? new Date().toISOString() : null,
  });
  if (error) return { status: "error", message: `Could not add announcement: ${error.message}` };

  await logAudit(user.id, "create", "tipu_announcement", undefined, { title: parsed.data.title });
  revalidateTipuPaths();
  redirect("/admin/tipu");
}

export async function deleteTipuAnnouncementAction(id: string) {
  const user = await requireStaff("administrator");
  const supabase = await createClient();
  if (!supabase) return;
  await supabase.from("tipu_announcements").delete().eq("id", id);
  await logAudit(user.id, "delete", "tipu_announcement", id);
  revalidateTipuPaths();
}

const documentSchema = z.object({
  title: z.string().trim().min(2, "Title is required."),
  document_url: z.string().trim().min(1, "Please upload a file."),
  document_type: z.string().trim().optional(),
});

export async function createTipuDocumentAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const user = await requireStaff("administrator");
  const parsed = documentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Please fix the errors below.", fieldErrors: flattenZodError(parsed.error) };
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Supabase is not configured." };

  const { error } = await supabase.from("tipu_documents").insert({
    title: parsed.data.title,
    document_url: parsed.data.document_url,
    document_type: parsed.data.document_type || null,
    published_at: new Date().toISOString().slice(0, 10),
  });
  if (error) return { status: "error", message: `Could not add document: ${error.message}` };

  await logAudit(user.id, "create", "tipu_document", undefined, { title: parsed.data.title });
  revalidateTipuPaths();
  redirect("/admin/tipu");
}

export async function deleteTipuDocumentAction(id: string) {
  const user = await requireStaff("administrator");
  const supabase = await createClient();
  if (!supabase) return;
  await supabase.from("tipu_documents").delete().eq("id", id);
  await logAudit(user.id, "delete", "tipu_document", id);
  revalidateTipuPaths();
}
