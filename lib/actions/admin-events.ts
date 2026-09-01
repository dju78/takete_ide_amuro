"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import { logAudit } from "@/lib/data/admin";
import { slugify } from "@/lib/utils";
import { revalidateEventPaths } from "@/lib/revalidation";
import { flattenZodError, type AdminFormState } from "@/lib/zod-helpers";

const contentStatuses = ["draft", "pending_review", "verified", "published", "archived"] as const;

const eventSchema = z.object({
  year: z.coerce.number().int().min(1900).max(2200),
  theme: z.string().trim().optional(),
  event_date: z.string().trim().optional(),
  description: z.string().trim().optional(),
  chairman: z.string().trim().optional(),
  guest_information: z.string().trim().optional(),
  programme_document_url: z.string().trim().optional(),
  status: z.enum(contentStatuses),
});

function toRow(data: z.infer<typeof eventSchema>) {
  return {
    year: data.year,
    slug: slugify(String(data.year)),
    theme: data.theme || null,
    event_date: data.event_date || null,
    description: data.description || null,
    chairman: data.chairman || null,
    guest_information: data.guest_information || null,
    programme_document_url: data.programme_document_url || null,
    status: data.status,
  };
}

export async function createEventAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const user = await requireStaff("editor");
  const parsed = eventSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Please fix the errors below.", fieldErrors: flattenZodError(parsed.error) };
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Supabase is not configured." };

  const { data, error } = await supabase.from("events").insert({ ...toRow(parsed.data), created_by: user.id }).select("id").single();
  if (error || !data) return { status: "error", message: `Could not create event: ${error?.message ?? "unknown error"}` };

  await logAudit(user.id, "create", "event", data.id, { year: parsed.data.year });
  revalidateEventPaths(parsed.data.year);
  redirect("/admin/events");
}

export async function updateEventAction(id: string, _prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const user = await requireStaff("editor");
  const parsed = eventSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Please fix the errors below.", fieldErrors: flattenZodError(parsed.error) };
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Supabase is not configured." };

  const { error } = await supabase.from("events").update(toRow(parsed.data)).eq("id", id);
  if (error) return { status: "error", message: `Could not update event: ${error.message}` };

  await logAudit(user.id, "update", "event", id);
  revalidateEventPaths(parsed.data.year);
  redirect("/admin/events");
}

export async function deleteEventAction(id: string) {
  const user = await requireStaff("editor");
  const supabase = await createClient();
  if (!supabase) return;
  await supabase.from("events").delete().eq("id", id);
  await logAudit(user.id, "delete", "event", id);
  revalidateEventPaths();
}

const mediaSchema = z.object({
  media_type: z.enum(["photo", "video"]),
  url: z.string().trim().min(1, "Please upload a file."),
  caption: z.string().trim().optional(),
});

export async function addEventMediaAction(eventId: string, _prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const user = await requireStaff("editor");
  const parsed = mediaSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Please fix the errors below.", fieldErrors: flattenZodError(parsed.error) };
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Supabase is not configured." };

  await supabase.from("event_media").insert({
    event_id: eventId,
    media_type: parsed.data.media_type,
    url: parsed.data.url,
    caption: parsed.data.caption || null,
  });

  await logAudit(user.id, "create", "event_media", eventId);
  revalidatePath(`/admin/events/${eventId}/edit`);
  revalidateEventPaths();
  return { status: "idle" };
}

export async function deleteEventMediaAction(eventId: string, mediaId: string) {
  const user = await requireStaff("editor");
  const supabase = await createClient();
  if (!supabase) return;
  await supabase.from("event_media").delete().eq("id", mediaId);
  await logAudit(user.id, "delete", "event_media", mediaId);
  revalidatePath(`/admin/events/${eventId}/edit`);
  revalidateEventPaths();
}
