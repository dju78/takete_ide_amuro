import type { VerificationStatus } from "@/types/content";

export interface ChurchDirectoryItem {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  displayOrder: number;
  denomination: string;
  image: string | null;
  imageAlt: string | null;
  imageCaption: string | null;
  summary: string;
  historyStatus: string;
  established: string | null;
  establishedQualifier: string | null;
  featured: boolean;
  sourceStatus: VerificationStatus;
  profileHref?: string;
  hasFullProfile: boolean;
}

/**
 * EXACT display order for Takete-Ide Churches as specified in historical guidelines:
 * 1. First ECWA Church, Takete-Ide
 * 2. First Baptist Church, Takete-Ide
 * 3. The Apostolic Church, Takete-Ide
 * 4. Christ Apostolic Church (CAC), Takete-Ide
 * 5. Cherubim and Seraphim Church, Takete-Ide
 * 6. Second ECWA Church, Takete-Ide
 * 7. Redeemed Christian Church of God (RCCG), Takete-Ide
 * 8. Church of God in Christ, Takete-Ide
 * 9. Seed of Christ Golden Church (Sebioba), Takete-Ide
 * 10. Second Apostolic Church, Takete-Ide
 * 11. Healing Church, Takete-Ide
 * 12. Deeper Life Bible Church, Takete-Ide
 * 13. Christ Bible Baptist Church, Takete-Ide
 *
 * DO NOT sort alphabetically.
 * DO NOT group ECWA or Apostolic churches together.
 */
export const CHURCHES_DIRECTORY: ChurchDirectoryItem[] = [
  {
    id: "first-ecwa-church",
    slug: "first-ecwa-church",
    name: "First ECWA Church, Takete-Ide",
    shortName: "First ECWA Church",
    displayOrder: 1,
    denomination: "Evangelical Church Winning All (ECWA) / formerly SIM",
    image: "/images/takete-ide/places/first-ecwa-church-takete-ide.jpg",
    imageAlt: "First ECWA Church building in Takete-Ide",
    imageCaption: "First ECWA Church, Takete-Ide — present-day church building.",
    summary:
      "SIM Christianity was introduced in Takete-Ide in 1919, according to the community historical record. Preserved First Baptist historical accounts confirm that an SIM Christian congregation was already active in Takete-Ide by 1922. Fuller congregational history is being documented.",
    historyStatus: "Early Christian Heritage — fuller church history being documented.",
    established: null,
    establishedQualifier: "SIM introduced 1919 per community record; active SIM congregation documented by 1922 in Baptist records",
    featured: true,
    sourceStatus: "community_tradition",
    hasFullProfile: false,
  },
  {
    id: "first-baptist-church",
    slug: "first-baptist-church",
    name: "First Baptist Church, Takete-Ide",
    shortName: "First Baptist Church",
    displayOrder: 2,
    denomination: "Nigerian Baptist Convention",
    image: "/images/takete-ide/places/first-baptist-church.jpg",
    imageAlt: "First Baptist Church building in Takete-Ide",
    imageCaption: "First Baptist Church, Takete-Ide — present-day church building.",
    summary:
      "Established in November 1922 following early missionary outreach in Takete-Ide. Founded by Pa Joash Agunbiade, Pa Luke Olorunleke, Pa Paul Amora, Pa Saul Akedi, Pa Noah Omoyele and Pa Alfred Eseyin.",
    historyStatus: "Documented Historical Profile",
    established: "November 1922",
    establishedQualifier: "Documented in preserved church historical account",
    featured: true,
    sourceStatus: "documentary_evidence",
    profileHref: "/heritage/faith/first-baptist-church",
    hasFullProfile: true,
  },
  {
    id: "the-apostolic-church",
    slug: "the-apostolic-church",
    name: "The Apostolic Church, Takete-Ide",
    shortName: "The Apostolic Church",
    displayOrder: 3,
    denomination: "The Apostolic Church Nigeria",
    image: null,
    imageAlt: null,
    imageCaption: null,
    summary:
      "An established Christian congregation serving the spiritual and community life of Takete-Ide across generations.",
    historyStatus: "Historical profile being documented.",
    established: null,
    establishedQualifier: "Date to be confirmed from church records",
    featured: false,
    sourceStatus: "unverified",
    hasFullProfile: false,
  },
  {
    id: "christ-apostolic-church",
    slug: "christ-apostolic-church",
    name: "Christ Apostolic Church (CAC), Takete-Ide",
    shortName: "Christ Apostolic Church (CAC)",
    displayOrder: 4,
    denomination: "Christ Apostolic Church (CAC)",
    image: null,
    imageAlt: null,
    imageCaption: null,
    summary:
      "An established Christian congregation serving the Takete-Ide community. Historical records and leadership succession are currently being gathered.",
    historyStatus: "Historical profile being documented.",
    established: null,
    establishedQualifier: "Date to be confirmed from church records",
    featured: false,
    sourceStatus: "unverified",
    hasFullProfile: false,
  },
  {
    id: "cherubim-and-seraphim",
    slug: "cherubim-and-seraphim",
    name: "Cherubim and Seraphim Church, Takete-Ide",
    shortName: "Cherubim & Seraphim",
    displayOrder: 5,
    denomination: "Cherubim and Seraphim Church",
    image: null,
    imageAlt: null,
    imageCaption: null,
    summary:
      "An established place of worship in Takete-Ide. Church archives and founding accounts are being documented with church elders.",
    historyStatus: "Historical profile being documented.",
    established: null,
    establishedQualifier: "Date to be confirmed from church records",
    featured: false,
    sourceStatus: "unverified",
    hasFullProfile: false,
  },
  {
    id: "second-ecwa-church",
    slug: "second-ecwa-church",
    name: "Second ECWA Church, Takete-Ide",
    shortName: "Second ECWA Church",
    displayOrder: 6,
    denomination: "Evangelical Church Winning All (ECWA)",
    image: "/images/takete-ide/places/second-ecwa-church-takete-ide.jpg",
    imageAlt: "Second ECWA Church building in Takete-Ide",
    imageCaption: "Second ECWA Church, Takete-Ide — present-day church building.",
    summary:
      "ECWA Christian congregation serving the Takete-Ide community. A distinct congregation from First ECWA Church. Foundation and development history are currently being compiled.",
    historyStatus: "Historical profile being documented.",
    established: null,
    establishedQualifier: "Date to be confirmed from church records",
    featured: false,
    sourceStatus: "unverified",
    hasFullProfile: false,
  },
  {
    id: "rccg",
    slug: "rccg",
    name: "Redeemed Christian Church of God (RCCG), Takete-Ide",
    shortName: "RCCG",
    displayOrder: 7,
    denomination: "The Redeemed Christian Church of God (RCCG)",
    image: null,
    imageAlt: null,
    imageCaption: null,
    summary:
      "A Christian parish serving the Takete-Ide community. Detailed branch establishment records are being compiled.",
    historyStatus: "Historical profile being documented.",
    established: null,
    establishedQualifier: "Date to be confirmed from church records",
    featured: false,
    sourceStatus: "unverified",
    hasFullProfile: false,
  },
  {
    id: "church-of-god-in-christ",
    slug: "church-of-god-in-christ",
    name: "Church of God in Christ, Takete-Ide",
    shortName: "Church of God in Christ",
    displayOrder: 8,
    denomination: "Church of God in Christ (COGIC)",
    image: "/images/takete-ide/places/church-of-god-in-christ.jpg",
    imageAlt: "Church of God in Christ building in Takete-Ide",
    imageCaption: "Church of God in Christ, Takete-Ide — building of mud and timber construction.",
    summary:
      "An established place of Christian worship in Takete-Ide, featuring a historic building structure of mud and timber construction. Parish history is being gathered.",
    historyStatus: "Historical profile being documented.",
    established: null,
    establishedQualifier: "Date to be confirmed from church records",
    featured: true,
    sourceStatus: "community_tradition",
    hasFullProfile: false,
  },
  {
    id: "seed-of-christ-golden-church",
    slug: "seed-of-christ-golden-church",
    name: "Seed of Christ Golden Church (Sebioba), Takete-Ide",
    shortName: "Seed of Christ Golden Church (Sebioba)",
    displayOrder: 9,
    denomination: "Seed of Christ Golden Church",
    image: null,
    imageAlt: null,
    imageCaption: null,
    summary:
      "Christian congregation serving the Takete-Ide community. Founding details and parish history are being compiled with church leadership.",
    historyStatus: "Historical profile being documented.",
    established: null,
    establishedQualifier: "Date to be confirmed from church records",
    featured: false,
    sourceStatus: "unverified",
    hasFullProfile: false,
  },
  {
    id: "second-apostolic-church",
    slug: "second-apostolic-church",
    name: "Second Apostolic Church, Takete-Ide",
    shortName: "Second Apostolic Church",
    displayOrder: 10,
    denomination: "The Apostolic Church Nigeria",
    image: null,
    imageAlt: null,
    imageCaption: null,
    summary:
      "An established Christian congregation serving the Takete-Ide community. A distinct assembly from The Apostolic Church. Foundation and parish records are currently being compiled.",
    historyStatus: "Historical profile being documented.",
    established: null,
    establishedQualifier: "Date to be confirmed from church records",
    featured: false,
    sourceStatus: "unverified",
    hasFullProfile: false,
  },
  {
    id: "healing-church",
    slug: "healing-church",
    name: "Healing Church, Takete-Ide",
    shortName: "Healing Church",
    displayOrder: 11,
    denomination: "Healing Church",
    image: null,
    imageAlt: null,
    imageCaption: null,
    summary:
      "A Christian place of worship serving the Takete-Ide community. Assembly history and documentation are currently in progress.",
    historyStatus: "Historical profile being documented.",
    established: null,
    establishedQualifier: "Date to be confirmed from church records",
    featured: false,
    sourceStatus: "unverified",
    hasFullProfile: false,
  },
  {
    id: "deeper-life-bible-church",
    slug: "deeper-life-bible-church",
    name: "Deeper Life Bible Church, Takete-Ide",
    shortName: "Deeper Life Bible Church",
    displayOrder: 12,
    denomination: "Deeper Christian Life Ministry",
    image: null,
    imageAlt: null,
    imageCaption: null,
    summary:
      "A Christian congregation in Takete-Ide. Parish records and local church history are currently being compiled.",
    historyStatus: "Historical profile being documented.",
    established: null,
    establishedQualifier: "Date to be confirmed from church records",
    featured: false,
    sourceStatus: "unverified",
    hasFullProfile: false,
  },
  {
    id: "christ-bible-baptist-church",
    slug: "christ-bible-baptist-church",
    name: "Christ Bible Baptist Church, Takete-Ide",
    shortName: "Christ Bible Baptist Church",
    displayOrder: 13,
    denomination: "Baptist",
    image: null,
    imageAlt: null,
    imageCaption: null,
    summary:
      "A Baptist congregation serving the Takete-Ide community. Church records and history are currently being compiled.",
    historyStatus: "Historical profile being documented.",
    established: null,
    establishedQualifier: "Date to be confirmed from church records",
    featured: false,
    sourceStatus: "unverified",
    hasFullProfile: false,
  },
];

/** Retrieve all churches sorted strictly by displayOrder. */
export function getAllChurches(): ChurchDirectoryItem[] {
  return [...CHURCHES_DIRECTORY].sort((a, b) => a.displayOrder - b.displayOrder);
}

/** Lookup a church by slug. */
export function getChurchBySlug(slug: string): ChurchDirectoryItem | undefined {
  return CHURCHES_DIRECTORY.find((c) => c.slug === slug);
}
