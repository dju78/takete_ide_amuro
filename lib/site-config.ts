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
} as const;

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
      { label: "Our History", href: "/our-story", description: "Origins, settlement and how we became Takete-Ide" },
      { label: "Traditional Institution", href: "/heritage/traditional-institution", description: "The Olude and the traditional council" },
      { label: "Education", href: "/education", description: "Schooling in Takete-Ide, in the community's own words" },
      { label: "Our People", href: "/our-people", description: "Community leaders, achievers and profiles" },
    ],
  },
  {
    heading: "Explore",
    href: "/heritage",
    items: [
      { label: "Culture & Heritage", href: "/heritage", description: "Festivals, dress, faith and the land", featured: true },
      { label: "Gallery", href: "/gallery", description: "Photographs from community life" },
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
      { label: "Culture", href: "/heritage" },
      { label: "Kogi Quest", href: "/kogi-quest" },
      { label: "Gallery", href: "/gallery" },
    ],
  },
  {
    heading: "Community",
    items: [
      { label: "TIPU", href: "/tipu" },
      { label: "Branches", href: "/tipu/branches" },
      { label: "Diaspora", href: "/diaspora" },
      { label: "Development", href: "/development" },
    ],
  },
  {
    heading: "Centenary",
    items: [
      { label: "Centenary 2026", href: "/centenary" },
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
