/**
 * Canonical gallery categories — the single source of truth shared by the
 * public gallery filters, the community-media registry and the admin forms,
 * so the three can never drift into near-duplicate spellings ("Community" vs
 * "Community Life", "Events" vs "Culture & Events").
 *
 * Names already in use by seeded albums / existing gallery rows are kept
 * verbatim; new categories were added rather than renaming anything, so no
 * existing gallery record is orphaned.
 */
export const GALLERY_CATEGORIES = [
  "Nature",
  "Landmarks",
  "Places of Worship",
  "Community Life",
  "Culture & Events",
  "Takete-Ide Day",
  "Centenary",
  "TIPU",
  "Diaspora",
  "Development",
  "Traditional Institution",
  "Children & Cultural Heritage",
  "People",
  "Education",
  "Historical Archive",
  "History",
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

/** Sort key for a category name, so filter chips always appear in a stable, sensible order. */
export function categoryOrder(category: string): number {
  const i = (GALLERY_CATEGORIES as readonly string[]).indexOf(category);
  return i === -1 ? GALLERY_CATEGORIES.length : i;
}
