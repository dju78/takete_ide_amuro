/**
 * The TIPU branch network.
 *
 * Every branch the community has documented appears here, whether or not a
 * photograph exists for it — a branch must never vanish from the site just
 * because its photographic archive hasn't been built yet. Branches without a
 * photograph render a branded placeholder (components/tipu/BranchMediaPlaceholder).
 *
 * Nothing here is invented. Every entry traces to the community's own records —
 * the TIPU CONNECT WhatsApp archive (annual-dues notices, the October 2025
 * branch-chairman listing, and the 2026 Security Trust Fund levy tables) — and
 * each carries a `sourceNote` recording where it came from. Evidence is not all
 * equal, so `verification` separates recurring documented branches from
 * single-mention records, and `status` separates operating branches from ones
 * the archive describes as still forming. See docs/TIPU_BRANCH_NETWORK.md.
 *
 * Editors add, edit and photograph branches from /admin/tipu/branches; those
 * changes are merged over this baseline at read time by lib/data/tipu-branches.ts,
 * so replacing a placeholder with a real photograph never needs a deploy.
 */

export type BranchGroup = "home" | "nigeria" | "diaspora" | "growing";

/** Operational state. Distinct from evidence strength — see `BranchVerification`. */
export type BranchStatus = "active" | "forming" | "inactive";

/**
 * How strong the community record is for this branch.
 * - `verified`             — confirmed against a formal union document.
 * - `community-record`     — appears repeatedly in union communications (dues
 *                            notices, chairman listings, levy tables).
 * - `pending-verification` — appears once, or with unresolved ambiguity.
 *
 * "Forming" is deliberately *not* a verification value: whether a branch is up
 * and running is an operational question (`status`), not a question about how
 * good the evidence is. Kabba, for instance, is well evidenced as forming.
 */
export type BranchVerification = "verified" | "community-record" | "pending-verification";

export interface BranchSeed {
  /** Stable key, also the admin override key and the dedicated-page segment. */
  slug: string;
  /** Full public name, e.g. "TIPU Kaduna Branch". */
  name: string;
  /** Compact label for the homepage strip and chips, e.g. "Kaduna". */
  shortName: string;
  group: BranchGroup;
  /** Location parts, each only as precise as the record supports. */
  city?: string;
  state?: string;
  country?: string;
  /** Two-letter monogram used by the placeholder artwork. */
  acronym: string;
  description: string;
  status: BranchStatus;
  verification: BranchVerification;
  /** Internal provenance for administrators. Not rendered publicly. */
  sourceNote: string;
  /** Overrides the default public line shown for unconfirmed records. */
  statusNote?: string;
  /** Authentic photograph, where the archive has one. */
  image?: string;
  imageAlt?: string;
  /** Route for a branch that has enough content to justify its own page. */
  href?: string;
  /** Most recent documented activity — only where the archive evidences it. */
  latestActivity?: string;
  latestActivityDate?: string;
  upcomingEvent?: string;
  upcomingEventDate?: string;
  /** Only ever set from a verified source. No date is guessed. */
  establishedLabel?: string;
  /** Shown in the homepage "One Takete-Ide. Many Locations." strip. */
  featured: boolean;
  sortOrder: number;
}

/**
 * Used wherever the only thing on record is that the branch exists. Deliberately
 * says nothing about size, age, officers or activity.
 */
export const DEFAULT_BRANCH_DESCRIPTION =
  "Part of the Takete-Ide Progressive Union network connecting members and supporting the wider Takete-Ide community.";

/** Wording for a branch whose photographic archive is still being built. */
export const BRANCH_PLACEHOLDER_MESSAGE = "Community archive image coming soon";

/** Wording for a branch the archive describes as still forming. */
export const BRANCH_FORMING_PLACEHOLDER_MESSAGE = "Branch information being documented";

/**
 * Public wording for records still being confirmed. Deliberately neutral — a
 * branch whose paperwork is catching up is not a lesser branch, and the phrasing
 * must not read as a warning.
 */
export const PENDING_STATUS_NOTE = "Community record being updated";
export const FORMING_STATUS_NOTE = "Branch information being documented";

export const GROUP_LABELS: Record<BranchGroup, { title: string; heading: string; description: string }> = {
  home: {
    title: "Home & Community",
    heading: "Home & Community",
    description: "Branches in Takete-Ide and the surrounding community area.",
  },
  nigeria: {
    title: "Across Nigeria",
    heading: "Across Nigeria",
    description: "Branches wherever Takete-Ide people have settled across the country.",
  },
  diaspora: {
    title: "Global Community",
    heading: "Global Community",
    description: "Chapters connecting Takete-Ide sons and daughters abroad.",
  },
  growing: {
    title: "Growing Network",
    heading: "Growing Network",
    description:
      "Branches recorded in the community archive whose details are still being confirmed with union leadership.",
  },
};

export const GROUP_ORDER: BranchGroup[] = ["home", "nigeria", "diaspora", "growing"];

/** Provenance strings, kept together so the same citation reads identically everywhere. */
const SRC = {
  duesDec2024: "TIPU annual-dues/branch notice, 21 Dec 2024",
  chairmenOct2025: "TIPU branch-chairman listing, 14 Oct 2025",
  levyAug2026: "TIPU Security Trust Fund levy status, 25 Aug 2026",
} as const;

export const tipuBranches: BranchSeed[] = [
  // ── Home & community ──────────────────────────────────────────────────────
  {
    slug: "home",
    name: "TIPU Home Branch",
    shortName: "Home Branch",
    group: "home",
    city: "Takete-Ide, Amuro",
    state: "Kogi State",
    country: "Nigeria",
    acronym: "TI",
    description: `The union's branch in Takete-Ide itself. ${DEFAULT_BRANCH_DESCRIPTION}`,
    status: "active",
    verification: "community-record",
    sourceNote: `${SRC.levyAug2026} (met and exceeded its levy target); referenced throughout union communications as the branch at home`,
    featured: true,
    sortOrder: 0,
  },
  {
    slug: "agbajogun",
    name: "TIPU Agbajogun Branch",
    shortName: "Agbajogun",
    group: "home",
    city: "Agbajogun",
    country: "Nigeria",
    acronym: "AG",
    description: DEFAULT_BRANCH_DESCRIPTION,
    status: "active",
    verification: "community-record",
    sourceNote: `${SRC.levyAug2026} (recorded a contribution despite not being assigned a levy target)`,
    featured: false,
    sortOrder: 10,
  },
  {
    slug: "ayeteju",
    name: "TIPU Ayeteju Branch",
    shortName: "Ayeteju",
    group: "home",
    // The archive places Ayeteju within Agbajogun, Amuro — but whether it is a
    // branch in its own right or a gathering that remits through the home branch
    // is not settled, so no finer classification is published.
    city: "Ayeteju",
    country: "Nigeria",
    acronym: "AY",
    description: DEFAULT_BRANCH_DESCRIPTION,
    status: "active",
    verification: "pending-verification",
    sourceNote:
      "TIPU branch-chairman listing, 14 Oct 2025. A June 2025 message records a maiden meeting of TIPU members residing in Ayeteju, Agbajogun, and asks them to remit to the home branch — so the relationship to the Home Branch, and the spelling (Ayeteju / Aiyeteju), both require confirmation",
    featured: false,
    sortOrder: 20,
  },

  // ── Across Nigeria ────────────────────────────────────────────────────────
  {
    slug: "abuja",
    name: "TIPU Abuja Branch",
    shortName: "Abuja",
    group: "nigeria",
    city: "Abuja",
    country: "Nigeria",
    acronym: "AB",
    description: DEFAULT_BRANCH_DESCRIPTION,
    status: "active",
    verification: "community-record",
    sourceNote: `${SRC.duesDec2024}; ${SRC.chairmenOct2025}; ${SRC.levyAug2026}; branch meetings reported Mar 2025, Jul 2025 and Oct 2025`,
    featured: true,
    sortOrder: 30,
  },
  {
    slug: "lokoja",
    name: "TIPU Lokoja Branch",
    shortName: "Lokoja",
    group: "nigeria",
    city: "Lokoja",
    state: "Kogi State",
    country: "Nigeria",
    acronym: "LK",
    description:
      "Meets monthly in Kogi State's capital, keeping Takete-Ide people in Lokoja connected to one another and to home.",
    status: "active",
    verification: "community-record",
    sourceNote: `${SRC.duesDec2024}; ${SRC.chairmenOct2025}; ${SRC.levyAug2026}; monthly meeting photographs, 16 Aug 2026`,
    image: "/images/takete-ide/tipu-branches/lokoja-branch-group.jpg",
    imageAlt: "Members of the TIPU Lokoja Branch standing together after a monthly meeting",
    href: "/tipu/branches/lokoja",
    latestActivity: "Monthly branch meeting",
    latestActivityDate: "2026-08-16",
    featured: true,
    sortOrder: 40,
  },
  {
    slug: "kaduna",
    name: "TIPU Kaduna Branch",
    shortName: "Kaduna",
    group: "nigeria",
    city: "Kaduna",
    country: "Nigeria",
    acronym: "KD",
    description: DEFAULT_BRANCH_DESCRIPTION,
    status: "active",
    verification: "community-record",
    sourceNote: `${SRC.duesDec2024}; ${SRC.chairmenOct2025}; ${SRC.levyAug2026}; end-of-year party Dec 2024 and branch meetings Feb 2025, Jul 2025, Mar 2026 (photographs not present in the exported archive)`,
    featured: true,
    sortOrder: 50,
  },
  {
    slug: "ilorin",
    name: "TIPU Ilorin Branch",
    shortName: "Ilorin",
    group: "nigeria",
    city: "Ilorin",
    state: "Kwara State",
    country: "Nigeria",
    acronym: "IL",
    description:
      "Host of the branch New Yam Festival — a day of culture, fellowship and recognition of service to the union.",
    status: "active",
    verification: "community-record",
    sourceNote: `${SRC.duesDec2024}; ${SRC.chairmenOct2025}; ${SRC.levyAug2026}; New Yam Festival photographs and video, 22–25 Aug 2026`,
    image: "/images/takete-ide/new-yam-festival/full-group.jpg",
    imageAlt: "TIPU Ilorin Branch members in matching celebration cloth at the New Yam Festival",
    href: "/tipu/branches/ilorin",
    latestActivity: "New Yam Festival celebration",
    latestActivityDate: "2026-08-22",
    featured: true,
    sortOrder: 60,
  },
  {
    slug: "lagos",
    name: "TIPU Lagos Branch",
    shortName: "Lagos",
    group: "nigeria",
    city: "Lagos",
    country: "Nigeria",
    acronym: "LG",
    description: DEFAULT_BRANCH_DESCRIPTION,
    status: "active",
    verification: "community-record",
    sourceNote: `${SRC.duesDec2024}; ${SRC.chairmenOct2025}; ${SRC.levyAug2026}`,
    featured: true,
    sortOrder: 70,
  },
  {
    slug: "ogun",
    name: "TIPU Ogun Branch",
    shortName: "Ogun",
    group: "nigeria",
    state: "Ogun State",
    country: "Nigeria",
    acronym: "OG",
    description: DEFAULT_BRANCH_DESCRIPTION,
    status: "active",
    verification: "community-record",
    sourceNote: `${SRC.duesDec2024}; ${SRC.chairmenOct2025}; ${SRC.levyAug2026}; end-of-year party Dec 2025 (photographs not present in the exported archive)`,
    featured: true,
    sortOrder: 80,
  },
  {
    slug: "port-harcourt",
    name: "TIPU Port Harcourt Branch",
    shortName: "Port Harcourt",
    group: "nigeria",
    city: "Port Harcourt",
    country: "Nigeria",
    acronym: "PH",
    description: DEFAULT_BRANCH_DESCRIPTION,
    status: "active",
    verification: "community-record",
    // Appears as "P/court branch", "P/courte TIPU branch" and "P/H branch";
    // normalised to the full name for the public site.
    sourceNote: `${SRC.duesDec2024} (as "P/court branch"); ${SRC.chairmenOct2025} (as "P/H branch"); named among the union's strongest branches in a 2026 dues reminder`,
    featured: true,
    sortOrder: 90,
  },
  {
    slug: "minna",
    name: "TIPU Minna Branch",
    shortName: "Minna",
    group: "nigeria",
    city: "Minna",
    country: "Nigeria",
    acronym: "MN",
    description: DEFAULT_BRANCH_DESCRIPTION,
    status: "active",
    verification: "community-record",
    sourceNote: `${SRC.duesDec2024}; ${SRC.chairmenOct2025}`,
    featured: false,
    sortOrder: 100,
  },
  {
    slug: "osun",
    name: "TIPU Osun Branch",
    shortName: "Osun",
    group: "nigeria",
    state: "Osun State",
    country: "Nigeria",
    acronym: "OS",
    description: DEFAULT_BRANCH_DESCRIPTION,
    status: "active",
    verification: "community-record",
    sourceNote: `${SRC.duesDec2024}; ${SRC.chairmenOct2025}`,
    featured: false,
    sortOrder: 110,
  },
  {
    slug: "ekiti",
    name: "TIPU Ekiti Branch",
    shortName: "Ekiti",
    group: "nigeria",
    state: "Ekiti State",
    country: "Nigeria",
    acronym: "EK",
    description: DEFAULT_BRANCH_DESCRIPTION,
    status: "active",
    verification: "community-record",
    sourceNote: `${SRC.duesDec2024}; ${SRC.chairmenOct2025}; ${SRC.levyAug2026} (recorded a contribution despite not being assigned a levy target)`,
    featured: false,
    sortOrder: 120,
  },
  {
    slug: "ore",
    name: "TIPU Ore Branch",
    shortName: "Ore",
    group: "nigeria",
    // The record names the branch but not its state, so none is asserted.
    city: "Ore",
    country: "Nigeria",
    acronym: "OR",
    description: DEFAULT_BRANCH_DESCRIPTION,
    status: "active",
    verification: "community-record",
    sourceNote: `${SRC.levyAug2026} (recorded a contribution despite not being assigned a levy target). State not stated in the record; relationship to the Ondo reference below requires confirmation`,
    featured: false,
    sortOrder: 130,
  },
  {
    slug: "kano",
    name: "TIPU Kano Branch",
    shortName: "Kano",
    group: "nigeria",
    city: "Kano",
    state: "Kano State",
    country: "Nigeria",
    acronym: "KN",
    description: DEFAULT_BRANCH_DESCRIPTION,
    // Listed among branch chairmen in Oct 2025, then described in Jan 2026 as
    // due to "kick-off this year" — so it is carried as forming rather than
    // placed alongside long-running branches, and no establishment date is set.
    status: "forming",
    verification: "pending-verification",
    statusNote: "Community record — details being updated",
    sourceNote: `${SRC.chairmenOct2025}; a TIPU notice of 7 Jan 2026 stated that "Kano branch and Kabba branch will by God's grace kick-off this year", so its operational status at that date is unclear`,
    featured: false,
    sortOrder: 140,
  },
  {
    slug: "oyo",
    name: "TIPU Oyo Branch",
    shortName: "Oyo",
    group: "nigeria",
    state: "Oyo State",
    country: "Nigeria",
    acronym: "OY",
    description: DEFAULT_BRANCH_DESCRIPTION,
    status: "active",
    verification: "pending-verification",
    sourceNote: `${SRC.chairmenOct2025} (single mention, written "Oyo brance"). No chairman, address, establishment date or membership figure is on record`,
    featured: false,
    sortOrder: 150,
  },

  // ── Global community ──────────────────────────────────────────────────────
  {
    slug: "uk-europe",
    name: "TIPU UK & Europe Chapter",
    shortName: "UK & Europe",
    group: "diaspora",
    city: "United Kingdom & Europe",
    acronym: "UK",
    description:
      "Inaugurated in August 2026 to strengthen diaspora participation, community connection and support for development at home.",
    status: "active",
    verification: "community-record",
    sourceNote: `${SRC.levyAug2026} (as "U.K. Branch"); chapter's own inaugural-meeting announcement, 19 Aug 2026`,
    image: "/images/takete-ide/tipu-branches/uk-europe-inaugural-group.jpg",
    imageAlt: "Members of the TIPU UK & Europe Chapter at the chapter's inaugural meeting",
    href: "/diaspora/uk-europe",
    latestActivity: "Inaugural chapter meeting",
    latestActivityDate: "2026-08-19",
    featured: true,
    sortOrder: 160,
  },
  {
    slug: "north-america",
    name: "TIPU North America",
    shortName: "North America",
    group: "diaspora",
    // The union's own coordinator description covers the USA, Canada "and other
    // countries within the region", so the chapter stays continental and is
    // never narrowed to a single country or city.
    city: "North America",
    acronym: "NA",
    description: "Connecting Takete-Ide sons and daughters across North America.",
    status: "active",
    verification: "community-record",
    sourceNote: `${SRC.levyAug2026} (as "North America Branch"); a union listing describes its coordinator's remit as the USA, Canada and other countries in the region. Also written "North American Branch" in the archive`,
    featured: true,
    sortOrder: 170,
  },

  // ── Growing network ───────────────────────────────────────────────────────
  {
    slug: "ondo",
    name: "TIPU Ondo",
    shortName: "Ondo",
    group: "growing",
    state: "Ondo State",
    country: "Nigeria",
    acronym: "ON",
    description: DEFAULT_BRANCH_DESCRIPTION,
    status: "active",
    verification: "pending-verification",
    sourceNote:
      "TIPU Security Trust Fund remittance notice, Jul 2026, listing “North America, Kaduna, Abuja, Lokoja, and Ondo, Lagos/Ogun branches”. Its relationship with the separately documented Ore Branch requires confirmation — the two have deliberately not been merged",
    featured: false,
    sortOrder: 180,
  },
  {
    slug: "kabba",
    name: "TIPU Kabba Branch",
    shortName: "Kabba",
    group: "growing",
    city: "Kabba",
    state: "Kogi State",
    country: "Nigeria",
    acronym: "KB",
    description: DEFAULT_BRANCH_DESCRIPTION,
    // Referenced only as an intended branch. Presenting it alongside Abuja or
    // Lokoja would claim more than the source supports.
    status: "forming",
    verification: "pending-verification",
    sourceNote:
      "TIPU notice of 7 Jan 2026 stated that “Kano branch and Kabba branch will by God's grace kick-off this year”. No later message confirms that the branch became operational",
    featured: false,
    sortOrder: 190,
  },
];

/** Order of the compact homepage strip — a representative selection, home first. */
export const HOMEPAGE_BRANCH_ORDER = [
  "home",
  "abuja",
  "kaduna",
  "lokoja",
  "ilorin",
  "lagos",
  "ogun",
  "port-harcourt",
  "uk-europe",
  "north-america",
] as const;

export function findBranchSeed(slug: string): BranchSeed | undefined {
  return tipuBranches.find((b) => b.slug === slug);
}

/** Public one-liner for a branch whose record isn't settled. Empty for settled ones. */
export function branchStatusNote(branch: Pick<BranchSeed, "status" | "verification" | "statusNote">) {
  if (branch.statusNote) return branch.statusNote;
  if (branch.status === "forming") return FORMING_STATUS_NOTE;
  if (branch.verification === "pending-verification") return PENDING_STATUS_NOTE;
  return null;
}

/** Placeholder wording, softened for branches still being formed. */
export function branchPlaceholderMessage(branch: Pick<BranchSeed, "status">) {
  return branch.status === "forming" ? BRANCH_FORMING_PLACEHOLDER_MESSAGE : BRANCH_PLACEHOLDER_MESSAGE;
}

/** Location line, assembled from whichever parts the record actually supports. */
export function branchLocation(branch: Pick<BranchSeed, "city" | "state" | "country">) {
  return [branch.city, branch.state, branch.country].filter(Boolean).join(", ");
}
