"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import { logAudit } from "@/lib/data/admin";
import { slugify } from "@/lib/utils";
import { flattenZodError, type AdminFormState } from "@/lib/zod-helpers";

const contentStatuses = ["draft", "pending_review", "verified", "published", "archived"] as const;

const itemSchema = z.object({
  title: z.string().trim().optional(),
  album_id: z.string().trim().optional(),
  image_url: z.string().trim().min(1, "Please upload an image."),
  alt_text: z.string().trim().min(3, "Alt text is required for accessibility."),
  caption: z.string().trim().optional(),
  category: z.string().trim().min(1, "Category is required."),
  event_year: z.string().trim().optional(),
  status: z.enum(contentStatuses),
});

function toRow(data: z.infer<typeof itemSchema>) {
  return {
    title: data.title || null,
    album_id: data.album_id || null,
    image_url: data.image_url,
    alt_text: data.alt_text,
    caption: data.caption || null,
    category: data.category,
    event_year: data.event_year ? Number(data.event_year) : null,
    status: data.status,
  };
}

export async function createGalleryItemAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const user = await requireStaff("media_manager");
  const parsed = itemSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Please fix the errors below.", fieldErrors: flattenZodError(parsed.error) };
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Supabase is not configured." };

  const { data, error } = await supabase.from("gallery_items").insert({ ...toRow(parsed.data), created_by: user.id }).select("id").single();
  if (error || !data) return { status: "error", message: `Could not add photo: ${error?.message ?? "unknown error"}` };

  await logAudit(user.id, "create", "gallery_item", data.id);
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  revalidatePath("/");
  redirect("/admin/gallery");
}

export async function updateGalleryItemAction(id: string, _prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const user = await requireStaff("media_manager");
  const parsed = itemSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Please fix the errors below.", fieldErrors: flattenZodError(parsed.error) };
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Supabase is not configured." };

  const { error } = await supabase.from("gallery_items").update(toRow(parsed.data)).eq("id", id);
  if (error) return { status: "error", message: `Could not update photo: ${error.message}` };

  await logAudit(user.id, "update", "gallery_item", id);
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  redirect("/admin/gallery");
}

export async function deleteGalleryItemAction(id: string) {
  const user = await requireStaff("media_manager");
  const supabase = await createClient();
  if (!supabase) return;
  await supabase.from("gallery_items").delete().eq("id", id);
  await logAudit(user.id, "delete", "gallery_item", id);
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

const albumSchema = z.object({
  title: z.string().trim().min(2, "Title is required."),
  category: z.string().trim().min(2, "Category is required."),
  description: z.string().trim().optional(),
});

export async function createAlbumAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const user = await requireStaff("media_manager");
  const parsed = albumSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Please fix the errors below.", fieldErrors: flattenZodError(parsed.error) };
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Supabase is not configured." };

  const { error } = await supabase.from("albums").insert({
    title: parsed.data.title,
    slug: slugify(parsed.data.title),
    category: parsed.data.category,
    description: parsed.data.description || null,
  });
  if (error) return { status: "error", message: `Could not create album: ${error.message}` };

  await logAudit(user.id, "create", "album", undefined, { title: parsed.data.title });
  revalidatePath("/admin/gallery");
  redirect("/admin/gallery");
}
