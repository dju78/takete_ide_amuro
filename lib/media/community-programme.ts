/**
 * Confirmed facts about the union's public-facing programme: the contribution
 * account, the 2026 Centenary celebration, and the Security Trust Fund.
 *
 * These ship with the application so the pages are correct with no database,
 * and are overridden from the admin area (see lib/data/*). Everything here comes
 * from the community's own communications; anything not confirmed is marked as
 * such rather than filled in.
 */

// ── Official contribution account ───────────────────────────────────────────

export interface SupportAccount {
  accountName: string;
  bankName: string;
  accountNumber: string;
  purpose?: string;
  isActive: boolean;
}

/**
 * The union's general contribution account, as published repeatedly in TIPU
 * communications. This is the only account the site publishes. Historic personal
 * or campaign-specific accounts that appear in the community archive are
 * deliberately not carried here — see docs/DECISIONS.md.
 */
export const OFFICIAL_SUPPORT_ACCOUNT: SupportAccount = {
  accountName: "Takete Ide Progressive Union",
  bankName: "First Bank",
  accountNumber: "2023263187",
  purpose: "General community, heritage and development contributions",
  isActive: true,
};

/** Shown beside the account so nobody types a number from a screenshot. */
export const SUPPORT_BENEFICIARY_NOTICE =
  "Please confirm that your banking application displays “Takete Ide Progressive Union” as the beneficiary before completing your transfer.";

export const SUPPORT_SECURITY_NOTICE =
  "The Takete-Ide website does not request or store your banking password, PIN or OTP.";

/**
 * Areas the union directs support towards. These describe *purposes*, not live
 * campaigns — none is presented as currently fundraising, because no campaign
 * other than the Security Trust Fund has a published target.
 */
export const SUPPORT_PURPOSES = [
  {
    title: "Community Development",
    description: "Self-help projects that build the infrastructure Takete-Ide needs.",
    href: "/development",
  },
  {
    title: "Centenary 2026",
    description: "The Takete-Ide Day and Centenary Celebration on 31 October 2026.",
    href: "/centenary",
  },
  {
    title: "Education",
    description: "Support for schools and learning in the community.",
    href: "/education",
  },
  {
    title: "Roads & Infrastructure",
    description: "Access roads, bridges and the routes that connect Takete-Ide.",
    href: "/development?category=roads_access",
  },
  {
    title: "Security",
    description: "Community safety initiatives and security at home in Takete-Ide.",
    href: "/development",
  },
  {
    title: "Heritage & Culture",
    description: "Preserving festivals, oral history and the community archive.",
    href: "/heritage",
  },
] as const;

// ── Centenary 2026 ──────────────────────────────────────────────────────────

export interface CentenaryDetails {
  title: string;
  headline: string;
  intro: string;
  /** Overall event period, e.g. "29–31 October 2026". */
  eventDates: string;
  /** ISO date of the main celebration: "2026-10-31". */
  eventDate: string;
  eventDateLabel: string;
  mainEventTime: string;
  venue: string;
  theme: string;
  motto?: string;
  tagline?: string;
  programmeStatus: string;
  attireStatus: string;
}

export interface CentenaryProgrammeItem {
  id: string;
  title: string;
  dayNumber: number;
  dayLabel: string;
  date: string;
  dateLabel: string;
  startTime?: string;
  endTime?: string;
  timeLabel?: string;
  venue: string;
  description?: string;
  category?: string;
  theme?: string;
  isGrandCelebration?: boolean;
  confirmed: boolean;
  displayOrder: number;
  status?: "scheduled" | "happening_now" | "completed";
  isCompleted?: boolean;
}

export interface CentenaryHighlight {
  id: string;
  title: string;
  description: string;
  category: string;
}

/**
 * Confirmed Centenary details from the official invitation.
 * Venue: UBE School Field, Takete-Ide, Mopamuro L.G.A., Kogi State.
 * Overall event period: 29–31 October 2026.
 * Invitation time: 10:00 AM Prompt (detailed daily timetable awaiting confirmation).
 * Theme: FAITH, UNITY AND PROGRESS.
 */
export const CENTENARY: CentenaryDetails = {
  title: "TAKETE-IDE DAY & CENTENARY CELEBRATION 2026",
  headline: "Celebrating 100 Years of Heritage",
  intro:
    "A historic celebration of Takete-Ide's heritage, faith, unity and progress.",
  eventDates: "29–31 October 2026",
  eventDate: "2026-10-31",
  eventDateLabel: "Saturday, 31 October 2026",
  mainEventTime: "10:00 AM Prompt (Invitation time)",
  venue: "UBE School Field, Takete-Ide, Mopamuro L.G.A., Kogi State",
  theme: "FAITH, UNITY AND PROGRESS",
  motto: "AGBAGBA IDE AGBE WA O",
  tagline: "A CENTURY OF HERITAGE. A FUTURE OF GREATER GLORY.",
  programmeStatus:
    "Three historic days celebrating a century of Takete-Ide's heritage, unity and progress. Daily timetable awaiting confirmation by the Central Planning Committee.",
  attireStatus:
    "The official Centenary attire has not yet been confirmed for publication. Details will appear here once the organising committee releases them.",
};

/**
 * Schedule data for the three-day Centenary Celebration (29–31 October 2026).
 * Unconfirmed daily programme titles and session start times display honest notices
 * and are configurable via the administration system.
 */
export const CENTENARY_PROGRAMME: CentenaryProgrammeItem[] = [
  {
    id: "centenary-day-1",
    title: "Programme details to be confirmed",
    dayNumber: 1,
    dayLabel: "Day 1",
    date: "2026-10-29",
    dateLabel: "Thursday, 29 October 2026",
    venue: "UBE School Field, Takete-Ide, Mopamuro L.G.A., Kogi State",
    description:
      "Detailed daily schedule and session start times to be confirmed by the Central Planning Committee.",
    confirmed: true,
    displayOrder: 1,
  },
  {
    id: "centenary-day-2",
    title: "Programme details to be confirmed",
    dayNumber: 2,
    dayLabel: "Day 2",
    date: "2026-10-30",
    dateLabel: "Friday, 30 October 2026",
    venue: "UBE School Field, Takete-Ide, Mopamuro L.G.A., Kogi State",
    description:
      "Detailed daily schedule and session start times to be confirmed by the Central Planning Committee.",
    confirmed: true,
    displayOrder: 2,
  },
  {
    id: "centenary-day-3-main-celebration",
    title: "2026 Takete-Ide Day Centenary Celebration",
    dayNumber: 3,
    dayLabel: "Day 3 — Main Centenary Celebration",
    date: "2026-10-31",
    dateLabel: "Saturday, 31 October 2026",
    venue: "UBE School Field, Takete-Ide, Mopamuro L.G.A., Kogi State",
    description:
      "The flagship Centenary gathering featuring cultural displays, historical reflections, awards, recognitions and community development launch. Detailed programme information is awaiting confirmation.",
    theme: "FAITH, UNITY AND PROGRESS",
    isGrandCelebration: true,
    confirmed: true,
    displayOrder: 3,
  },
];

/**
 * Event Highlights from the official Centenary invitation.
 */
export const CENTENARY_HIGHLIGHTS: CentenaryHighlight[] = [
  {
    id: "cultural-display",
    title: "Cultural Display",
    description: "Celebrating Takete-Ide's cultural heritage.",
    category: "Culture",
  },
  {
    id: "traditional-music-dance",
    title: "Traditional Music & Dance",
    description: "Traditional performances celebrating the community's cultural identity.",
    category: "Music & Performance",
  },
  {
    id: "community-exhibition",
    title: "Community Exhibition",
    description: "A presentation of Takete-Ide's community heritage and development.",
    category: "Exhibition",
  },
  {
    id: "historical-reflections",
    title: "Historical Reflections",
    description: "Reflecting on 100 years of Takete-Ide history.",
    category: "History",
  },
  {
    id: "awards-recognitions",
    title: "Awards & Recognitions",
    description: "Recognising contributions to the community.",
    category: "Civic Honour",
  },
];

// ── Security Trust Fund ─────────────────────────────────────────────────────

export interface TrustFundReport {
  targetAmount: number;
  amountPaid: number;
  currency: string;
  /** ISO date of the community report these figures came from. */
  asOf: string;
  note: string;
}

/**
 * Figures from the union's Security Trust Fund levy status report of
 * 25 August 2026. Deliberately labelled as a dated community record, never as a
 * live balance — nothing on this site is connected to the union's bank account,
 * and presenting a two-month-old figure as "current" would be misleading.
 * The percentage is always computed, never stored.
 */
export const SECURITY_TRUST_FUND: TrustFundReport = {
  targetAmount: 16_500_000,
  amountPaid: 6_667_960,
  currency: "NGN",
  asOf: "2026-08-25",
  note: "Figures as reported in the union's branch levy status update. Branch-level contributions are recorded by the union; no individual contributor is named on this site.",
};

/** Progress as a percentage, clamped so a change in the figures cannot break the bar. */
export function trustFundProgress(fund: Pick<TrustFundReport, "targetAmount" | "amountPaid">) {
  if (!fund.targetAmount || fund.targetAmount <= 0) return 0;
  return Math.min(100, Math.max(0, (fund.amountPaid / fund.targetAmount) * 100));
}

/** Outstanding balance, floored at zero. */
export function trustFundOutstanding(fund: Pick<TrustFundReport, "targetAmount" | "amountPaid">) {
  return Math.max(0, fund.targetAmount - fund.amountPaid);
}
