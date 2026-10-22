import { getPublicSupabase } from "@/lib/supabase/server";
import { LIVE_BROADCAST_CONFIG } from "@/lib/live/broadcast-config";
import { validateBroadcast, type LiveBroadcastInput, type ValidationResult } from "@/lib/live/broadcast";

/**
 * Active /live configuration.
 *
 * Starts from the checked-in file (lib/live/broadcast-config.ts) and, when the
 * optional `live_broadcast_settings` row exists, lets the administrator's saved
 * values override it. If the table has not been created yet, or Supabase is
 * unavailable, the file configuration is used unchanged — the page never fails
 * because of configuration.
 */
export async function getLiveBroadcastWithIssues(): Promise<ValidationResult & { databaseAvailable: boolean }> {
  const supabase = getPublicSupabase();
  if (!supabase) return { ...validateBroadcast(LIVE_BROADCAST_CONFIG, "file"), databaseAvailable: false };

  const { data, error } = await supabase.from("live_broadcast_settings").select("*").eq("id", true).maybeSingle();
  if (error) return { ...validateBroadcast(LIVE_BROADCAST_CONFIG, "file"), databaseAvailable: false };
  if (!data) return { ...validateBroadcast(LIVE_BROADCAST_CONFIG, "file"), databaseAvailable: true };

  const input: LiveBroadcastInput = {
    title: data.title,
    videoId: data.video_id,
    status: data.status,
    statusMessage: data.status_message,
    scheduledStart: data.scheduled_start,
    chatEnabled: data.chat_enabled,
    youtubeUrl: data.youtube_url || LIVE_BROADCAST_CONFIG.youtubeUrl,
    facebookUrl: data.facebook_url,
    instagramUrl: data.instagram_url,
    tiktokUrl: data.tiktok_url,
    replays: Array.isArray(data.replays) ? data.replays : [],
    updatedAt: data.updated_at,
  };
  return { ...validateBroadcast(input, "database"), databaseAvailable: true };
}

export async function getLiveBroadcast() {
  return (await getLiveBroadcastWithIssues()).broadcast;
}
