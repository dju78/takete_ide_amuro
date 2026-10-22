import type { LiveBroadcastInput } from "@/lib/live/broadcast";

/**
 * Checked-in baseline for the /live page.
 *
 * This file is PUBLIC (it is committed to Git and shipped to the site). Only put
 * public viewing information here: a YouTube video ID and public watch/page
 * links. NEVER put stream keys, RTMP addresses, passwords, access tokens or
 * YouTube Studio / Facebook Live Producer links in this file — the validator
 * rejects them, but they would still be visible in Git history.
 *
 * When the `live_broadcast_settings` table exists (migration 0028), values an
 * administrator saves at /admin/live take precedence over this file and apply
 * within about a minute without a redeploy. Changing this file requires a
 * commit and a Netlify deploy. See docs/LIVE_BROADCAST_RUNBOOK.md.
 *
 * Unconfirmed items are deliberately left empty: the page shows honest
 * fallback text rather than invented times, links or video IDs.
 */
export const LIVE_BROADCAST_CONFIG: LiveBroadcastInput = {
  title: "Takete-Ide Centenary Celebration — Live",

  // 11-character ID (or full public link) of the scheduled YouTube live event.
  // Leave empty until the event has been created in YouTube Studio.
  videoId: "",

  // "scheduled" | "live" | "interrupted" | "ended" — set manually by the operator.
  status: "scheduled",
  statusMessage: "",

  // Only set once confirmed, with the Lagos offset, e.g. "2026-10-31T10:00:00+01:00".
  scheduledStart: "",

  chatEnabled: true,

  // Official public channel (confirmed). Facebook/Instagram/TikTok stay empty
  // until the owner supplies the official public page addresses.
  youtubeUrl: "https://www.youtube.com/channel/UCsLauLD7WlDBneUhDxl2VRw",
  facebookUrl: "",
  instagramUrl: "",
  tiktokUrl: "",

  // Replays: { title, dayNumber: 1 | 2 | 3, video: YouTube ID/link or public Facebook video link }
  replays: [],
};
