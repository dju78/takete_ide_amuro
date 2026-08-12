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
  // No canonical domain has been purchased yet — see docs/DECISIONS.md.
  // Overridden by NEXT_PUBLIC_SITE_URL in production.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://taketeideamuro.org",
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
 * both the desktop mega-menu / mobile accordion (Header) and the simplified
 * secondary footer, so the two never drift apart. Each group's `href` is
 * where its heading links (an overview page), separate from its `items`.
 * See docs/DECISIONS.md for the mega-menu redesign rationale.
 */
export const navGroups: NavGroup[] = [
  {
    heading: "Community",
    href: "/our-story",
    items: [
      { label: "Our Story", href: "/our-story", description: "Origins, settlement and how we became Takete-Ide" },
      { label: "Our People", href: "/our-people", description: "Community leaders, achievers and profiles" },
      { label: "Diaspora", href: "/diaspora", description: "Takete-Ide people around the world" },
      { label: "TIPU", href: "/tipu", description: "Takete-Ide Progressive Union" },
    ],
  },
  {
    heading: "Heritage",
    href: "/heritage",
    items: [
      { label: "Heritage Overview", href: "/heritage", description: "Culture, customs and living heritage" },
      { label: "Families & Oríkì", href: "/families", description: "Family names, compounds and praise poetry", featured: true },
      { label: "Oríkì Archive", href: "/oriki", description: "Listen to and read Oríkì", featured: true },
      { label: "Traditional Institution", href: "/heritage/traditional-institution", description: "The Olude and the traditional council" },
      { label: "Takete-Ide Day", href: "/takete-ide-day", description: "Our annual homecoming festival" },
      { label: "Voices of Takete-Ide", href: "/archive/oral-history", description: "Oral history recordings" },
      { label: "Agado Festival", href: "/heritage/agado", description: "Community video footage" },
      { label: "Ate — Egungun Heritage", href: "/heritage/ate", description: "One of the Egungun traditions" },
      { label: "Traditional Marriage", href: "/heritage/traditional-marriage", description: "Ceremonial items and gatherings" },
    ],
  },
  {
    heading: "Development",
    href: "/development",
    items: [
      { label: "Development Projects", href: "/development", description: "Roads, education, health, water and more" },
      { label: "Get Involved", href: "/get-involved", description: "Volunteer, contribute, partner" },
      { label: "Weather", href: "/weather", description: "Local conditions and forecasts" },
    ],
  },
  {
    heading: "Resources",
    href: "/news",
    items: [
      { label: "News", href: "/news", description: "Community news and announcements" },
      { label: "Gallery", href: "/gallery", description: "Photographs from community life" },
      { label: "Digital Archive", href: "/archive", description: "Historical documents and records" },
      { label: "Search", href: "/search", description: "Search the whole site" },
    ],
  },
  {
    heading: "Connect",
    href: "/contact",
    items: [
      { label: "Contact", href: "/contact", description: "Get in touch" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Accessibility", href: "/accessibility" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];
