import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import type { ResolvedMediaItem } from "@/lib/data/community-media";
import type { GalleryItem } from "@/types/content";

/**
 * Renders community-media images through the same grid + lightbox the main
 * gallery uses, so keyboard navigation, focus handling and captions behave
 * identically wherever photographs appear.
 */
export function MediaGallery({
  items,
  variant = "editorial",
  columns,
}: {
  items: ResolvedMediaItem[];
  variant?: "grid" | "editorial";
  columns?: 3 | 4;
}) {
  const images: GalleryItem[] = items
    .filter((m) => m.mediaType === "image")
    .map((m) => ({
      id: m.id,
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

  return <GalleryLightbox items={images} variant={variant} columns={columns} />;
}
