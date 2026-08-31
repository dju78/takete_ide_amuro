import type { GalleryCategory } from "@/lib/media/gallery-categories";

/**
 * How confident the community is about what a media item actually shows.
 *
 * - `verified`            — independently confirmed against a documentary source.
 * - `community-record`    — supplied by the community archive with the context
 *                           recorded here; accurate as far as the archive states,
 *                           but not separately corroborated.
 * - `pending-verification`— an outstanding question hangs over some part of the
 *                           record (date, project name, event attribution).
 *
 * The value is editorial metadata, not a public badge: only
 * `pending-verification` surfaces to visitors (as a short caveat line), because
 * that is the only case where a reader could otherwise be misled.
 */
export type MediaVerificationStatus = "verified" | "community-record" | "pending-verification";

export interface CommunityMediaItem {
  /** Stable key. Used as the admin override primary key — never change it. */
  id: string;
  mediaType: "image" | "video";
  /** Public path under /public. */
  src: string;
  /** Poster frame for videos (an image path), if one exists. */
  poster?: string;
  title: string;
  description: string;
  /** Screen-reader text. Describes what is visible — never inferred identities. */
  altText: string;
  category: GalleryCategory;
  /** Event this item documents, if any — groups items into a story page. */
  event?: string;
  /** TIPU branch / chapter this item belongs to, if any. */
  branch?: string;
  /** ISO date, only where the exact day is on record. */
  eventDate?: string;
  /** Human-readable period, used where only the month is on record. */
  eventPeriod?: string;
  /** Only as precise as the archive states — never inferred from the image. */
  location?: string;
  /** Eligible to appear on the homepage / section lead slots. */
  featured: boolean;
  /** Publicly visible. `false` keeps the record without showing it to visitors. */
  published: boolean;
  verificationStatus: MediaVerificationStatus;
  /** Where the file came from. */
  source: string;
  /**
   * Shown to visitors when `verificationStatus` is `pending-verification`,
   * explaining exactly what is still unconfirmed.
   */
  verificationNote?: string;
  /** Approximate duration for videos, for the "Watch video" affordance. */
  durationLabel?: string;
  /** Video frame shape. */
  orientation?: "landscape" | "portrait";
  /** CSS object-position for custom focal framing of landscapes and landmarks. */
  objectPosition?: string;
  /** When true, renders an intentional branded placeholder rather than an image asset. */
  isPlaceholder?: boolean;
}

const TIPU_ARCHIVE = "Takete-Ide Progressive Union community archive";
const COMMUNITY_SUPPLIED = "Community-supplied photograph";

/** Event keys — referenced by the story pages so a typo can't silently empty a gallery. */
export const EVENTS = {
  centenaryAttire: "Official Takete-Ide Attire",
  lokojaMeeting: "TIPU Lokoja Branch Monthly Meeting",
  ukEuropeInaugural: "TIPU UK & Europe Chapter Inaugural Meeting",
  newYamIlorin: "TIPU Ilorin Branch New Yam Festival",
  communityAtWork: "Community at Work",
  palaceWorks: "Palace Building Works",
} as const;

/**
 * The imported community media library.
 *
 * Everything here is genuine community photography and video. Captions describe
 * only what the archive records or what is plainly visible; no individual is
 * named, and no location, role, award or project name is asserted beyond what
 * was supplied. Where a claim is outstanding the item carries
 * `pending-verification` plus a `verificationNote`.
 *
 * Editors change any of this from /admin/community-media without a deploy — see
 * lib/data/community-media.ts.
 */
export const communityMedia: CommunityMediaItem[] = [
  // ── A. Official attire ────────────────────────────────────────────────────
  {
    id: "centenary-attire-group",
    mediaType: "image",
    src: "/images/takete-ide/centenary-attire/attire-group.jpg",
    title: "Community members in the official Takete-Ide attire",
    description:
      "Four community members wearing the navy, red and blue striped official Takete-Ide attire, with sashes reading “Takete-Ide Cultural Ambassador”.",
    altText: "Takete-Ide attire displayed by community members at a celebration",
    category: "Centenary",
    event: EVENTS.centenaryAttire,
    featured: true,
    published: true,
    verificationStatus: "pending-verification",
    verificationNote:
      "Supplied as the official Takete-Ide attire. Items visible in this photograph carry Takete-Ide Day 2025 branding, so the year this particular set was worn is being confirmed with the organising committee.",
    source: TIPU_ARCHIVE,
  },
  {
    id: "centenary-attire-women",
    mediaType: "image",
    src: "/images/takete-ide/centenary-attire/attire-women.jpg",
    title: "Official attire — women's presentation",
    description:
      "Two women wearing the official Takete-Ide attire, showing the embroidered neckline and the striped weave of the cloth.",
    altText: "Official Takete-Ide attire worn by two women, showing embroidery and striped cloth",
    category: "Centenary",
    event: EVENTS.centenaryAttire,
    featured: false,
    published: false,
    verificationStatus: "community-record",
    source: TIPU_ARCHIVE,
  },
  {
    id: "centenary-archive-placeholder",
    mediaType: "image",
    src: "/images/takete-ide/places/first-baptist-church.jpg",
    title: "Centenary Archive",
    description: "Authentic community photograph being verified.",
    altText: "Centenary archive placeholder - authentic community photograph being verified",
    category: "Centenary",
    event: EVENTS.centenaryAttire,
    featured: false,
    published: true,
    isPlaceholder: true,
    verificationStatus: "pending-verification",
    source: TIPU_ARCHIVE,
  },
  {
    id: "centenary-attire-man",
    mediaType: "image",
    src: "/images/takete-ide/centenary-attire/attire-man.jpg",
    title: "Official attire — men's presentation",
    description:
      "The men's cut of the official Takete-Ide attire — agbádá and matching cap in the striped community cloth.",
    altText: "Official Takete-Ide attire worn with a matching cap, in striped navy, red and blue cloth",
    category: "Centenary",
    event: EVENTS.centenaryAttire,
    featured: false,
    published: true,
    verificationStatus: "community-record",
    source: TIPU_ARCHIVE,
  },
  {
    id: "centenary-attire-fabric",
    mediaType: "image",
    src: "/images/takete-ide/centenary-attire/attire-fabric.jpg",
    title: "The cloth",
    description:
      "Wrapped lengths of the official cloth as supplied — navy ground with red, white and pale blue stripes.",
    altText: "Detail of the Takete-Ide fabric: navy cloth with red, white and pale blue stripes, wrapped in packs",
    category: "Centenary",
    event: EVENTS.centenaryAttire,
    featured: false,
    published: true,
    verificationStatus: "community-record",
    source: TIPU_ARCHIVE,
  },

  // ── B. TIPU Lokoja Branch ─────────────────────────────────────────────────
  {
    id: "tipu-lokoja-branch-group",
    mediaType: "image",
    src: "/images/takete-ide/tipu-branches/lokoja-branch-group.jpg",
    title: "TIPU Lokoja Branch monthly meeting",
    description:
      "Members of the Takete-Ide Progressive Union Lokoja Branch gathered for their August 2026 monthly meeting.",
    altText: "Members of the TIPU Lokoja Branch standing together for a group photograph after a monthly meeting",
    category: "TIPU",
    event: EVENTS.lokojaMeeting,
    branch: "Lokoja Branch",
    eventDate: "2026-08-16",
    location: "Lokoja, Kogi State",
    featured: false,
    published: true,
    verificationStatus: "community-record",
    source: TIPU_ARCHIVE,
  },
  {
    id: "tipu-lokoja-meeting-01",
    mediaType: "image",
    src: "/images/takete-ide/tipu-branches/lokoja-meeting-01.jpg",
    title: "Members seated in session",
    description: "Branch members seated during the August 2026 Lokoja Branch monthly meeting.",
    altText: "Branch members seated in conversation during a TIPU Lokoja Branch meeting",
    category: "TIPU",
    event: EVENTS.lokojaMeeting,
    branch: "Lokoja Branch",
    eventDate: "2026-08-16",
    location: "Lokoja, Kogi State",
    featured: false,
    published: false,
    verificationStatus: "community-record",
    source: TIPU_ARCHIVE,
  },
  {
    id: "tipu-lokoja-meeting-02",
    mediaType: "image",
    src: "/images/takete-ide/tipu-branches/lokoja-meeting-02.jpg",
    title: "Branch members in discussion",
    description: "Members in discussion during the August 2026 Lokoja Branch monthly meeting.",
    altText: "Three TIPU Lokoja Branch members seated together during a meeting",
    category: "TIPU",
    event: EVENTS.lokojaMeeting,
    branch: "Lokoja Branch",
    eventDate: "2026-08-16",
    location: "Lokoja, Kogi State",
    featured: false,
    published: false,
    verificationStatus: "community-record",
    source: TIPU_ARCHIVE,
  },
  {
    id: "tipu-lokoja-meeting-03",
    mediaType: "image",
    src: "/images/takete-ide/tipu-branches/lokoja-meeting-03.jpg",
    title: "Meeting attendance",
    description: "Members attending the August 2026 Lokoja Branch monthly meeting.",
    altText: "Members seated across a room during a TIPU Lokoja Branch monthly meeting",
    category: "TIPU",
    event: EVENTS.lokojaMeeting,
    branch: "Lokoja Branch",
    eventDate: "2026-08-16",
    location: "Lokoja, Kogi State",
    featured: false,
    published: false,
    verificationStatus: "community-record",
    source: TIPU_ARCHIVE,
  },

  // ── C. TIPU UK & Europe Chapter ───────────────────────────────────────────
  {
    id: "tipu-uk-europe-inaugural-group",
    mediaType: "image",
    src: "/images/takete-ide/tipu-branches/uk-europe-inaugural-group.jpg",
    title: "TIPU UK & Europe Chapter members",
    description:
      "Members of the TIPU UK & Europe Chapter at the chapter's inaugural gathering in August 2026.",
    altText: "Members of the TIPU UK & Europe Chapter standing together outdoors after the inaugural meeting",
    category: "Diaspora",
    event: EVENTS.ukEuropeInaugural,
    branch: "UK & Europe Chapter",
    eventDate: "2026-08-19",
    featured: false,
    published: true,
    verificationStatus: "community-record",
    source: TIPU_ARCHIVE,
  },

  // ── D. TIPU Ilorin Branch New Yam Festival ────────────────────────────────
  {
    id: "new-yam-ilorin-full-group",
    mediaType: "image",
    src: "/images/takete-ide/new-yam-festival/full-group.jpg",
    title: "TIPU Ilorin Branch New Yam Festival",
    description:
      "Members of the TIPU Ilorin Branch gathered in matching celebration cloth at the branch's August 2026 New Yam celebration.",
    altText: "A large group of TIPU Ilorin Branch members in matching blue and white celebration cloth at the New Yam Festival",
    category: "Culture & Events",
    event: EVENTS.newYamIlorin,
    branch: "Ilorin Branch",
    eventDate: "2026-08-22",
    location: "Ilorin, Kwara State",
    featured: false,
    published: true,
    verificationStatus: "community-record",
    source: TIPU_ARCHIVE,
  },
  {
    id: "new-yam-ilorin-group",
    mediaType: "image",
    src: "/images/takete-ide/new-yam-festival/group.jpg",
    title: "Members in celebration cloth",
    description: "Branch members lined up in the shared celebration cloth chosen for the New Yam gathering.",
    altText: "TIPU Ilorin Branch members standing in a line wearing matching patterned celebration cloth",
    category: "Culture & Events",
    event: EVENTS.newYamIlorin,
    branch: "Ilorin Branch",
    eventDate: "2026-08-22",
    location: "Ilorin, Kwara State",
    featured: false,
    published: false,
    verificationStatus: "community-record",
    source: TIPU_ARCHIVE,
  },
  {
    id: "new-yam-ilorin-community-group",
    mediaType: "image",
    src: "/images/takete-ide/new-yam-festival/community-group.jpg",
    title: "Elders and members together",
    description: "Members and elders of the branch photographed together at the New Yam celebration.",
    altText: "A group of TIPU Ilorin Branch members and elders standing together in celebration dress",
    category: "Culture & Events",
    event: EVENTS.newYamIlorin,
    branch: "Ilorin Branch",
    eventDate: "2026-08-22",
    location: "Ilorin, Kwara State",
    featured: false,
    published: false,
    verificationStatus: "community-record",
    source: TIPU_ARCHIVE,
  },
  {
    id: "new-yam-ilorin-cultural-address",
    mediaType: "image",
    src: "/images/takete-ide/new-yam-festival/cultural-address.jpg",
    title: "Address to the gathering",
    description: "An address delivered to the gathering during the New Yam celebration.",
    altText: "A speaker in a beaded cap addressing the New Yam celebration with a microphone",
    category: "Culture & Events",
    event: EVENTS.newYamIlorin,
    branch: "Ilorin Branch",
    eventDate: "2026-08-22",
    location: "Ilorin, Kwara State",
    featured: true,
    published: true,
    verificationStatus: "community-record",
    source: TIPU_ARCHIVE,
  },
  {
    id: "new-yam-ilorin-award-presentation-01",
    mediaType: "image",
    src: "/images/takete-ide/new-yam-festival/award-presentation-01.jpg",
    title: "An award and recognition moment",
    description: "An award and recognition moment during the TIPU Ilorin Branch cultural gathering.",
    altText: "A commemorative plaque being presented during the TIPU Ilorin Branch New Yam celebration",
    category: "Culture & Events",
    event: EVENTS.newYamIlorin,
    branch: "Ilorin Branch",
    eventDate: "2026-08-22",
    location: "Ilorin, Kwara State",
    featured: false,
    published: true,
    verificationStatus: "community-record",
    source: TIPU_ARCHIVE,
  },
  {
    id: "new-yam-ilorin-award-presentation-02",
    mediaType: "image",
    src: "/images/takete-ide/new-yam-festival/award-presentation-02.jpg",
    title: "Recognition received",
    description: "A recipient holding the presented plaque during the branch's New Yam celebration.",
    altText: "A recipient holding a commemorative plaque and speaking into a microphone",
    category: "Culture & Events",
    event: EVENTS.newYamIlorin,
    branch: "Ilorin Branch",
    eventDate: "2026-08-22",
    location: "Ilorin, Kwara State",
    featured: false,
    published: false,
    verificationStatus: "community-record",
    source: TIPU_ARCHIVE,
  },
  {
    id: "new-yam-ilorin-guests",
    mediaType: "image",
    src: "/images/takete-ide/new-yam-festival/guests.jpg",
    title: "Guests at the celebration",
    description: "Guests and members photographed together at the New Yam celebration.",
    altText: "Four guests in celebration dress standing together under a marquee at the New Yam Festival",
    category: "Culture & Events",
    event: EVENTS.newYamIlorin,
    branch: "Ilorin Branch",
    eventDate: "2026-08-22",
    location: "Ilorin, Kwara State",
    featured: false,
    published: false,
    verificationStatus: "community-record",
    source: TIPU_ARCHIVE,
  },

  // ── E/F. New Yam Festival videos ──────────────────────────────────────────
  {
    id: "new-yam-ilorin-promo-video",
    mediaType: "video",
    src: "/videos/takete-ide/new-yam-ilorin-promo.mp4",
    poster: "/images/takete-ide/video-posters/new-yam-ilorin-promo.jpg",
    title: "TIPU Ilorin Branch New Yam Festival 2026 — Event Preview",
    description: "Promotional video for the TIPU Ilorin Branch New Yam Festival celebration.",
    altText: "Promotional video for the TIPU Ilorin Branch New Yam Festival",
    category: "Culture & Events",
    event: EVENTS.newYamIlorin,
    branch: "Ilorin Branch",
    eventDate: "2026-08-22",
    location: "Ilorin, Kwara State",
    featured: false,
    published: true,
    verificationStatus: "community-record",
    source: TIPU_ARCHIVE,
    durationLabel: "About 14 seconds",
    orientation: "portrait",
  },
  {
    id: "new-yam-ilorin-award-video",
    mediaType: "video",
    src: "/videos/takete-ide/new-yam-ilorin-award-presentation.mp4",
    poster: "/images/takete-ide/video-posters/new-yam-ilorin-award-presentation.jpg",
    title: "Award Presentation — TIPU Ilorin Branch New Yam Celebration",
    description: "An award and recognition moment during the TIPU Ilorin Branch cultural gathering.",
    altText: "Video of an award and recognition moment at the TIPU Ilorin Branch New Yam celebration",
    category: "Culture & Events",
    event: EVENTS.newYamIlorin,
    branch: "Ilorin Branch",
    eventDate: "2026-08-22",
    location: "Ilorin, Kwara State",
    featured: false,
    published: true,
    verificationStatus: "community-record",
    source: TIPU_ARCHIVE,
    durationLabel: "About 36 seconds",
    orientation: "portrait",
  },

  // ── G. Community development video ────────────────────────────────────────
  {
    id: "community-at-work-video",
    mediaType: "video",
    src: "/videos/takete-ide/community-at-work.mp4",
    poster: "/images/takete-ide/video-posters/community-at-work.jpg",
    title: "Community at Work",
    description:
      "Community activity recorded in Takete-Ide in August 2026, highlighting local attention to roads and the surrounding environment.",
    altText: "Video of community members on an unpaved road in Takete-Ide",
    category: "Development",
    event: EVENTS.communityAtWork,
    eventPeriod: "August 2026",
    location: "Takete-Ide, Amuro, Kogi State",
    featured: false,
    published: true,
    verificationStatus: "pending-verification",
    verificationNote:
      "Shared by the community on 18 August 2026 as “Community @ work”. The specific road and the exact nature of the work are not yet confirmed, so no project name is attached to this recording.",
    source: TIPU_ARCHIVE,
    durationLabel: "About 2 minutes",
    orientation: "landscape",
  },

  // ── Palace building works ─────────────────────────────────────────────────
  {
    id: "king-palace-construction-video",
    mediaType: "video",
    src: "/videos/takete-ide/king-palace-construction.mp4",
    poster: "/images/takete-ide/video-posters/king-palace-construction.jpg",
    title: "Palace Building Works",
    description:
      "Community footage of building works at the palace, supplied to the archive as “King's palace under construction”.",
    altText: "Video of building works in progress at the palace in Takete-Ide",
    category: "Development",
    event: EVENTS.palaceWorks,
    location: "Takete-Ide, Amuro, Kogi State",
    featured: false,
    published: true,
    verificationStatus: "pending-verification",
    verificationNote:
      "Supplied with the description “King's palace under construction”. The construction stage, dates and responsible parties have not been confirmed, so no project record is attached to this footage.",
    source: COMMUNITY_SUPPLIED,
    durationLabel: "Short clip",
    orientation: "landscape",
  },

  // ── Nature & Waterways ──────────────────────────────────────────────────
  {
    id: "obasoro-hill",
    mediaType: "image",
    src: "/images/takete-ide/places/obasoro-hill.jpg",
    title: "Obasoro Hill",
    description: "Obasoro Hill rising above the treeline at Takete-Ide.",
    altText: "Obasoro Hill, a wooded hill rising above dense green vegetation at Takete-Ide",
    category: "Nature",
    location: "Takete-Ide, Amuro, Kogi State",
    featured: true,
    published: true,
    objectPosition: "50% 15%",
    verificationStatus: "community-record",
    source: COMMUNITY_SUPPLIED,
  },
  {
    id: "eba-river-bank",
    mediaType: "image",
    src: "/images/takete-ide/places/eba-river-bank.jpg",
    title: "The bank of the Eba River",
    description: "The wide sandy bank of the Eba River (Omi Ebba) at Takete-Ide, under evening light.",
    altText: "The broad sandy bank of the Eba River with palms along the far bank at dusk",
    category: "Nature",
    location: "Takete-Ide, Amuro, Kogi State",
    featured: true,
    published: true,
    verificationStatus: "community-record",
    source: COMMUNITY_SUPPLIED,
  },
  {
    id: "eba-river",
    mediaType: "image",
    src: "/images/takete-ide/places/eba-river.jpg",
    title: "Eba River",
    description: "The Eba River (Omi Ebba) in flow, with palms and dense growth along the bank.",
    altText: "The Eba River in flow, with palm trees and dense vegetation along the far bank",
    category: "Nature",
    location: "Takete-Ide, Amuro, Kogi State",
    featured: true,
    published: true,
    verificationStatus: "community-record",
    source: COMMUNITY_SUPPLIED,
  },
  {
    id: "ighoruku-river",
    mediaType: "image",
    src: "/images/takete-ide/tipu-emblem.png",
    title: "Ighoruku River",
    description: "One of the waterways associated with the natural landscape of Takete-Ide.",
    altText: "Ighoruku River landmark placeholder — authentic river photograph coming soon",
    category: "Nature",
    location: "Takete-Ide, Amuro, Kogi State",
    featured: false,
    published: true,
    isPlaceholder: true,
    verificationStatus: "pending-verification",
    verificationNote: "Authentic river photograph coming soon",
    source: COMMUNITY_SUPPLIED,
  },
  {
    id: "owowo-river",
    mediaType: "image",
    src: "/images/takete-ide/tipu-emblem.png",
    title: "Owowo River",
    description: "One of the waterways associated with the natural landscape of Takete-Ide.",
    altText: "Owowo River landmark placeholder — authentic river photograph coming soon",
    category: "Nature",
    location: "Takete-Ide, Amuro, Kogi State",
    featured: false,
    published: true,
    isPlaceholder: true,
    verificationStatus: "pending-verification",
    verificationNote: "Authentic river photograph coming soon",
    source: COMMUNITY_SUPPLIED,
  },

  // ── Places of Worship ───────────────────────────────────────────────────
  {
    id: "first-baptist-church",
    mediaType: "image",
    src: "/images/takete-ide/places/first-baptist-church.jpg",
    title: "First Baptist Church, Takete-Ide",
    description: "The First Baptist Church building at Takete-Ide, with the hills behind it.",
    altText: "First Baptist Church building with a pitched roof at Takete-Ide, hills visible behind",
    category: "Places of Worship",
    location: "Takete-Ide, Amuro, Kogi State",
    featured: true,
    published: true,
    objectPosition: "50% 40%",
    verificationStatus: "community-record",
    source: COMMUNITY_SUPPLIED,
  },
  {
    id: "first-baptist-church-grounds",
    mediaType: "image",
    src: "/images/takete-ide/places/first-baptist-church-grounds.jpg",
    title: "First Baptist Church grounds",
    description: "A wider view of the First Baptist Church compound and its surrounding grounds.",
    altText: "A wide view of a church compound at Takete-Ide with trees, a block wall and open ground",
    category: "Places of Worship",
    location: "Takete-Ide, Amuro, Kogi State",
    featured: false,
    published: false,
    verificationStatus: "community-record",
    source: COMMUNITY_SUPPLIED,
  },
  {
    id: "church-of-god-in-christ",
    mediaType: "image",
    src: "/images/takete-ide/places/church-of-god-in-christ.jpg",
    title: "Church of God in Christ",
    description:
      "The Church of God in Christ building at Takete-Ide — an older structure of mud and timber construction.",
    altText: "A small older church building of mud and timber construction, standing on open ground",
    category: "Places of Worship",
    location: "Takete-Ide, Amuro, Kogi State",
    featured: true,
    published: true,
    verificationStatus: "community-record",
    source: COMMUNITY_SUPPLIED,
  },
  {
    id: "ecwa-church",
    mediaType: "image",
    src: "/images/takete-ide/places/ecwa-church.jpg",
    title: "ECWA Church premises",
    description: "The ECWA church premises at Takete-Ide, with an elevated water tank alongside.",
    altText: "Church premises at Takete-Ide with an unfinished block building and an elevated steel water tank",
    category: "Places of Worship",
    location: "Takete-Ide, Amuro, Kogi State",
    featured: false,
    published: true,
    verificationStatus: "community-record",
    source: COMMUNITY_SUPPLIED,
  },
  {
    id: "first-apostolic-church",
    mediaType: "image",
    src: "/images/takete-ide/tipu-emblem.png",
    title: "First Apostolic Church, Takete-Ide",
    description: "A Christian place of worship serving the Takete-Ide community.",
    altText: "First Apostolic Church Takete-Ide placeholder — authentic photograph coming soon",
    category: "Places of Worship",
    location: "Takete-Ide, Amuro, Kogi State",
    featured: false,
    published: true,
    isPlaceholder: true,
    verificationStatus: "pending-verification",
    verificationNote: "Authentic community photograph coming soon",
    source: COMMUNITY_SUPPLIED,
  },

  // ── Education ───────────────────────────────────────────────────────────
  {
    id: "takete-ide-primary-school",
    mediaType: "image",
    src: "/images/takete-ide/tipu-emblem.png",
    title: "Takete-Ide Primary School",
    description:
      "Primary educational institution in Takete-Ide, with grounds hosting Takete-Ide Day and Centenary gatherings.",
    altText: "Takete-Ide Primary School placeholder — authentic school photograph coming soon",
    category: "Education",
    location: "Takete-Ide, Amuro, Kogi State",
    featured: false,
    published: true,
    isPlaceholder: true,
    verificationStatus: "pending-verification",
    verificationNote: "Authentic school photograph coming soon",
    source: COMMUNITY_SUPPLIED,
  },
  {
    id: "gdss-takete-ide",
    mediaType: "image",
    src: "/images/takete-ide/tipu-emblem.png",
    title: "Government Day Secondary School, Takete-Ide",
    description: "Secondary school established through community initiative to serve students in Takete-Ide.",
    altText: "GDSS Takete-Ide placeholder — authentic school photograph coming soon",
    category: "Education",
    location: "Takete-Ide, Amuro, Kogi State",
    featured: false,
    published: true,
    isPlaceholder: true,
    verificationStatus: "pending-verification",
    verificationNote: "Authentic school photograph coming soon",
    source: COMMUNITY_SUPPLIED,
  },

  // ── Landmarks & Civic Development ─────────────────────────────────────────
  {
    id: "okuta-gbooro",
    mediaType: "image",
    src: "/images/takete-ide/places/okuta-gboro.png",
    title: "Okuta Gboro",
    description: "Okuta Gboro, one of the landscape landmarks associated with Takete-Ide.",
    altText: "Okuta Gboro, a prominent rock formation and landscape landmark at Takete-Ide",
    category: "Landmarks",
    location: "Takete-Ide, Amuro, Kogi State",
    featured: true,
    published: true,
    verificationStatus: "community-record",
    source: COMMUNITY_SUPPLIED,
  },
  {
    id: "takete-ide-town-hall",
    mediaType: "image",
    src: "/images/takete-ide/tipu-emblem.png",
    title: "Takete-Ide Town Hall",
    description: "Civic building and community gathering venue in Takete-Ide.",
    altText: "Takete-Ide Town Hall placeholder — authentic current photograph coming soon",
    category: "Landmarks",
    location: "Takete-Ide, Amuro, Kogi State",
    featured: false,
    published: true,
    isPlaceholder: true,
    verificationStatus: "pending-verification",
    verificationNote: "Authentic current photograph coming soon",
    source: COMMUNITY_SUPPLIED,
  },
  {
    id: "cvb-primary-health-centre",
    mediaType: "image",
    src: "/images/takete-ide/places/cvb-primary-health-centre.png",
    title: "CVB Primary Health Centre, Takete-Ide",
    description:
      "The CVB Primary Health Centre serving Takete-Ide in Mopamuro Local Government Area, Kogi State.",
    altText: "Building facade and signboard of the CVB Primary Health Centre at Takete-Ide",
    category: "Development",
    location: "Takete-Ide, Amuro, Kogi State",
    featured: true,
    published: true,
    verificationStatus: "community-record",
    source: COMMUNITY_SUPPLIED,
  },
  {
    id: "telecoms-mast",
    mediaType: "image",
    src: "/images/takete-ide/places/telecoms-mast.jpg",
    title: "Telecommunications mast",
    description:
      "A telecommunications mast serving Takete-Ide — part of the community's connectivity infrastructure.",
    altText: "A red and white telecommunications mast standing above green vegetation beside a dirt road",
    category: "Development",
    location: "Takete-Ide, Amuro, Kogi State",
    featured: false,
    published: true,
    verificationStatus: "community-record",
    source: COMMUNITY_SUPPLIED,
  },

  // ── Authentic Culture, Heritage & Traditional Institution Additions ────────
  {
    id: "egungun-festival",
    mediaType: "image",
    src: "/images/takete-ide/heritage/egungun-festival.png",
    title: "Egungun Festival, Takete-Ide",
    description: "A community cultural gathering featuring Egungun masquerade traditions in Takete-Ide.",
    altText: "Community members gathered around an Egungun masquerade at a cultural celebration in Takete-Ide",
    category: "Culture & Events",
    location: "Takete-Ide, Amuro, Kogi State",
    featured: true,
    published: true,
    verificationStatus: "community-record",
    source: COMMUNITY_SUPPLIED,
  },
  {
    id: "ogun-festival",
    mediaType: "image",
    src: "/images/takete-ide/heritage/ogun-festival.png",
    title: "Ogun Festival, Takete-Ide",
    description: "A community gathering associated with the Ogun Festival tradition in Takete-Ide.",
    altText: "A cultural gathering of community members associated with the Ogun Festival in Takete-Ide",
    category: "Culture & Events",
    location: "Takete-Ide, Amuro, Kogi State",
    featured: true,
    published: true,
    verificationStatus: "community-record",
    source: COMMUNITY_SUPPLIED,
  },
  {
    id: "traditional-dignitaries",
    mediaType: "image",
    src: "/images/takete-ide/heritage/traditional-dignitaries.png",
    title: "Traditional & Community Dignitaries",
    description: "Traditional and community dignitaries at a Takete-Ide gathering.",
    altText: "Traditional and community leaders seated together in ceremonial attire at a Takete-Ide gathering",
    category: "Traditional Institution",
    location: "Takete-Ide, Amuro, Kogi State",
    featured: true,
    published: true,
    verificationStatus: "community-record",
    source: COMMUNITY_SUPPLIED,
  },
  {
    id: "oba-philip-ebilakun-portrait",
    mediaType: "image",
    src: "/images/takete-ide/heritage/oba-philip-ebilakun.png",
    title: "Oba Philip Ebilakun",
    description:
      "Portrait of Oba Philip Ebilakun, identified in the supplied community historical manuscript as the thirteenth Olu’de of Takete-Ide.",
    altText: "Portrait of Oba Philip Ebilakun in royal attire",
    category: "Traditional Institution",
    location: "Takete-Ide, Amuro, Kogi State",
    featured: false,
    published: true,
    verificationStatus: "community-record",
    source: COMMUNITY_SUPPLIED,
  },
  {
    id: "traditional-marriage-gifts-01",
    mediaType: "image",
    src: "/images/takete-ide/heritage/traditional-marriage-gifts-01.png",
    title: "Traditional Marriage Gifts & Household Preparation",
    description: "Household items and gifts presented as part of a Takete-Ide marriage celebration.",
    altText: "Household items and gift presentations prepared for a traditional marriage ceremony in Takete-Ide",
    category: "Culture & Events",
    location: "Takete-Ide, Amuro, Kogi State",
    featured: true,
    published: true,
    verificationStatus: "community-record",
    source: COMMUNITY_SUPPLIED,
  },
  {
    id: "traditional-marriage-gifts-02",
    mediaType: "image",
    src: "/images/takete-ide/heritage/traditional-marriage-gifts-02.png",
    title: "Marriage Celebration & Gift Presentation",
    description: "Household items, gifts and community gathering for a marriage celebration in Takete-Ide.",
    altText: "Gift presentations and gathering of family members at a Takete-Ide traditional marriage celebration",
    category: "Culture & Events",
    location: "Takete-Ide, Amuro, Kogi State",
    featured: true,
    published: true,
    verificationStatus: "community-record",
    source: COMMUNITY_SUPPLIED,
  },
  {
    id: "short-view-of-takete-ide",
    mediaType: "video",
    src: "/videos/takete-ide/short-view-of-takete-ide.mp4",
    title: "A Short View of Takete-Ide",
    description: "A brief view of the road, landscape and everyday environment of Takete-Ide.",
    altText: "A brief video showing the unpaved road, landscape and environment of Takete-Ide",
    category: "Community Life",
    location: "Takete-Ide, Amuro, Kogi State",
    featured: false,
    published: true,
    durationLabel: "17s",
    orientation: "landscape",
    verificationStatus: "community-record",
    source: COMMUNITY_SUPPLIED,
  },
];

/**
 * The three photographs that lead the homepage's "The Land We Come From"
 * section. Takete-Ide is a somewhere before it is anything else, so the land
 * gets its own section rather than a slot in a photo strip.
 */
export const HOMEPAGE_PLACE_ORDER = ["obasoro-hill", "eba-river-bank", "first-baptist-church"] as const;

/**
 * Order of the homepage photo strip, which runs *after* the place section and
 * deliberately shares nothing with it — no photograph appears twice on the
 * homepage. This sequence reads culture -> diaspora -> heritage dress -> union
 * -> landmark, and the page adds one existing community photograph after it.
 * Everything else from the archive lives deeper in the site. Editors can drop
 * an item out of either group by unfeaturing it in /admin/community-media — no
 * deploy needed.
 */
export const HOMEPAGE_MEDIA_ORDER = [
  "centenary-attire-group",
  "new-yam-ilorin-cultural-address",
  "church-of-god-in-christ",
  "eba-river",
] as const;

/** Lookup by stable id. */
export function findCommunityMedia(id: string): CommunityMediaItem | undefined {
  return communityMedia.find((m) => m.id === id);
}
