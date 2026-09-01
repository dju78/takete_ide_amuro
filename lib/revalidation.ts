import { revalidatePath } from "next/cache";

/**
 * Centralised route revalidation for Admin actions.
 * Ensures every public and admin page consuming mutated data is refreshed.
 */

export function revalidateCentenaryPaths() {
  const paths = [
    "/",
    "/centenary",
    "/events",
    "/takete-ide-day",
    "/tipu",
    "/admin/centenary",
  ];
  for (const p of paths) revalidatePath(p);
}

export function revalidateEventPaths(year?: number | string) {
  const paths = [
    "/",
    "/events",
    "/takete-ide-day",
    "/admin/events",
    "/centenary",
  ];
  if (year) {
    paths.push(`/takete-ide-day/${year}`);
  }
  for (const p of paths) revalidatePath(p);
}

export function revalidateGalleryPaths() {
  const paths = [
    "/",
    "/gallery",
    "/centenary",
    "/takete-ide-day",
    "/heritage",
    "/development",
    "/development/community-at-work",
    "/diaspora",
    "/diaspora/uk-europe",
    "/tipu/branches",
    "/admin/gallery",
    "/admin/community-media",
  ];
  for (const p of paths) revalidatePath(p);
}

export function revalidateNewsPaths(slug?: string) {
  const paths = [
    "/",
    "/news",
    "/admin/news",
    "/tipu",
    "/centenary",
  ];
  if (slug) {
    paths.push(`/news/${slug}`);
  }
  for (const p of paths) revalidatePath(p);
}

export function revalidateProjectPaths(slug?: string) {
  const paths = [
    "/",
    "/development",
    "/admin/projects",
    "/get-involved",
  ];
  if (slug) {
    paths.push(`/development/projects/${slug}`);
  }
  for (const p of paths) revalidatePath(p);
}

export function revalidateTipuPaths(branchSlug?: string) {
  const paths = [
    "/",
    "/tipu",
    "/tipu/branches",
    "/diaspora",
    "/admin/tipu",
    "/admin/tipu/branches",
  ];
  if (branchSlug) {
    paths.push(`/tipu/branches/${branchSlug}`);
  }
  for (const p of paths) revalidatePath(p);
}

export function revalidateInstitutionPaths() {
  const paths = [
    "/",
    "/heritage",
    "/heritage/traditional-institution",
    "/admin/traditional-institution",
  ];
  for (const p of paths) revalidatePath(p);
}

export function revalidateSupportPaths() {
  const paths = [
    "/",
    "/support",
    "/get-involved",
    "/admin/support",
    "/admin/centenary",
  ];
  for (const p of paths) revalidatePath(p);
}

export function revalidateFamilyPaths(slug?: string) {
  const paths = [
    "/families",
    "/families/compounds",
    "/admin/families",
  ];
  if (slug) {
    paths.push(`/families/${slug}`);
  }
  for (const p of paths) revalidatePath(p);
}

export function revalidatePeoplePaths(slug?: string) {
  const paths = [
    "/our-people",
    "/heritage/traditional-institution",
    "/admin/people",
  ];
  if (slug) {
    paths.push(`/our-people/${slug}`);
  }
  for (const p of paths) revalidatePath(p);
}

export function revalidateArchivePaths(slug?: string) {
  const paths = [
    "/archive",
    "/archive/oral-history",
    "/admin/archive",
    "/admin/oral-history",
  ];
  if (slug) {
    paths.push(`/archive/${slug}`);
  }
  for (const p of paths) revalidatePath(p);
}
