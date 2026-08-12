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

const orikiSchema = z.object({
  title: z.string().trim().min(2, "Title is required."),
  slug: z.string().trim().optional(),
  family_id: z.string().trim().optional(),
  compound_id: z.string().trim().optional(),
  language: z.string().trim().min(1, "Language is required."),
  original_text: z.string().trim().min(5, "The original Oríkì text is required."),
  transliteration: z.string().trim().optional(),
  english_interpretation: z.string().trim().optional(),
  cultural_notes: z.string().trim().optional(),
  performer: z.string().trim().optional(),
  recording_date: z.string().trim().optional(),
  source: z.string().trim().optional(),
  contributor: z.string().trim().optional(),
  copyright_notes: z.string().trim().optional(),
  audio_url: z.string().trim().optional(),
  video_url: z.string().trim().optional(),
  verification_status: z.enum(verificationStatuses),
  status: z.enum(contentStatuses),
  consent_confirmed: z.string().optional(),
  consent_notes: z.string().trim().optional(),
  publication_permission: z.string().optional(),
});

async function syncMedia(supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>, orikiId: string, audioUrl?: string, videoUrl?: string) {
  await supabase.from("oriki_media").delete().eq("oriki_id", orikiId);
  const rows = [];
  if (audioUrl) rows.push({ oriki_id: orikiId, media_type: "audio", url: audioUrl });
  if (videoUrl) rows.push({ oriki_id: orikiId, media_type: "video", url: videoUrl });
  if (rows.length > 0) await supabase.from("oriki_media").insert(rows);
}

export async function createOrikiAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const user = await requireStaff("historian");
  const parsed = orikiSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Please fix the errors below.", fieldErrors: flattenZodError(parsed.error) };
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Supabase is not configured." };

  const { data, error } = await supabase
    .from("oriki")
    .insert({
      title: parsed.data.title,
      slug: parsed.data.slug || slugify(parsed.data.title),
      family_id: parsed.data.family_id || null,
      compound_id: parsed.data.compound_id || null,
      language: parsed.data.language,
      original_text: parsed.data.original_text,
      transliteration: parsed.data.transliteration || null,
      english_interpretation: parsed.data.english_interpretation || null,
      cultural_notes: parsed.data.cultural_notes || null,
      performer: parsed.data.performer || null,
      recording_date: parsed.data.recording_date || null,
      source: parsed.data.source || null,
      contributor: parsed.data.contributor || null,
      copyright_notes: parsed.data.copyright_notes || null,
      verification_status: parsed.data.verification_status,
      status: parsed.data.status,
      consent_confirmed: parsed.data.consent_confirmed === "on",
      consent_notes: parsed.data.consent_notes || null,
      publication_permission: parsed.data.publication_permission === "on",
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error || !data) return { status: "error", message: `Could not create Oríkì: ${error?.message ?? "unknown error"}` };

  await syncMedia(supabase, data.id, parsed.data.audio_url, parsed.data.video_url);
  await logAudit(user.id, "create", "oriki", data.id, { title: parsed.data.title });
  revalidatePath("/admin/families");
  revalidatePath("/oriki");
  redirect("/admin/families");
}

export async function updateOrikiAction(id: string, _prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const user = await requireStaff("historian");
  const parsed = orikiSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Please fix the errors below.", fieldErrors: flattenZodError(parsed.error) };
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Supabase is not configured." };

  const { error } = await supabase
    .from("oriki")
    .update({
      title: parsed.data.title,
      slug: parsed.data.slug || slugify(parsed.data.title),
      family_id: parsed.data.family_id || null,
      compound_id: parsed.data.compound_id || null,
      language: parsed.data.language,
      original_text: parsed.data.original_text,
      transliteration: parsed.data.transliteration || null,
      english_interpretation: parsed.data.english_interpretation || null,
      cultural_notes: parsed.data.cultural_notes || null,
      performer: parsed.data.performer || null,
      recording_date: parsed.data.recording_date || null,
      source: parsed.data.source || null,
      contributor: parsed.data.contributor || null,
      copyright_notes: parsed.data.copyright_notes || null,
      verification_status: parsed.data.verification_status,
      status: parsed.data.status,
      consent_confirmed: parsed.data.consent_confirmed === "on",
      consent_notes: parsed.data.consent_notes || null,
      publication_permission: parsed.data.publication_permission === "on",
    })
    .eq("id", id);

  if (error) return { status: "error", message: `Could not update Oríkì: ${error.message}` };

  await syncMedia(supabase, id, parsed.data.audio_url, parsed.data.video_url);
  await logAudit(user.id, "update", "oriki", id);
  revalidatePath("/admin/families");
  revalidatePath("/oriki");
  redirect("/admin/families");
}

export async function deleteOrikiAction(id: string) {
  const user = await requireStaff("historian");
  const supabase = await createClient();
  if (!supabase) return;
  await supabase.from("oriki").delete().eq("id", id);
  await logAudit(user.id, "delete", "oriki", id);
  revalidatePath("/admin/families");
  revalidatePath("/oriki");
}
