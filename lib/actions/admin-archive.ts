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
  "photograph", "programme", "church_record", "school_record", "document", "constitution",
  "meeting_minutes", "oral_history", "map", "newspaper_report", "video", "audio", "biography", "publication",
] as const;
const verificationStatuses = ["unverified", "oral_history", "community_tradition", "documentary_evidence", "verified", "disputed"] as const;
const contentStatuses = ["draft", "pending_review", "verified", "published", "archived"] as const;
const accessLevels = ["public", "community", "admin_only"] as const;

const schema = z.object({
  title: z.string().trim().min(2, "Title is required."),
  slug: z.string().trim().optional(),
  description: z.string().trim().optional(),
  item_date: z.string().trim().optional(),
  is_approximate_date: z.string().optional(),
  category: z.enum(categories),
  contributor: z.string().trim().optional(),
  rights_notes: z.string().trim().optional(),
  tags: z.string().trim().optional(),
  file_url: z.string().trim().optional(),
  thumbnail_url: z.string().trim().optional(),
  access_level: z.enum(accessLevels),
  verification_status: z.enum(verificationStatuses),
  status: z.enum(contentStatuses),
});

function toRow(data: z.infer<typeof schema>) {
  return {
    title: data.title,
    slug: data.slug || slugify(data.title),
    description: data.description || null,
    item_date: data.item_date || null,
    is_approximate_date: data.is_approximate_date === "on",
    category: data.category,
    contributor: data.contributor || null,
    rights_notes: data.rights_notes || null,
    tags: data.tags ? data.tags.split(",").map((s) => s.trim()).filter(Boolean) : [],
    file_url: data.file_url || null,
    thumbnail_url: data.thumbnail_url || null,
    access_level: data.access_level,
    verification_status: data.verification_status,
    status: data.status,
  };
}

export async function createArchiveItemAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const user = await requireStaff("historian");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Please fix the errors below.", fieldErrors: flattenZodError(parsed.error) };
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Supabase is not configured." };

  const { data, error } = await supabase.from("archive_items").insert({ ...toRow(parsed.data), created_by: user.id }).select("id").single();
  if (error || !data) return { status: "error", message: `Could not create item: ${error?.message ?? "unknown error"}` };

  await logAudit(user.id, "create", "archive_item", data.id, { title: parsed.data.title });
  revalidatePath("/admin/archive");
  revalidatePath("/archive");
  redirect("/admin/archive");
}

export async function updateArchiveItemAction(id: string, _prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const user = await requireStaff("historian");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Please fix the errors below.", fieldErrors: flattenZodError(parsed.error) };
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Supabase is not configured." };

  const { error } = await supabase.from("archive_items").update(toRow(parsed.data)).eq("id", id);
  if (error) return { status: "error", message: `Could not update item: ${error.message}` };

  await logAudit(user.id, "update", "archive_item", id);
  revalidatePath("/admin/archive");
  revalidatePath("/archive");
  redirect("/admin/archive");
}

export async function deleteArchiveItemAction(id: string) {
  const user = await requireStaff("historian");
  const supabase = await createClient();
  if (!supabase) return;
  await supabase.from("archive_items").delete().eq("id", id);
  await logAudit(user.id, "delete", "archive_item", id);
  revalidatePath("/admin/archive");
  revalidatePath("/archive");
}
