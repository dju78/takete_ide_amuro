"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import { logAudit } from "@/lib/data/admin";
import { findCommunityMedia } from "@/lib/media/community-media";
import { GALLERY_CATEGORIES } from "@/lib/media/gallery-categories";
import { flattenZodError, type AdminFormState } from "@/lib/zod-helpers";

/**
 * Editor overrides for the checked-in community media library.
 *
 * The files and their baseline metadata ship with the application, so nothing
 * here can break the site if the database is empty. What this does is let an
 * editor correct a caption, move an item between categories, add names once the
 * community has verified them, or take an item off the public site — none of
 * which should require a deploy.
 *
 * An empty string in any field means "clear the override, go back to the
 * baseline", which is why every column is stored as NULL rather than ''.
 */
const overrideSchema = z.object({
  title: z.string().trim().optional(),
  description: z.string().trim().optional(),
  alt_text: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || v.length >= 3, "Alt text should describe the image for screen readers."),
  category: z.enum(GALLERY_CATEGORIES).or(z.literal("")).optional(),
  event_label: z.string().trim().optional(),
  branch: z.string().trim().optional(),
  event_date: z.string().trim().optional(),
  event_period: z.string().trim().optional(),
  location: z.string().trim().optional(),
  verified_names: z.string().trim().optional(),
  verification_status: z
    .enum(["verified", "community-record", "pending-verification"])
    .or(z.literal(""))
    .optional(),
  verification_note: z.string().trim().optional(),
  featured: z.string().optional(),
  published: z.string().optional(),
});

/** "" -> null, so a cleared field falls back to the registry baseline. */
const orNull = (v: string | undefined) => (v && v.length > 0 ? v : null);

export async function updateCommunityMediaAction(
  id: string,
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const user = await requireStaff("media_manager");

  if (!findCommunityMedia(id)) {
    return { status: "error", message: "That media item does not exist." };
  }

  const parsed = overrideSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: flattenZodError(parsed.error) };
  }
  const d = parsed.data;

  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Supabase is not configured." };

  const { error } = await supabase.from("community_media_overrides").upsert(
    {
      media_key: id,
      title: orNull(d.title),
      description: orNull(d.description),
      alt_text: orNull(d.alt_text),
      category: orNull(d.category),
      event_label: orNull(d.event_label),
      branch: orNull(d.branch),
      event_date: orNull(d.event_date),
      event_period: orNull(d.event_period),
      location: orNull(d.location),
      verified_names: orNull(d.verified_names),
      verification_status: orNull(d.verification_status),
      verification_note: orNull(d.verification_note),
      // Checkboxes are absent from the payload when unticked.
      featured: d.featured === "on",
      published: d.published === "on",
      updated_by: user.id,
    },
    { onConflict: "media_key" },
  );
  if (error) return { status: "error", message: `Could not save changes: ${error.message}` };

  await logAudit(user.id, "update", "community_media", id);
  revalidateCommunityMediaPaths();
  redirect("/admin/community-media");
}

/** Drops every override for an item, restoring the shipped baseline metadata. */
export async function resetCommunityMediaAction(id: string) {
  const user = await requireStaff("media_manager");
  const supabase = await createClient();
  if (!supabase) return;
  await supabase.from("community_media_overrides").delete().eq("media_key", id);
  await logAudit(user.id, "delete", "community_media_override", id);
  revalidateCommunityMediaPaths();
}

/** Every route that renders community media, so an edit shows up everywhere at once. */
function revalidateCommunityMediaPaths() {
  for (const path of [
    "/admin/community-media",
    "/",
    "/gallery",
    "/tipu/branches",
    "/tipu/branches/lokoja",
    "/tipu/branches/ilorin",
    "/diaspora",
    "/diaspora/uk-europe",
    "/takete-ide-day",
    "/takete-ide-day/cultural-attire",
    "/centenary",
    "/development",
    "/development/community-at-work",
  ]) {
    revalidatePath(path);
  }
}
