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
    description: "The community Security Trust Fund.",
    href: "/development/security-trust-fund",
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
  /** ISO date. Confirmed: Saturday 31 October 2026. */
  eventDate: string;
  eventDateLabel: string;
  venue: string;
  programmeStatus: string;
  attireStatus: string;
}

/**
 * What the community has confirmed about the Centenary.
 *
 * Note what is *absent*: no founding year. The celebration is named as a
 * centenary, but the community archive nowhere states that Takete-Ide was
 * founded in 1926, and its own historical recollections describe events that
 * appear to predate that. What the centenary commemorates is an open question —
 * see docs/COMMUNITY_VERIFICATION.md — so the page marks the anniversary without
 * asserting a date of foundation.
 */
export const CENTENARY: CentenaryDetails = {
  title: "Takete-Ide Day & Centenary Celebration 2026",
  headline: "Celebrating 100 Years of Heritage",
  intro:
    "A historic gathering of Takete-Ide sons, daughters, families and friends celebrating heritage, unity and progress.",
  eventDate: "2026-10-31",
  eventDateLabel: "Saturday, 31 October 2026",
  venue: "Takete-Ide Primary School Field",
  programmeStatus:
    "The full programme of events is being finalised by the Central Planning Committee and will be published here once approved.",
  attireStatus:
    "The official Centenary attire has not yet been confirmed for publication. Details will appear here once the organising committee releases them.",
};

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
