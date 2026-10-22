/**
 * Pure types and validation for the Centenary Live Broadcast Hub (/live).
 *
 * Nothing here talks to the network or the database, so it is safe to import
 * from server code, client components and the Playwright suite alike.
 *
 * Security rule: this module only ever accepts PUBLIC viewing information — a
 * YouTube video ID and public watch/page links. Stream keys, RTMP ingest URLs,
 * YouTube Studio / Facebook Live Producer management links and anything that
 * looks like a credential are rejected, so they cannot reach the public page
 * even if someone pastes one into the configuration by mistake.
 */

import { CANONICAL_SITE_URL } from "@/lib/site-config";

export const EVENT_TIMEZONE = "Africa/Lagos";
export const EVENT_TIMEZONE_LABEL = "West Africa Time (WAT, UTC+1) — Africa/Lagos";
export const EVENT_DATES_LABEL = "29–31 October 2026";

/**
 * Statuses an operator sets by hand. The site never infers "live" from the
 * platform — the YouTube player itself shows YouTube's own verified state.
 */
export const BROADCAST_STATUSES = ["scheduled", "live", "interrupted", "ended"] as const;
export type BroadcastStatus = (typeof BROADCAST_STATUSES)[number];

export const STATUS_LABELS: Record<BroadcastStatus, string> = {
  scheduled: "Scheduled",
  live: "Live now",
  interrupted: "Temporarily interrupted",
  ended: "Broadcast ended",
};

export interface LiveReplay {
  id: string;
  title: string;
  /** 1, 2 or 3 for the three Centenary days; null when not tied to a day. */
  dayNumber: number | null;
  videoId: string | null;
  /** Public YouTube or Facebook link, used when there is no YouTube video ID. */
  url: string | null;
}

export interface PlatformLinks {
  youtube: string;
  facebook: string | null;
  instagram: string | null;
  tiktok: string | null;
}

export interface LiveBroadcast {
  title: string;
  videoId: string | null;
  status: BroadcastStatus;
  /** Optional operator note shown under the status, e.g. "Resuming after the break". */
  statusMessage: string | null;
  /** ISO 8601 instant with offset, e.g. "2026-10-31T10:00:00+01:00". */
  scheduledStart: string | null;
  chatEnabled: boolean;
  links: PlatformLinks;
  replays: LiveReplay[];
  updatedAt: string | null;
  /** Where the active configuration came from — shown to admins only. */
  source: "file" | "database";
}

/** Raw, unvalidated input — from the checked-in file or a database row. */
export interface LiveBroadcastInput {
  title?: string | null;
  videoId?: string | null;
  status?: string | null;
  statusMessage?: string | null;
  scheduledStart?: string | null;
  chatEnabled?: boolean | null;
  youtubeUrl?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  tiktokUrl?: string | null;
  replays?: Array<{
    id?: string | null;
    title?: string | null;
    dayNumber?: number | string | null;
    video?: string | null;
  }> | null;
  updatedAt?: string | null;
}

export const OFFICIAL_YOUTUBE_CHANNEL_URL = "https://www.youtube.com/channel/UCsLauLD7WlDBneUhDxl2VRw";

/**
 * The address people share. Always production — never a Netlify deploy
 * preview or localhost — so forwarded links keep working after the event.
 */
export const LIVE_PAGE_URL = `${CANONICAL_SITE_URL}/live`;
export const DEFAULT_BROADCAST_TITLE = "Takete-Ide Centenary Celebration — Live";

const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

/** Hints that a value is a secret or a management link, never a viewer link. */
const FORBIDDEN_FRAGMENTS = [
  "stream_key",
  "streamkey",
  "stream-key",
  "rtmp",
  "access_token",
  "token=",
  "password",
  "secret",
  "studio.youtube.com",
  "live/producer",
  "business.facebook.com",
  "/live_dashboard",
  "/settings",
  "/login",
  "/dialog/",
  "/adsmanager",
  "/ads/manager",
  "/creatorstudio",
  "/professional_dashboard",
];

function looksSecret(value: string) {
  const lower = value.toLowerCase();
  return FORBIDDEN_FRAGMENTS.some((f) => lower.includes(f));
}

/**
 * Accepts a bare 11-character YouTube video ID or any common public YouTube
 * URL form (watch?v=, youtu.be/, /live/, /embed/, /shorts/) and returns the ID.
 */
export function normaliseVideoId(input: string | null | undefined): string | null {
  if (!input) return null;
  const value = input.trim();
  if (!value || looksSecret(value)) return null;
  if (VIDEO_ID.test(value)) return value;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  const host = url.hostname.toLowerCase().replace(/^(www|m)\./, "");

  let candidate: string | null = null;
  if (host === "youtu.be") {
    candidate = url.pathname.split("/")[1] ?? null;
  } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") candidate = url.searchParams.get("v");
    else {
      const match = url.pathname.match(/^\/(?:live|embed|shorts)\/([^/?#]+)/);
      candidate = match?.[1] ?? null;
    }
  }
  return candidate && VIDEO_ID.test(candidate) ? candidate : null;
}

type Platform = "youtube" | "facebook" | "instagram" | "tiktok";

const PLATFORM_HOSTS: Record<Platform, string[]> = {
  youtube: ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"],
  facebook: ["facebook.com", "www.facebook.com", "m.facebook.com", "web.facebook.com", "fb.watch"],
  instagram: ["instagram.com", "www.instagram.com"],
  tiktok: ["tiktok.com", "www.tiktok.com"],
};

/**
 * Classifies a validated Facebook link so the page can label it honestly:
 * a specific video/live link can say "Watch on Facebook"; a Page or profile
 * address (e.g. https://www.facebook.com/profile.php?id=…) cannot promise a
 * stream is running there.
 */
export function facebookLinkKind(url: string): "video" | "page" {
  try {
    const { hostname, pathname } = new URL(url);
    if (hostname === "fb.watch") return "video";
    if (/\/(videos|watch|live)(\/|$)/i.test(pathname)) return "video";
  } catch {
    // validated upstream; fall through
  }
  return "page";
}

/** Returns the URL only if it is an https public link on the expected platform. */
export function safePublicUrl(input: string | null | undefined, platform: Platform): string | null {
  if (!input) return null;
  const value = input.trim();
  if (!value || looksSecret(value)) return null;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  if (url.username || url.password) return null;
  if (!PLATFORM_HOSTS[platform].includes(url.hostname.toLowerCase())) return null;
  return url.toString();
}

function platformForUrl(value: string): Platform | null {
  for (const p of ["youtube", "facebook"] as const) {
    if (safePublicUrl(value, p)) return p;
  }
  return null;
}

/** Interprets an ISO date-time; requires an explicit offset so it is never ambiguous. */
export function normaliseInstant(input: string | null | undefined): string | null {
  if (!input) return null;
  const value = input.trim();
  if (!/(Z|[+-]\d{2}:\d{2})$/.test(value)) return null;
  const ms = Date.parse(value);
  return Number.isNaN(ms) ? null : new Date(ms).toISOString();
}

/**
 * Converts the admin form's `datetime-local` value (which has no zone) into an
 * instant, treating it as Lagos time. Lagos is UTC+1 all year (no DST).
 */
export function lagosLocalToInstant(local: string | null | undefined): string | null {
  if (!local) return null;
  const value = local.trim();
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(value)) return null;
  return normaliseInstant(`${value.length === 16 ? `${value}:00` : value}+01:00`);
}

/** Inverse of lagosLocalToInstant, for pre-filling the admin form. */
export function instantToLagosLocal(iso: string | null | undefined): string {
  if (!iso) return "";
  const ms = Date.parse(iso);
  if (Number.isNaN(ms)) return "";
  return new Date(ms + 60 * 60 * 1000).toISOString().slice(0, 16);
}

export function isBroadcastStatus(value: unknown): value is BroadcastStatus {
  return typeof value === "string" && (BROADCAST_STATUSES as readonly string[]).includes(value);
}

export interface ValidationResult {
  broadcast: LiveBroadcast;
  /** Human-readable problems with the supplied configuration. Admin-facing only. */
  issues: string[];
}

/**
 * Turns untrusted configuration into a safe LiveBroadcast. Invalid values are
 * dropped (never shown publicly) and reported in `issues` for administrators.
 */
export function validateBroadcast(
  input: LiveBroadcastInput,
  source: LiveBroadcast["source"],
): ValidationResult {
  const issues: string[] = [];

  const videoId = normaliseVideoId(input.videoId);
  if (input.videoId?.trim() && !videoId) {
    issues.push("The YouTube video ID or link is not a valid public YouTube video, so no player is shown.");
  }

  let status: BroadcastStatus = "scheduled";
  if (isBroadcastStatus(input.status)) status = input.status;
  else if (input.status) issues.push(`Unknown status "${input.status}" — treated as "scheduled".`);

  const scheduledStart = normaliseInstant(input.scheduledStart);
  if (input.scheduledStart?.trim() && !scheduledStart) {
    issues.push("The scheduled start time is not a valid date-time with a time zone, so it is hidden.");
  }

  const link = (value: string | null | undefined, platform: Platform, label: string) => {
    const safe = safePublicUrl(value, platform);
    if (value?.trim() && !safe) {
      issues.push(`The ${label} link was rejected: it must be a public https ${label} address, never a stream key or management page.`);
    }
    return safe;
  };

  const links: PlatformLinks = {
    youtube: link(input.youtubeUrl, "youtube", "YouTube") ?? OFFICIAL_YOUTUBE_CHANNEL_URL,
    facebook: link(input.facebookUrl, "facebook", "Facebook"),
    instagram: link(input.instagramUrl, "instagram", "Instagram"),
    tiktok: link(input.tiktokUrl, "tiktok", "TikTok"),
  };

  const replays: LiveReplay[] = [];
  (input.replays ?? []).forEach((r, index) => {
    const title = r?.title?.trim();
    const raw = r?.video?.trim() ?? "";
    if (!title && !raw) return;
    const replayVideoId = normaliseVideoId(raw);
    const url = replayVideoId ? null : platformForUrl(raw) ? raw : null;
    if (!title || (!replayVideoId && !url)) {
      issues.push(`Replay ${index + 1} was skipped: it needs a title and a public YouTube or Facebook link.`);
      return;
    }
    const day = Number(r?.dayNumber);
    replays.push({
      id: r?.id?.trim() || `replay-${index + 1}`,
      title,
      dayNumber: Number.isInteger(day) && day >= 1 && day <= 3 ? day : null,
      videoId: replayVideoId,
      url,
    });
  });

  return {
    broadcast: {
      title: input.title?.trim() || DEFAULT_BROADCAST_TITLE,
      videoId,
      status,
      statusMessage: input.statusMessage?.trim() || null,
      scheduledStart,
      chatEnabled: input.chatEnabled !== false,
      links,
      replays,
      updatedAt: normaliseInstant(input.updatedAt),
      source,
    },
    issues,
  };
}

/** Public watch URL for a video, used for "Watch on YouTube" and chat fallbacks. */
export function youtubeWatchUrl(videoId: string) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

/** Privacy-enhanced embed URL for the player. */
export function youtubeEmbedUrl(videoId: string) {
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`;
}

/**
 * YouTube live-chat embed. `embed_domain` must equal the hostname of the page
 * that hosts the iframe, otherwise YouTube refuses to open the chat — so it is
 * always computed from the real hostname (production or a preview deploy).
 */
export function youtubeChatEmbedUrl(videoId: string, hostname: string) {
  return `https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${encodeURIComponent(hostname)}`;
}

/** Pop-out chat on youtube.com, for when embedding is not possible. */
export function youtubeChatPopoutUrl(videoId: string) {
  return `https://www.youtube.com/live_chat?is_popout=1&v=${videoId}`;
}

/** Whether the embedded chat should be offered for this status. */
export function chatAvailable(b: Pick<LiveBroadcast, "videoId" | "status" | "chatEnabled">) {
  return Boolean(b.videoId) && b.chatEnabled && (b.status === "live" || b.status === "interrupted");
}

/** The shape served to browsers by /api/live/status — never includes `source`. */
export type PublicBroadcast = Omit<LiveBroadcast, "source">;

export function toPublicBroadcast(b: LiveBroadcast): PublicBroadcast {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { source, ...rest } = b;
  return rest;
}

/**
 * Admin replay format, one per line:
 *   "Title | Day (1–3) | YouTube or Facebook link"   or   "Title | link"
 */
export function parseReplayLines(text: string): NonNullable<LiveBroadcastInput["replays"]> {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, i) => {
      const parts = line.split("|").map((p) => p.trim());
      const hasDay = parts.length >= 3;
      return {
        id: `replay-${i + 1}`,
        title: parts[0],
        dayNumber: hasDay && parts[1] ? Number(parts[1]) : null,
        video: hasDay ? parts[2] : (parts[1] ?? ""),
      };
    });
}

/** Inverse of parseReplayLines, for pre-filling the admin form. */
export function formatReplayLines(replays: LiveReplay[]): string {
  return replays
    .map((r) => [r.title, r.dayNumber ?? "", r.videoId ? youtubeWatchUrl(r.videoId) : (r.url ?? "")].join(" | "))
    .join("\n");
}
