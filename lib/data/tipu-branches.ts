import { createClient } from "@/lib/supabase/server";
import {
  tipuBranches,
  GROUP_ORDER,
  HOMEPAGE_BRANCH_ORDER,
  DEFAULT_BRANCH_DESCRIPTION,
  branchLocation,
  type BranchGroup,
  type BranchSeed,
  type BranchStatus,
  type BranchVerification,
} from "@/lib/media/tipu-branches";

/** A branch after editor changes have been merged over the shipped baseline. */
export interface ResolvedBranch extends BranchSeed {
  /** True when there is no authentic photograph and the card renders a placeholder. */
  needsPlaceholder: boolean;
  /** Assembled location line — city, state and country, minus whatever is unknown. */
  location: string;
}

export interface BranchUpdate {
  id: string;
  branch_slug: string;
  kind: "news" | "event";
  title: string;
  body: string | null;
  occurs_on: string | null;
}

interface BranchRow {
  id: string;
  slug: string | null;
  name: string;
  short_name: string | null;
  region: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  description: string | null;
  branch_group: BranchGroup | null;
  acronym: string | null;
  image_url: string | null;
  image_alt: string | null;
  established_label: string | null;
  status: BranchStatus | null;
  verification: BranchVerification | null;
  source_note: string | null;
  status_note: string | null;
  is_active: boolean | null;
  is_featured: boolean | null;
  has_dedicated_page: boolean | null;
  dedicated_page_href: string | null;
  sort_order: number | null;
}

/** NULL / empty in a database column means "no override" — keep the baseline value. */
function pick<T>(override: T | null | undefined, base: T | undefined): T | undefined {
  if (override === null || override === undefined) return base;
  if (typeof override === "string" && override.trim() === "") return base;
  return override;
}

function merge(base: BranchSeed, row: BranchRow | undefined): BranchSeed {
  if (!row) return base;
  const href = row.has_dedicated_page === false ? undefined : pick(row.dedicated_page_href, base.href);
  // `is_active` predates `status`; an editor unticking "active" on an older row
  // must still take effect.
  const status = pick(row.status, base.status)!;
  return {
    ...base,
    name: pick(row.name, base.name)!,
    shortName: pick(row.short_name, base.shortName)!,
    group: pick(row.branch_group, base.group)!,
    city: pick(row.city ?? row.region, base.city),
    state: pick(row.state, base.state),
    country: pick(row.country, base.country),
    acronym: pick(row.acronym, base.acronym)!,
    description: pick(row.description, base.description)!,
    status: row.is_active === false && status === "active" ? "inactive" : status,
    verification: pick(row.verification, base.verification)!,
    sourceNote: pick(row.source_note, base.sourceNote)!,
    statusNote: pick(row.status_note, base.statusNote),
    image: pick(row.image_url, base.image),
    imageAlt: pick(row.image_alt, base.imageAlt),
    href,
    establishedLabel: pick(row.established_label, base.establishedLabel),
    featured: row.is_featured ?? base.featured,
    sortOrder: row.sort_order ?? base.sortOrder,
  };
}

/** A branch an administrator created that the shipped baseline knows nothing about. */
function fromRow(row: BranchRow): BranchSeed {
  const name = row.name;
  return {
    slug: row.slug ?? row.id,
    name,
    shortName: row.short_name ?? name.replace(/^TIPU\s+/i, "").replace(/\s+Branch$/i, ""),
    group: row.branch_group ?? "nigeria",
    city: row.city ?? row.region ?? undefined,
    state: row.state ?? undefined,
    country: row.country ?? undefined,
    acronym: row.acronym ?? name.replace(/^TIPU\s+/i, "").slice(0, 2).toUpperCase(),
    description: row.description ?? DEFAULT_BRANCH_DESCRIPTION,
    status: row.status ?? (row.is_active === false ? "inactive" : "active"),
    verification: row.verification ?? "pending-verification",
    sourceNote: row.source_note ?? "Added through the admin area.",
    statusNote: row.status_note ?? undefined,
    image: row.image_url ?? undefined,
    imageAlt: row.image_alt ?? undefined,
    href: row.has_dedicated_page ? (row.dedicated_page_href ?? undefined) : undefined,
    establishedLabel: row.established_label ?? undefined,
    featured: row.is_featured ?? false,
    sortOrder: row.sort_order ?? 999,
  };
}

async function fetchRows(): Promise<BranchRow[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("tipu_branches").select("*");
  if (error || !data) return [];
  return data as BranchRow[];
}

function resolve(seed: BranchSeed): ResolvedBranch {
  return { ...seed, needsPlaceholder: !seed.image, location: branchLocation(seed) };
}

/**
 * Every branch in the network, baseline merged with editor changes, sorted
 * within each group. Branches are never filtered out for lacking a photograph —
 * that is what the placeholder is for. Inactive branches are hidden by default;
 * `forming` ones are not, because they are part of the growing network.
 */
export async function getBranchNetwork(options?: { includeInactive?: boolean }): Promise<ResolvedBranch[]> {
  const rows = await fetchRows();
  const bySlug = new Map(rows.filter((r) => r.slug).map((r) => [r.slug as string, r]));
  const knownSlugs = new Set(tipuBranches.map((b) => b.slug));

  const merged = tipuBranches.map((seed) => merge(seed, bySlug.get(seed.slug)));
  const extras = rows.filter((r) => !r.slug || !knownSlugs.has(r.slug)).map(fromRow);

  return [...merged, ...extras]
    .filter((b) => options?.includeInactive || b.status !== "inactive")
    .sort(
      (a, b) =>
        GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group) ||
        a.sortOrder - b.sortOrder ||
        a.name.localeCompare(b.name),
    )
    .map(resolve);
}

/** The network grouped for the network page, with empty groups dropped. */
export async function getBranchNetworkByGroup(): Promise<{ group: BranchGroup; branches: ResolvedBranch[] }[]> {
  const branches = await getBranchNetwork();
  return GROUP_ORDER.map((group) => ({ group, branches: branches.filter((b) => b.group === group) })).filter(
    (g) => g.branches.length > 0,
  );
}

/** One branch by slug, for a dedicated branch page. */
export async function getBranch(slug: string): Promise<ResolvedBranch | null> {
  const branches = await getBranchNetwork({ includeInactive: true });
  return branches.find((b) => b.slug === slug) ?? null;
}

/** The compact homepage strip: featured branches, home first. */
export async function getFeaturedBranches(): Promise<ResolvedBranch[]> {
  const branches = await getBranchNetwork();
  const order = HOMEPAGE_BRANCH_ORDER as readonly string[];
  const rank = (slug: string) => {
    const i = order.indexOf(slug);
    return i === -1 ? order.length : i;
  };
  return branches.filter((b) => b.featured).sort((a, b) => rank(a.slug) - rank(b.slug));
}

/**
 * Published news and events per branch, keyed by slug. Returns an empty map with
 * no database, which simply means cards fall back to the baseline activity text.
 */
export async function getBranchUpdates(): Promise<Map<string, BranchUpdate[]>> {
  const supabase = await createClient();
  if (!supabase) return new Map();
  const { data, error } = await supabase
    .from("tipu_branch_updates")
    .select("*")
    .eq("status", "published")
    .order("occurs_on", { ascending: false });
  if (error || !data) return new Map();

  const map = new Map<string, BranchUpdate[]>();
  for (const row of data as BranchUpdate[]) {
    const list = map.get(row.branch_slug) ?? [];
    list.push(row);
    map.set(row.branch_slug, list);
  }
  return map;
}

/** Latest published news item and next upcoming event for a branch, if any. */
export function summariseUpdates(updates: BranchUpdate[] | undefined) {
  if (!updates || updates.length === 0) return { latest: undefined, upcoming: undefined };
  const today = new Date().toISOString().slice(0, 10);
  const latest = updates.find((u) => u.kind === "news");
  const upcoming = updates
    .filter((u) => u.kind === "event" && (!u.occurs_on || u.occurs_on >= today))
    .sort((a, b) => (a.occurs_on ?? "").localeCompare(b.occurs_on ?? ""))[0];
  return { latest, upcoming };
}
