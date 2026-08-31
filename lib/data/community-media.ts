import { createClient } from "@/lib/supabase/server";
import { communityMedia, type CommunityMediaItem } from "@/lib/media/community-media";
import { categoryOrder } from "@/lib/media/gallery-categories";
import type { GalleryItem } from "@/types/content";

/**
 * A registry item after editor overrides have been applied, plus the extra
 * `verifiedNames` field that only ever comes from an editor (never from code —
 * nobody is named on the strength of what a photograph appears to show).
 */
export interface ResolvedMediaItem extends CommunityMediaItem {
  verifiedNames?: string;
}

interface OverrideRow {
  media_key: string;
  title: string | null;
  description: string | null;
  alt_text: string | null;
  category: string | null;
  event_label: string | null;
  branch: string | null;
  event_date: string | null;
  event_period: string | null;
  location: string | null;
  featured: boolean | null;
  published: boolean | null;
  verified_names: string | null;
  verification_status: CommunityMediaItem["verificationStatus"] | null;
  verification_note: string | null;
}

/** NULL in an override column means "no override" — fall back to the baseline. */
function merge(base: CommunityMediaItem, o: OverrideRow | undefined): ResolvedMediaItem {
  if (!o) return base;
  return {
    ...base,
    title: o.title ?? base.title,
    description: o.description ?? base.description,
    altText: o.alt_text ?? base.altText,
    category: (o.category as CommunityMediaItem["category"]) ?? base.category,
    event: o.event_label ?? base.event,
    branch: o.branch ?? base.branch,
    eventDate: o.event_date ?? base.eventDate,
    eventPeriod: o.event_period ?? base.eventPeriod,
    location: o.location ?? base.location,
    featured: o.featured ?? base.featured,
    published: o.published ?? base.published,
    verificationStatus: o.verification_status ?? base.verificationStatus,
    verificationNote: o.verification_note ?? base.verificationNote,
    verifiedNames: o.verified_names ?? undefined,
  };
}

async function fetchOverrides(): Promise<Map<string, OverrideRow>> {
  const supabase = await createClient();
  if (!supabase) return new Map();
  const { data, error } = await supabase.from("community_media_overrides").select("*");
  if (error || !data) return new Map();
  return new Map((data as OverrideRow[]).map((row) => [row.media_key, row]));
}

export interface MediaFilter {
  /** Restrict to one event (use the EVENTS constants). */
  event?: string;
  category?: string;
  mediaType?: "image" | "video";
  featuredOnly?: boolean;
  /** Include unpublished items — admin only. */
  includeUnpublished?: boolean;
}

/** All community media matching `filter`, with editor overrides applied. */
export async function getCommunityMedia(filter: MediaFilter = {}): Promise<ResolvedMediaItem[]> {
  const overrides = await fetchOverrides();
  return communityMedia
    .map((item) => merge(item, overrides.get(item.id)))
    .filter((item) => {
      if (!filter.includeUnpublished && !item.published) return false;
      if (filter.event && item.event !== filter.event) return false;
      if (filter.category && item.category !== filter.category) return false;
      if (filter.mediaType && item.mediaType !== filter.mediaType) return false;
      if (filter.featuredOnly && !item.featured) return false;
      return true;
    });
}

/** One item by its stable registry id, with editor overrides applied. */
export async function getCommunityMediaItem(id: string): Promise<ResolvedMediaItem | null> {
  const overrides = await fetchOverrides();
  const base = communityMedia.find((m) => m.id === id);
  return base ? merge(base, overrides.get(id)) : null;
}

/**
 * Published community media mapped into the shared GalleryItem shape, so the
 * existing gallery grid, filters and lightbox render it without a second
 * code path. Videos are excluded — the lightbox is an image viewer, and each
 * video already has a proper player on its story page.
 */
export async function getCommunityGalleryItems(category?: string): Promise<GalleryItem[]> {
  const items = await getCommunityMedia({ category, mediaType: "image" });
  return items.map((m) => ({
    id: `community-media:${m.id}`,
    title: m.title,
    image_url: m.src,
    alt_text: m.altText,
    caption: m.description,
    category: m.category,
    event_year: m.eventDate ? Number(m.eventDate.slice(0, 4)) : null,
    object_position: m.objectPosition,
    is_placeholder: m.isPlaceholder,
    placeholder_title: m.title,
    placeholder_subtitle: m.description,
  }));
}

/** Every category that actually has at least one published image, in canonical order. */
export async function getCommunityMediaCategories(): Promise<string[]> {
  const items = await getCommunityMedia({ mediaType: "image" });
  return [...new Set(items.map((m) => m.category))].sort((a, b) => categoryOrder(a) - categoryOrder(b));
}

/** Human-readable date for a media item: exact day where known, otherwise the recorded period. */
export function mediaDateLabel(item: Pick<CommunityMediaItem, "eventDate" | "eventPeriod">): string | null {
  if (item.eventDate) {
    return new Date(item.eventDate).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
  return item.eventPeriod ?? null;
}
