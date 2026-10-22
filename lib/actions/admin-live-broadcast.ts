"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import { logAudit } from "@/lib/data/admin";
import {
  isBroadcastStatus,
  lagosLocalToInstant,
  parseReplayLines,
  validateBroadcast,
  type LiveBroadcastInput,
} from "@/lib/live/broadcast";
import type { AdminFormState } from "@/lib/zod-helpers";

/**
 * Saves the /live configuration. Editors and above may change it, so the
 * broadcast team can switch status on event day without a super administrator.
 *
 * Every value passes through the same validator the public page uses; anything
 * that is not a public viewing link (stream keys, RTMP addresses, Studio or
 * Live Producer links) is refused rather than silently stored.
 */

const str = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

export async function saveLiveBroadcastAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const user = await requireStaff("editor");
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Supabase is not configured." };

  const status = str(formData, "status");
  if (!isBroadcastStatus(status)) {
    return { status: "error", message: "Choose a valid status.", fieldErrors: { status: "Choose a valid status." } };
  }

  const scheduledLocal = str(formData, "scheduled_start");
  const scheduledStart = lagosLocalToInstant(scheduledLocal);
  if (scheduledLocal && !scheduledStart) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: { scheduled_start: "Enter a valid date and time." } };
  }

  const input: LiveBroadcastInput = {
    title: str(formData, "title"),
    videoId: str(formData, "video_id"),
    status,
    statusMessage: str(formData, "status_message"),
    scheduledStart,
    chatEnabled: formData.get("chat_enabled") === "on",
    youtubeUrl: str(formData, "youtube_url"),
    facebookUrl: str(formData, "facebook_url"),
    instagramUrl: str(formData, "instagram_url"),
    tiktokUrl: str(formData, "tiktok_url"),
    replays: parseReplayLines(str(formData, "replays")),
  };

  const { broadcast, issues } = validateBroadcast(input, "database");
  if (issues.length > 0) {
    return { status: "error", message: `Nothing was saved. ${issues.join(" ")}` };
  }

  const row = {
    id: true,
    title: broadcast.title,
    video_id: broadcast.videoId,
    status: broadcast.status,
    status_message: broadcast.statusMessage,
    scheduled_start: broadcast.scheduledStart,
    chat_enabled: broadcast.chatEnabled,
    youtube_url: input.youtubeUrl ? broadcast.links.youtube : null,
    facebook_url: broadcast.links.facebook,
    instagram_url: broadcast.links.instagram,
    tiktok_url: broadcast.links.tiktok,
    replays: broadcast.replays.map((r) => ({
      id: r.id,
      title: r.title,
      dayNumber: r.dayNumber,
      video: r.videoId ?? r.url,
    })),
    updated_by: user.id,
    updated_at: new Date().toISOString(),
  };

  const { data: previous } = await supabase
    .from("live_broadcast_settings")
    .select("video_id, status, facebook_url")
    .eq("id", true)
    .maybeSingle();

  const { error } = await supabase.from("live_broadcast_settings").upsert(row);
  if (error) {
    const missing = /relation .* does not exist|could not find the table/i.test(error.message);
    return {
      status: "error",
      message: missing
        ? "The live broadcast table has not been created yet. Apply supabase/migrations/0028_live_broadcast_settings.sql, or edit lib/live/broadcast-config.ts instead."
        : `Could not save: ${error.message}`,
    };
  }

  await logAudit(user.id, "update", "live_broadcast", undefined, {
    previous,
    next: { video_id: row.video_id, status: row.status, facebook_url: row.facebook_url },
    changed_by_role: user.role,
  });

  revalidatePath("/live");
  revalidatePath("/admin/live");
  return { status: "idle", message: `Saved. Status is now “${broadcast.status}”. Open viewers update within about a minute.` };
}
