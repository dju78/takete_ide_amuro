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
};

export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Our Story", href: "/our-story" },
  { label: "Takete-Ide Day", href: "/takete-ide-day" },
  { label: "Development", href: "/development" },
  { label: "News", href: "/news" },
  { label: "Gallery", href: "/gallery" },
  { label: "Weather", href: "/weather" },
];

/**
 * "Heritage" is a dropdown, not a plain link, so Families & Oríkì is one click
 * from the top-level nav rather than nested inside the generic "More" menu —
 * see docs/DECISIONS.md.
 */
export const heritageNav: NavItem[] = [
  { label: "Heritage Overview", href: "/heritage", description: "Culture, customs and living heritage" },
  { label: "Traditional Institution", href: "/heritage/traditional-institution", description: "The Olude and the traditional council" },
  { label: "Families & Oríkì", href: "/families", description: "Family names, compounds and praise poetry" },
  { label: "Oríkì Archive", href: "/oriki", description: "Listen to and read Oríkì" },
  { label: "Voices of Takete-Ide", href: "/archive/oral-history", description: "Oral history recordings" },
  { label: "Agado Festival", href: "/heritage/agado", description: "Community video footage" },
  { label: "Ate — Egungun Heritage", href: "/heritage/ate", description: "One of the Egungun traditions" },
  { label: "Traditional Marriage", href: "/heritage/traditional-marriage", description: "Ceremonial items and gatherings" },
];

export const moreNav: NavItem[] = [
  { label: "Our People", href: "/our-people", description: "Community leaders, achievers and profiles" },
  { label: "Diaspora", href: "/diaspora", description: "Takete-Ide people around the world" },
  { label: "Digital Archive", href: "/archive", description: "Historical documents, photographs and records" },
  { label: "TIPU", href: "/tipu", description: "Takete-Ide Progressive Union" },
  { label: "Get Involved", href: "/get-involved", description: "Volunteer, contribute, partner" },
  { label: "Contact", href: "/contact" },
  { label: "Search", href: "/search", description: "Search the whole site" },
];

export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Community",
    items: [
      { label: "Our Story", href: "/our-story" },
      { label: "Our People", href: "/our-people" },
      { label: "Diaspora", href: "/diaspora" },
      { label: "TIPU", href: "/tipu" },
    ],
  },
  {
    heading: "Heritage",
    items: [
      { label: "Heritage Overview", href: "/heritage" },
      { label: "Traditional Institution", href: "/heritage/traditional-institution" },
      { label: "Families & Oríkì", href: "/families" },
      { label: "Oríkì Archive", href: "/oriki" },
      { label: "Takete-Ide Day", href: "/takete-ide-day" },
    ],
  },
  {
    heading: "Development",
    items: [
      { label: "Development Projects", href: "/development" },
      { label: "Get Involved", href: "/get-involved" },
      { label: "Weather", href: "/weather" },
    ],
  },
  {
    heading: "Resources",
    items: [
      { label: "News", href: "/news" },
      { label: "Gallery", href: "/gallery" },
      { label: "Digital Archive", href: "/archive" },
      { label: "Oral History", href: "/archive/oral-history" },
    ],
  },
  {
    heading: "Connect",
    items: [
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Accessibility", href: "/accessibility" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];
