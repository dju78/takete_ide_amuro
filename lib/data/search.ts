import { createClient } from "@/lib/supabase/server";
import { getBranchNetwork } from "@/lib/data/tipu-branches";
import { getCommunityMedia } from "@/lib/data/community-media";
import { branchLocation } from "@/lib/media/tipu-branches";
import { CENTENARY } from "@/lib/media/community-programme";

export type SearchType =
  | "news"
  | "event"
  | "branch"
  | "people"
  | "family"
  | "oriki"
  | "archive"
  | "project"
  | "place"
  | "page";

export interface SearchResult {
  id: string;
  type: SearchType;
  title: string;
  excerpt: string | null;
  href: string;
  /** Secondary line — a location, a date, a category. */
  meta?: string | null;
}

export const typeLabels: Record<SearchType, string> = {
  news: "News",
  event: "Events",
  branch: "TIPU Branches",
  people: "Our People",
  family: "Families",
  oriki: "Oríkì",
  archive: "Digital Archive",
  project: "Development",
  place: "Places & Landmarks",
  page: "Pages",
};

/** Order result groups by how likely they are to be what someone meant. */
export const TYPE_ORDER: SearchType[] = [
  "page",
  "branch",
  "news",
  "event",
  "people",
  "family",
  "oriki",
  "place",
  "project",
  "archive",
];

/**
 * Pages worth finding by name. Held in code rather than a table because they
 * are routes, not records — and because it means search still returns something
 * useful when no Supabase project is connected, which is the state the site is
 * normally developed and demoed in.
 */
const PAGE_INDEX: { title: string; href: string; excerpt: string; keywords: string }[] = [
  {
    title: "Takete-Ide Day & Centenary Celebration 2026",
    href: "/centenary",
    excerpt: `Celebrating 100 years of heritage (29–31 October 2026) at ${CENTENARY.venue} — programme schedule, official invitation, dignitaries, guests, hosts and RSVP.`,
    keywords:
      "centenary 100 years anniversary takete-ide day celebration 2026 homecoming festival guests hosts chief launcher chairman of the day lady chairman royal host royal guest special guests rsvp invitation invitation materials ododo karimi faleke abejide olatunji onumoko nasir omole korede mangal olarunisola abubakar asiru idachaba bello jacob owoniyi ibeun michael ebilakun fiki fanwo",
  },
  {
    title: "Support Takete-Ide",
    href: "/support",
    excerpt: "Support community, heritage and development initiatives through the Takete-Ide Progressive Union.",
    keywords: "support donate contribution account bank first bank giving fundraising levy",
  },
  {
    title: "Security Trust Fund",
    href: "/development/security-trust-fund",
    excerpt: "The community security fund raised across the union's branches.",
    keywords: "security trust fund levy safety contribution",
  },
  {
    title: "The TIPU Network",
    href: "/tipu/branches",
    excerpt: "Every branch and chapter of the Takete-Ide Progressive Union, at home and abroad.",
    keywords: "tipu branches network chapters union diaspora",
  },
  {
    title: "Takete-Ide Progressive Union",
    href: "/tipu",
    excerpt: "The community's union organisation — leadership, branches, projects and reports.",
    keywords: "tipu union progressive leadership faith unity progress",
  },
  {
    title: "Our History",
    href: "/our-story",
    excerpt: "Origins, settlement, faith and the making of the community.",
    keywords: "history origins settlement ilu-oke takete-idera amuro-odo igbo ide okeata ileteju odo takete oke adan oke ako pa thomas ode pa george fiki c.1926 1926 present settlement migration timeline story heritage past obasoro eba river owowo river",
  },
  {
    title: "Compounds of Takete-Ide",
    href: "/families/compounds",
    excerpt: "Documented Takete-Ide compounds and their historical family associations from community historical records.",
    keywords: "compounds compound oke-ako ile-nla osikegun oketaro oke-oja ward traditional families",
  },
  {
    title: "Our Families & Oríkì",
    href: "/families",
    excerpt: "Documented Takete-Ide family names, traditional compounds, oral traditions and lineage heritage.",
    keywords: "families family oriki atejaba atejagbo atemayi atemeji atemesami atemeto atemogbe eseyinmeleri eseyintelu oriko lineage praise",
  },
  {
    title: "Traditional Institution",
    href: "/heritage/traditional-institution",
    excerpt: "The Olu’de of Takete-Ide Amuro, the traditional council, and the community's traditional leadership structure.",
    keywords: "traditional institution olude oba philip ebilakun council chiefs alamuro amuro leadership stool palace register",
  },
  {
    title: "Digital Archive",
    href: "/archive",
    excerpt: "Historical documents, community records, manuscripts and archival accounts.",
    keywords: "archive documents manuscript historical account records oral history ileteju",
  },
  {
    title: "Agbagba Ide — Symbol, Memory and Community Tradition",
    href: "/heritage/agbagba-ide",
    excerpt: "Sacred sanctuary, cultural memory and symbol of community resilience in Takete-Ide heritage.",
    keywords: "agbagba ide sanctuary symbol cultural memory anthem oriki tradition history protection peace",
  },
  {
    title: "Takete-Ide Community Anthem & Living Oral Heritage",
    href: "/heritage/takete-ide-anthem",
    excerpt: "The preserved Takete-Ide Community Anthem and Oríkì Agbagba Ide recorded verbatim from the canonical manuscript.",
    keywords: "anthem takete-ide anthem oriki agbagba ide living oral heritage song lyrics poetry praise yoruba",
  },
  {
    title: "Culture & Heritage",
    href: "/heritage",
    excerpt: "Festivals, cultural dress, places of worship, landscape and community life.",
    keywords: "culture heritage festival attire cloth worship landscape tradition egungun ogun okuta gbooro okuta gboro igboruku gboruku",
  },
  {
    title: "Ate — Egungun Heritage",
    href: "/heritage/ate",
    excerpt: "Ate, one of the Egungun (masquerade) traditions observed in Takete-Ide Amuro.",
    keywords: "ate egungun masquerade tradition festival culture heritage",
  },
  {
    title: "Education in Takete-Ide",
    href: "/education",
    excerpt: "Schooling in Takete-Ide, from early primary classes to the community secondary school.",
    keywords: "education school secondary primary gdss learning students",
  },
  {
    title: "Development",
    href: "/development",
    excerpt: "Community-led projects across roads, security, education, healthcare and more.",
    keywords: "development projects roads infrastructure water electricity town hall",
  },
  {
    title: "Community at Work",
    href: "/development/community-at-work",
    excerpt: "Community-recorded footage of local work on roads and the surrounding environment.",
    keywords: "community work road video footage self-help",
  },
  {
    title: "Diaspora",
    href: "/diaspora",
    excerpt: "Takete-Ide people around the world.",
    keywords: "diaspora abroad overseas uk europe america international",
  },
  {
    title: "Gallery",
    href: "/gallery",
    excerpt: "Photographs from community life, culture, landscape and events.",
    keywords: "gallery photographs pictures images photos album",
  },
  {
    title: "Takete-Ide Day",
    href: "/takete-ide-day",
    excerpt: "The annual homecoming festival and the archive of past celebrations.",
    keywords: "takete-ide day festival annual homecoming celebration",
  },
  {
    title: "Cultural Attire",
    href: "/takete-ide-day/cultural-attire",
    excerpt: "The community's striped cultural cloth, photographed as it was worn.",
    keywords: "attire cloth aso dress uniform fabric cultural ambassador",
  },
  {
    title: "Voices of Takete-Ide",
    href: "/archive/oral-history",
    excerpt: "Oral history recordings from those who carry the community's memory.",
    keywords: "oral history voices interviews recordings elders memory",
  },
  {
    title: "Contact",
    href: "/contact",
    excerpt: "Get in touch with the community and the union.",
    keywords: "contact email message enquiry reach",
  },
  {
    title: "Get Involved",
    href: "/get-involved",
    excerpt: "Volunteer, contribute skills or partner with the community.",
    keywords: "volunteer involved help participate partner skills",
  },
];

/**
 * PostgREST's `or=` filter is comma/parenthesis-delimited, so those characters
 * in a user's query would change the meaning of the filter rather than being
 * searched for. Stripping them is safer than escaping and costs nothing here.
 */
function sanitiseForOr(query: string) {
  return query.replace(/[(),*]/g, " ").replace(/\s+/g, " ").trim();
}

function matches(haystack: string, needle: string) {
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

/**
 * Site-wide search.
 *
 * Two sources feed it: published database records, and the content that ships
 * with the application (the branch network, the place/landmark media library and
 * the page index). The second group is what makes search useful with no Supabase
 * project connected.
 *
 * Everything published here is already public elsewhere on the site. Drafts,
 * unpublished submissions, restricted archive items, Oríkì without publication
 * permission, admin data and internal provenance notes are all excluded — the
 * database queries repeat the same guards the section pages use rather than
 * trusting that a row would not be found.
 */
export async function siteSearch(query: string): Promise<SearchResult[]> {
  const raw = query.trim();
  if (!raw) return [];
  const orTerm = sanitiseForOr(raw);
  const results: SearchResult[] = [];

  // ---- Content that ships with the app (works without a database) ----------
  for (const page of PAGE_INDEX) {
    if (matches(page.title, raw) || matches(page.excerpt, raw) || matches(page.keywords, raw)) {
      results.push({ id: page.href, type: "page", title: page.title, excerpt: page.excerpt, href: page.href });
    }
  }

  const [branches, media] = await Promise.all([
    getBranchNetwork(),
    getCommunityMedia({ mediaType: "image" }),
  ]);

  for (const b of branches) {
    const location = branchLocation(b);
    if (matches(b.name, raw) || matches(b.shortName, raw) || matches(location, raw) || matches(b.description, raw)) {
      results.push({
        id: `branch-${b.slug}`,
        type: "branch",
        title: b.name,
        excerpt: b.description,
        href: b.href ?? "/tipu/branches",
        meta: location || null,
      });
    }
  }

  for (const m of media) {
    if (matches(m.title, raw) || matches(m.description, raw) || matches(m.location ?? "", raw)) {
      results.push({
        id: `media-${m.id}`,
        type: "place",
        title: m.title,
        excerpt: m.description,
        href: `/gallery?category=${encodeURIComponent(m.category)}`,
        meta: m.location ?? m.category,
      });
    }
  }

  // ---- Published database records -----------------------------------------
  const supabase = await createClient();
  if (!supabase) return dedupe(results);

  const [news, archive, people, events, projects, families, oriki] = await Promise.all([
    supabase
      .from("news_articles")
      .select("id, title, excerpt, slug, published_at")
      .eq("status", "published")
      .or(`title.ilike.%${orTerm}%,excerpt.ilike.%${orTerm}%,body.ilike.%${orTerm}%`)
      .limit(10),
    supabase
      .from("archive_items")
      .select("id, title, description, slug")
      .eq("status", "published")
      .eq("access_level", "public")
      .or(`title.ilike.%${orTerm}%,description.ilike.%${orTerm}%`)
      .limit(10),
    supabase
      .from("historical_people")
      .select("id, name, biography, achievements, slug, category")
      .eq("status", "published")
      .or(`name.ilike.%${orTerm}%,biography.ilike.%${orTerm}%,achievements.ilike.%${orTerm}%`)
      .limit(10),
    supabase
      .from("events")
      .select("id, year, theme, description, event_date")
      .eq("status", "published")
      .or(`theme.ilike.%${orTerm}%,description.ilike.%${orTerm}%`)
      .limit(10),
    supabase
      .from("projects")
      .select("id, title, description, slug, category")
      .or(`title.ilike.%${orTerm}%,description.ilike.%${orTerm}%`)
      .limit(10),
    supabase
      .from("families")
      .select("id, name, summary, slug")
      .eq("status", "published")
      .or(`name.ilike.%${orTerm}%,summary.ilike.%${orTerm}%`)
      .limit(10),
    // publication_permission mirrors the guard on the Oríkì pages themselves.
    supabase
      .from("oriki")
      .select("id, title, cultural_notes, slug")
      .eq("status", "published")
      .eq("publication_permission", true)
      .or(`title.ilike.%${orTerm}%,cultural_notes.ilike.%${orTerm}%`)
      .limit(10),
  ]);

  for (const r of news.data ?? []) {
    results.push({ id: r.id, type: "news", title: r.title, excerpt: r.excerpt, href: `/news/${r.slug}` });
  }
  for (const r of archive.data ?? []) {
    results.push({ id: r.id, type: "archive", title: r.title, excerpt: r.description, href: `/archive/${r.slug}` });
  }
  for (const r of people.data ?? []) {
    results.push({
      id: r.id,
      type: "people",
      title: r.name,
      excerpt: r.achievements ?? r.biography,
      href: `/our-people/${r.slug}`,
      meta: r.category ? String(r.category).replace(/_/g, " ") : null,
    });
  }
  for (const r of events.data ?? []) {
    results.push({
      id: r.id,
      type: "event",
      title: `Takete-Ide Day ${r.year}`,
      excerpt: r.description ?? r.theme,
      href: `/takete-ide-day/${r.year}`,
    });
  }
  for (const r of projects.data ?? []) {
    results.push({
      id: r.id,
      type: "project",
      title: r.title,
      excerpt: r.description,
      href: `/development/projects/${r.slug}`,
      meta: r.category ? String(r.category).replace(/_/g, " ") : null,
    });
  }
  for (const r of families.data ?? []) {
    results.push({ id: r.id, type: "family", title: r.name, excerpt: r.summary, href: `/families/${r.slug}` });
  }
  for (const r of oriki.data ?? []) {
    results.push({ id: r.id, type: "oriki", title: r.title, excerpt: r.cultural_notes, href: `/oriki/${r.slug}` });
  }

  return dedupe(results);
}

/** The same place can match on title and location; show it once. */
function dedupe(results: SearchResult[]): SearchResult[] {
  const seen = new Set<string>();
  return results.filter((r) => {
    const key = `${r.type}:${r.href}:${r.title}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Results grouped by type, in TYPE_ORDER, with empty groups dropped. */
export function groupResults(results: SearchResult[]) {
  return TYPE_ORDER.map((type) => ({ type, items: results.filter((r) => r.type === type) })).filter(
    (g) => g.items.length > 0,
  );
}
