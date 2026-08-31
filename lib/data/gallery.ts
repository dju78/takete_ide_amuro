import { createClient } from "@/lib/supabase/server";
import {
  getCommunityGalleryItems,
  getCommunityMedia,
  getCommunityMediaCategories,
  type ResolvedMediaItem,
} from "@/lib/data/community-media";
import { categoryOrder } from "@/lib/media/gallery-categories";
import { HOMEPAGE_MEDIA_ORDER, HOMEPAGE_PLACE_ORDER } from "@/lib/media/community-media";
import type { GalleryItem } from "@/types/content";

/**
 * The gallery draws on two sources and always has:
 *  1. `gallery_items` — everything uploaded through the admin interface.
 *  2. The checked-in community media library (lib/media/community-media.ts),
 *     which ships with the app so the gallery is populated even before a
 *     Supabase project is connected.
 * Admin-uploaded rows come first (they are the most recently curated); imported
 * archive media follows. Neither source can displace the other.
 */
async function getDbGalleryItems(options?: { category?: string; year?: number }): Promise<GalleryItem[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  let query = supabase.from("gallery_items").select("*").eq("status", "published").order("created_at", { ascending: false });
  if (options?.category) query = query.eq("category", options.category);
  if (options?.year) query = query.eq("event_year", options.year);
  const { data, error } = await query;
  if (error || !data) return [];
  return data;
}

export async function getGalleryItems(options?: { category?: string; year?: number }): Promise<GalleryItem[]> {
  const [dbItems, communityItems] = await Promise.all([
    getDbGalleryItems(options),
    getCommunityGalleryItems(options?.category),
  ]);
  const filtered = options?.year
    ? communityItems.filter((i) => i.event_year === options.year)
    : communityItems;
  return [...dbItems, ...filtered];
}

export async function getGalleryHighlights(limit = 8): Promise<GalleryItem[]> {
  const supabase = await createClient();
  const dbItems = supabase
    ? ((
        await supabase
          .from("gallery_items")
          .select("*")
          .eq("status", "published")
          .order("created_at", { ascending: false })
          .limit(limit)
      ).data ?? [])
    : [];
  if (dbItems.length >= limit) return dbItems;
  const communityItems = await getCommunityGalleryItems();
  return [...dbItems, ...communityItems].slice(0, limit);
}

export async function getGalleryCategories(): Promise<string[]> {
  const supabase = await createClient();
  const [albumCategories, communityCategories] = await Promise.all([
    supabase
      ? supabase.from("albums").select("category").order("category").then(({ data }) => (data ?? []).map((a) => a.category))
      : Promise.resolve([] as string[]),
    getCommunityMediaCategories(),
  ]);
  return [...new Set([...albumCategories, ...communityCategories])].sort(
    (a, b) => categoryOrder(a) - categoryOrder(b) || a.localeCompare(b),
  );
}

/** Ranks ids by their position in `order`; anything unlisted sorts last. */
function ranker(order: readonly string[]) {
  return (id: string) => {
    const i = order.indexOf(id);
    return i === -1 ? order.length : i;
  };
}

function toGalleryItem(m: ResolvedMediaItem): GalleryItem {
  return {
    id: m.id,
    title: m.title,
    image_url: m.src,
    alt_text: m.altText,
    caption: m.description,
    category: m.category,
    event_year: m.eventDate ? Number(m.eventDate.slice(0, 4)) : null,
  };
}

/**
 * The homepage photo strip — a small, deliberately curated mix rather than
 * "the most recent eight photographs". Excludes whatever the place section
 * above it is already showing, so nothing appears twice on one page. See
 * HOMEPAGE_MEDIA_ORDER for the reasoning. Falls back to the general highlights
 * if an editor unfeatures everything.
 */
export async function getHomepageGallery(): Promise<GalleryItem[]> {
  const featured = await getCommunityMedia({ featuredOnly: true, mediaType: "image" });
  const place = new Set<string>(HOMEPAGE_PLACE_ORDER);
  const strip = featured.filter((m) => !place.has(m.id));
  if (strip.length === 0) return getGalleryHighlights(6);

  const rank = ranker(HOMEPAGE_MEDIA_ORDER);
  return strip.sort((a, b) => rank(a.id) - rank(b.id)).map(toGalleryItem);
}

/** The three place photographs that lead the homepage, in their intended order. */
export async function getHomepagePlaceMedia(): Promise<ResolvedMediaItem[]> {
  const featured = await getCommunityMedia({ featuredOnly: true, mediaType: "image" });
  const rank = ranker(HOMEPAGE_PLACE_ORDER);
  return featured
    .filter((m) => (HOMEPAGE_PLACE_ORDER as readonly string[]).includes(m.id))
    .sort((a, b) => rank(a.id) - rank(b.id));
}
