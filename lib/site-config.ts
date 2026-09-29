export const CANONICAL_SITE_URL = "https://takete-ide.org";

/**
 * Single source of truth for canonical site URL across metadataBase, sitemap,
 * robots, Open Graph, Twitter cards, and JSON-LD structured data.
 * Ensures the production address always resolves to the approved domain https://takete-ide.org.
 */
export function getCanonicalSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (
    !envUrl ||
    envUrl.includes("takete.netlify.app") ||
    envUrl.includes("taketeideamuro.org")
  ) {
    return CANONICAL_SITE_URL;
  }
  return envUrl.replace(/\/+$/, "");
}

export const siteConfig = {
  name: "Takete-Ide Amuro",
  tagline: "Heritage • Unity • Progress",
  description:
    "The official digital home of Takete-Ide Amuro, a historic community in Mopamuro Local Government Area, Kogi State, Nigeria — preserving our heritage and building our future.",
  location: {
    community: "Takete-Ide Amuro",
    lga: "Mopamuro Local Government Area",
    state: "Kogi State",
    country: "Nigeria",
  },
  contact: {
    email: "taketeideamuro@gmail.com",
    youtube: "https://www.youtube.com/channel/UCsLauLD7WlDBneUhDxl2VRw",
  },
  url: getCanonicalSiteUrl(),
  photoArchive: {
    title: "Explore More Community Photos",
    description:
      "Explore additional photographs documenting Takete-Ide, its landmarks, community life and heritage.",
    albums: [
      {
        label: "View Community Photo Album",
        url: "https://photos.app.goo.gl/Fg9JZ7Bo8Qh76MS88",
      },
      {
        label: "View More Takete-Ide Photos",
        url: "https://photos.app.goo.gl/xgqqHrcE9isZDhUP8",
      },
    ],
  },
} as const;

/**
 * Validates a Google Photos public shared album URL.
 * Strictly rejects account-specific session identifiers (e.g., /u/3/, /u/0/)
 * and guarantees only valid, public shared-album URLs are rendered.
 */
export function validateGooglePhotosUrl(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Strictly block account-specific identifiers like /u/3/ or /u/0/
  if (/\/u\/\d+/i.test(trimmed)) {
    return null;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
    const host = parsed.hostname.toLowerCase();
    if (!host.includes("photos.google.com") && !host.includes("photos.app.goo.gl") && !host.includes("goo.gl")) {
      return null;
    }
    return trimmed;
  } catch {
    return null;
  }
}


export type NavItem = {
  label: string;
  href: string;
  description?: string;
  featured?: boolean;
};

export type NavGroup = {
  heading: string;
  href: string;
  items: NavItem[];
};

/**
 * Single source of truth for site information architecture — used to render
 * both the desktop mega-menu / mobile accordion (Header) and the footer, so the
 * two never drift apart. Each group's `href` is where its heading links (an
 * overview page), separate from its `items`.
 *
 * Deliberately six groups of manageable depth. Individual branches are never
 * listed here: there are twenty of them and they belong on the network page,
 * not in a dropdown. See docs/DECISIONS.md.
 */
export const navGroups: NavGroup[] = [
  {
    heading: "About",
    href: "/our-story",
    items: [
      { label: "Our Story", href: "/our-story", description: "Origins, settlement and how we became Takete-Ide" },
      { label: "Takete-Tedo / Okegada", href: "/our-story/takete-tedo", description: "The later migration and settlement from 1949 onward" },
      { label: "Our People", href: "/our-people", description: "Community leaders, achievers and profiles" },
      { label: "Traditional Institution", href: "/heritage/traditional-institution", description: "The Olude and the traditional council" },
      { label: "Traditional Council & Chieftaincy", href: "/heritage/traditional-council", description: "Council hierarchy, ward rotation and chieftaincy categories" },
      { label: "Families & Compounds", href: "/families", description: "Family names, compounds and praise poetry" },
      { label: "Oríkì", href: "/oriki", description: "Community directory of family praise names" },
      { label: "Faith & Religious Heritage", href: "/heritage/faith", description: "Churches, ECWA, Muslim community and spiritual traditions" },
      { label: "Education", href: "/education", description: "Schooling in Takete-Ide, in the community's own words" },
      { label: "Health History", href: "/heritage/health-history", description: "Traditional healing, early dispensary, nurses and clinic history" },
      { label: "Pacesetters & Firsts", href: "/heritage/pacesetters", description: "Notable community firsts recorded in the historical manuscript" },
    ],
  },
  {
    heading: "Explore",
    href: "/heritage",
    items: [
      { label: "Culture & Heritage", href: "/heritage", description: "Festivals, dress, faith and the land", featured: true },
      { label: "Community History Manuscript", href: "/archive/from-hilltops-to-the-valley", description: "A chapter-by-chapter guide to From the Hilltops to the Valley", featured: true },
      { label: "Amuro, Yagba & Okun Context", href: "/heritage/amuro-okun-context", description: "Wider historical setting, identity and origin traditions" },
      { label: "Land & Landscape", href: "/heritage/land-and-landscape", description: "Location, neighbouring settlements, hills, rivers and streams" },
      { label: "Music, Games & Everyday Heritage", href: "/heritage/music-games", description: "Traditional music, instruments, childhood games and older cultural practices" },
      { label: "Festivals", href: "/heritage/festivals", description: "Christmas, New Year, Easter, New Yam, Egungun, Ogun and Takete-Ide Day" },
      { label: "Community Organisations", href: "/heritage/community-organisations", description: "TIPU, Jet Club, Owe, TISU and Egbe Ode in the historical record" },
      { label: "Faith & Religious Heritage", href: "/heritage/faith", description: "Churches, ECWA, Muslim community and spiritual traditions" },
      { label: "Early Christian Manuscript Milestones", href: "/heritage/faith/manuscript-milestones", description: "Non-Baptist milestones from the supplied community manuscript" },
      { label: "Gallery", href: "/gallery", description: "Photographs from community life" },
      { label: "Video Archives", href: "/archive?category=video", description: "Historic community video recordings and event coverage" },
      { label: "Families & Oríkì", href: "/families", description: "Family names, compounds and praise poetry" },
      { label: "Family Oríkì", href: "/oriki", description: "Community directory of family praise names" },
      { label: "Voices of Takete-Ide", href: "/archive/oral-history", description: "Oral history recordings" },
      { label: "Digital Archive", href: "/archive", description: "Historical documents and records" },
    ],
  },
  {
    heading: "Community",
    href: "/tipu",
    items: [
      { label: "TIPU", href: "/tipu", description: "The Takete-Ide Progressive Union" },
      { label: "The TIPU Network", href: "/tipu/branches", description: "Every branch, at home and abroad", featured: true },
      { label: "Diaspora", href: "/diaspora", description: "Takete-Ide people around the world" },
      { label: "Development", href: "/development", description: "Roads, security, education and more" },
      { label: "Settlement & Community Progress", href: "/development/settlement-progress", description: "Photographic record of contemporary residential development" },
      { label: "Get Involved", href: "/get-involved", description: "Volunteer, contribute, partner" },
    ],
  },
  {
    heading: "News & Events",
    href: "/news",
    items: [
      { label: "News", href: "/news", description: "Community news and announcements" },
      { label: "Events", href: "/events", description: "Upcoming and past community events", featured: true },
      { label: "Takete-Ide Day", href: "/takete-ide-day", description: "Our annual homecoming festival" },
      { label: "Weather", href: "/weather", description: "Local conditions and forecasts" },
      { label: "Search", href: "/search", description: "Search the whole site" },
    ],
  },
  {
    heading: "Centenary 2026",
    href: "/centenary",
    items: [
      { label: "Centenary 2026", href: "/centenary", description: "31 October 2026 — celebrating 100 years of heritage", featured: true },
      { label: "Celebration Studio", href: "/centenary/celebration-studio", description: "Create and download personalised centenary posters", featured: true },
      { label: "Cultural Attire", href: "/takete-ide-day/cultural-attire", description: "The community's striped cloth" },
      { label: "Takete-Ide Day Archive", href: "/takete-ide-day", description: "Past celebrations" },
    ],
  },
  {
    heading: "Support",
    href: "/support",
    items: [
      { label: "Support Takete-Ide", href: "/support", description: "The union's official contribution account", featured: true },
      { label: "Get Involved", href: "/get-involved", description: "Volunteer and contribute skills" },
      { label: "Contact", href: "/contact", description: "Get in touch" },
    ],
  },
];

/** Footer columns. Shorter and more task-oriented than the header's menu. */
export const footerGroups: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Takete-Ide",
    items: [
      { label: "About", href: "/our-story" },
      { label: "History", href: "/our-story" },
      { label: "Community History Manuscript", href: "/archive/from-hilltops-to-the-valley" },
      { label: "Faith & Religious Heritage", href: "/heritage/faith" },
      { label: "Culture", href: "/heritage" },
      { label: "Festivals", href: "/heritage/festivals" },
      { label: "Pacesetters", href: "/heritage/pacesetters" },
      { label: "Kogi Quest", href: "/kogi-quest" },
      { label: "Gallery", href: "/gallery" },
      { label: "Video Archives", href: "/archive?category=video" },
    ],
  },
  {
    heading: "Community",
    items: [
      { label: "TIPU", href: "/tipu" },
      { label: "Branches", href: "/tipu/branches" },
      { label: "Diaspora", href: "/diaspora" },
      { label: "Community Organisations", href: "/heritage/community-organisations" },
      { label: "Development", href: "/development" },
      { label: "Settlement & Progress", href: "/development/settlement-progress" },
    ],
  },
  {
    heading: "Centenary",
    items: [
      { label: "Centenary 2026", href: "/centenary" },
      { label: "Celebration Studio", href: "/centenary/celebration-studio" },
      { label: "Events", href: "/events" },
      { label: "Support Takete-Ide", href: "/support" },
    ],
  },
  {
    heading: "Connect",
    items: [
      { label: "Contact", href: "/contact" },
      { label: "Get Involved", href: "/get-involved" },
      { label: "News", href: "/news" },
      { label: "Weather", href: "/weather" },
    ],
  },
];
