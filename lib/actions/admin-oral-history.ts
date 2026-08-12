"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import { logAudit } from "@/lib/data/admin";
import { flattenZodError, type AdminFormState } from "@/lib/zod-helpers";

const verificationStatuses = ["unverified", "oral_history", "community_tradition", "documentary_evidence", "verified", "disputed"] as const;
const contentStatuses = ["draft", "pending_review", "verified", "published", "archived"] as const;

const schema = z.object({
  interviewee: z.string().trim().min(2, "Interviewee name is required."),
  interviewer: z.string().trim().optional(),
  interview_date: z.string().trim().optional(),
  photo_url: z.string().trim().optional(),
  audio_url: z.string().trim().optional(),
  video_url: z.string().trim().optional(),
  transcript: z.string().trim().optional(),
  summary: z.string().trim().optional(),
  topics: z.string().trim().optional(),
  verification_notes: z.string().trim().optional(),
  consent_confirmed: z.string().optional(),
  verification_status: z.enum(verificationStatuses),
  status: z.enum(contentStatuses),
});

function toRow(data: z.infer<typeof schema>) {
  return {
    interviewee: data.interviewee,
    interviewer: data.interviewer || null,
    interview_date: data.interview_date || null,
    photo_url: data.photo_url || null,
    audio_url: data.audio_url || null,
    video_url: data.video_url || null,
    transcript: data.transcript || null,
    summary: data.summary || null,
    topics: data.topics ? data.topics.split(",").map((s) => s.trim()).filter(Boolean) : [],
    verification_notes: data.verification_notes || null,
    consent_confirmed: data.consent_confirmed === "on",
    verification_status: data.verification_status,
    status: data.status,
  };
}

export async function createOralHistoryAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const user = await requireStaff("historian");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Please fix the errors below.", fieldErrors: flattenZodError(parsed.error) };
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Supabase is not configured." };

  if (!parsed.data.consent_confirmed) {
    return { status: "error", message: "Consent must be confirmed before an oral history can be recorded." };
  }

  const { data, error } = await supabase.from("oral_histories").insert({ ...toRow(parsed.data), created_by: user.id }).select("id").single();
  if (error || !data) return { status: "error", message: `Could not create record: ${error?.message ?? "unknown error"}` };

  await logAudit(user.id, "create", "oral_history", data.id, { interviewee: parsed.data.interviewee });
  revalidatePath("/admin/oral-history");
  revalidatePath("/archive/oral-history");
  redirect("/admin/oral-history");
}

export async function updateOralHistoryAction(id: string, _prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const user = await requireStaff("historian");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Please fix the errors below.", fieldErrors: flattenZodError(parsed.error) };
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Supabase is not configured." };

  const { error } = await supabase.from("oral_histories").update(toRow(parsed.data)).eq("id", id);
  if (error) return { status: "error", message: `Could not update record: ${error.message}` };

  await logAudit(user.id, "update", "oral_history", id);
  revalidatePath("/admin/oral-history");
  revalidatePath("/archive/oral-history");
  redirect("/admin/oral-history");
}

export async function deleteOralHistoryAction(id: string) {
  const user = await requireStaff("historian");
  const supabase = await createClient();
  if (!supabase) return;
  await supabase.from("oral_histories").delete().eq("id", id);
  await logAudit(user.id, "delete", "oral_history", id);
  revalidatePath("/admin/oral-history");
  revalidatePath("/archive/oral-history");
}
