import { getPublicSupabase } from "@/lib/supabase/server";
import { getCentenary } from "@/lib/data/community-programme";
import { getBranchNetwork } from "@/lib/data/tipu-branches";
import { branchLocation } from "@/lib/media/tipu-branches";
import { getPublishedEvents } from "@/lib/data/events";

export type EventCategory = "centenary" | "takete-ide-day" | "branch" | "community";

export interface CommunityEvent {
  id: string;
  title: string;
  /** ISO date. Every event needs one to be placed on the timeline. */
  date: string;
  /**
   * Verified start time, e.g. "2:00 PM". Absent for almost everything — the
   * community records dates far more often than times, and inventing one would
   * send people to a field at the wrong hour.
   */
  time?: string;
  venue?: string;
  location?: string;
  category: EventCategory;
  description?: string;
  href: string;
  /** `cancelled` is only ever set from a record that says so. */
  status: "scheduled" | "cancelled";
}

export const EVENT_CATEGORY_LABELS: Record<EventCategory, string> = {
  centenary: "Centenary",
  "takete-ide-day": "Takete-Ide Day",
  branch: "Branch event",
  community: "Community",
};

/** Midnight today, so an event happening today still counts as upcoming. */
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export async function getCommunityEvents(): Promise<CommunityEvent[]> {
  const events: CommunityEvent[] = [];

  const centenary = await getCentenary();
  events.push({
    id: "centenary-2026",
    title: centenary.title,
    date: centenary.eventDate,
    venue: centenary.venue,
    location: "Takete-Ide, Amuro, Kogi State",
    category: "centenary",
    description: centenary.intro,
    href: "/centenary",
    status: "scheduled",
  });

  const supabase = getPublicSupabase();

  let branchUpdates: { id: string; branch_slug: string; title: string; body: string | null; occurs_on: string | null }[] = [];
  if (supabase) {
    const { data } = await supabase
      .from("tipu_branch_updates")
      .select("id, branch_slug, title, body, occurs_on")
      .eq("kind", "event")
      .eq("status", "published")
      .order("occurs_on", { ascending: false });
    if (data) branchUpdates = data;
  }

  const [taketeIdeDays, branches] = await Promise.all([
    getPublishedEvents(),
    getBranchNetwork(),
  ]);

  for (const row of taketeIdeDays) {
    if (!row.event_date) continue;
    events.push({
      id: `event-${row.id}`,
      title: `Takete-Ide Day ${row.year}`,
      date: row.event_date,
      category: "takete-ide-day",
      description: row.description ?? row.theme ?? undefined,
      href: `/takete-ide-day/${row.year}`,
      status: "scheduled",
    });
  }

  const branchBySlug = new Map(branches.map((b) => [b.slug, b]));
  for (const row of branchUpdates) {
    if (!row.occurs_on) continue;
    const branch = branchBySlug.get(row.branch_slug);
    events.push({
      id: `branch-event-${row.id}`,
      title: row.title,
      date: row.occurs_on,
      category: "branch",
      description: row.body ?? undefined,
      location: branch ? branchLocation(branch) : undefined,
      href: branch?.href ?? "/tipu/branches",
      status: "scheduled",
    });
  }

  return sortByDate(events);
}

function sortByDate(events: CommunityEvent[]) {
  return [...events].sort((a, b) => a.date.localeCompare(b.date));
}

/** Upcoming ascending (soonest first); past descending (most recent first). */
export async function getGroupedEvents() {
  const all = await getCommunityEvents();
  const today = todayISO();
  return {
    upcoming: all.filter((e) => e.date >= today),
    past: all.filter((e) => e.date < today).reverse(),
  };
}

/** The single next upcoming event, for surfacing elsewhere on the site. */
export async function getNextEvent(): Promise<CommunityEvent | null> {
  const { upcoming } = await getGroupedEvents();
  return upcoming[0] ?? null;
}
