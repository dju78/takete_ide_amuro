/**
 * Structured website-ready content module for Takete-Ide historical narrative.
 *
 * Distilled faithfully from the community historical account while strictly
 * separating documented historical dates, community accounts, oral traditions,
 * and cultural beliefs.
 */

export type SourceType =
  | "community-historical-account"
  | "oral-tradition"
  | "cultural-tradition"
  | "documented-date"
  | "administrative-record";

export type VerificationStatus =
  | "verified"
  | "community-account"
  | "oral-tradition"
  | "pending-verification";

export interface HistoricalSection {
  id: string;
  order: number;
  title: string;
  subtitle?: string;
  period: string;
  sourceType: SourceType;
  verificationStatus: VerificationStatus;
  summary: string;
  keyPoints: string[];
  editorialNote?: string;
}

export const OUR_STORY_SECTIONS: HistoricalSection[] = [
  {
    id: "takete-idera-place-of-comfort",
    order: 1,
    title: "Takete-Idera — A Place of Comfort",
    subtitle: "Meaning, Landscape and Community Character",
    period: "Continuous / Modern Era",
    sourceType: "community-historical-account",
    verificationStatus: "community-account",
    summary:
      "Takete-Idera, frequently shortened to Takete-Ide in daily speech, literally signifies being separated to a place of comfort, rest, and peace. Situated on a fertile plain surrounded by picturesque uplands in MopAmuro LGA, the community is known for its serene landscape and hospitable, education-loving people.",
    keyPoints: [
      "The name reflects the community's eventual attainment of peace and tranquility after historic migrations.",
      "Located in Amuro District, MopAmuro LGA, approximately 18 km from Mopa and 16 km off the Kabba–Ilorin road at Effo-Amuro.",
      "Features rich natural hydrology including the Eba River, Owowo River, Oga, and numerous pristine streams.",
    ],
  },
  {
    id: "takete-within-amuro",
    order: 2,
    title: "Takete within Amuro",
    subtitle: "The Seven Towns and Traditional Governance",
    period: "18th–20th Century to Present",
    sourceType: "administrative-record",
    verificationStatus: "verified",
    summary:
      "Takete-Ide is the second largest of the seven historic towns that make up Amuro District. The towns share cultural, historical, and geographical bonds, each maintaining its own traditional council under its Oba, while participating in the wider Amuro Traditional Council headed by the Alamuro of Amuro.",
    keyPoints: [
      "The seven towns of Amuro are Takete-Ide, Orokere, Aiyede, Okagi, Aiyedayo/Iloke, Otafun, and Aiyeteju Agbajogun.",
      "Takete-Ide occupies a central position, sharing direct boundaries with Otafun, Ayedayo, and Ayede.",
      "Hosts an Area Office of the MopAmuro Local Government, established following council creation in 1991.",
    ],
  },
  {
    id: "earlier-roots-and-yagba-ancestry",
    order: 3,
    title: "Earlier Roots & Yagba Ancestry",
    subtitle: "Okun Identity and Dispersal Narratives",
    period: "Ancient / Early Historical Era",
    sourceType: "oral-tradition",
    verificationStatus: "oral-tradition",
    summary:
      "Amuro people belong to the Iyagba (Yagba) ethnic stock of the Okun Yoruba sub-group. Oral traditions preserve complementary dispersal narratives from ancient Yoruba centers—one linking ancestral leadership to Ile-Ife ('Iya agba lo jemi'), and another connecting lineages to Old Oyo—both affirming deep Yoruba ancestry and independent clan-based governance.",
    keyPoints: [
      "Okun identity unites Iyagba, Owe, Bunu, Ijumu, Gbede, Kiri, and Oworo communities across the Confluence region.",
      "The salutation 'Okun' signifies strength, life, and goodwill.",
      "Traditional social organization was historically centered around families, clans, and councils of elders.",
    ],
    editorialNote:
      "Oral tradition preserves multiple ancestral accounts reflecting historical migrations from Ile-Ife and Oyo-Ile.",
  },
  {
    id: "amuro-odo-ancestral-hearth",
    order: 4,
    title: "Amuro-Odo — The Ancestral Hearth",
    subtitle: "Shared Settlement before Regional Conflict",
    period: "Pre-19th Century",
    sourceType: "community-historical-account",
    verificationStatus: "community-account",
    summary:
      "According to community accounts, the kindred groups of Amuro originally lived together in a fertile plain settlement known as Amuro-Odo. The community flourished in farming and craftsmanship until 19th-century regional instability disrupted the peace of the Confluence basin.",
    keyPoints: [
      "Amuro-Odo was the shared ancestral home of Amuro communities prior to 19th-century dispersal.",
      "The settlement included kin who later settled across Amuro towns as well as Itedo Amuro in Isanlu.",
      "Fertile low-lying terrain became vulnerable to external cavalry incursions during 19th-century warfare.",
    ],
  },
  {
    id: "the-search-for-peace",
    order: 5,
    title: "The Search for Peace",
    subtitle: "19th-Century Turmoil and Fortification",
    period: "19th Century",
    sourceType: "community-historical-account",
    verificationStatus: "community-account",
    summary:
      "During the nineteenth century, the wider Confluence area was convulsed by regional conflicts, including Nupe raids and subsequent expansionist incursions. Faced with recurrent threats to safety, community elders took the strategic decision to disperse from open plains into defensible upland forests and hills.",
    keyPoints: [
      "Part of the broader 19th-century conflict across the Middle Niger and Confluence regions.",
      "Prompted strategic migrations into rocky, forested highlands offering natural defense.",
      "Community defense relied on traditional vigilance, coordination, and protective hill terrain.",
    ],
  },
  {
    id: "igbo-ide-forest-refuge",
    order: 6,
    title: "Igbo Ide — The Forest of Comfort",
    subtitle: "First Stage of Dispersal",
    period: "Early to Mid-19th Century",
    sourceType: "community-historical-account",
    verificationStatus: "community-account",
    summary:
      "Upon leaving Amuro-Odo, the ancestors of Takete and their close kinsmen of Otafun moved east into a thick fertile forest named Igbo Ide (Igbo Idera), meaning 'grove of comfort'. When cavalry incursions eventually reached the grove, the groups resolved to seek more heavily fortified upland terrain further south.",
    keyPoints: [
      "Initial place of solace shared by the ancestors of Takete and Otafun.",
      "Located north of the modern Takete-Ide–Aghara road, today remembered as a historic site.",
      "Renewed conflicts led the groups to advance southward into the mountain ranges.",
    ],
  },
  {
    id: "ilu-oke-life-on-the-hills",
    order: 7,
    title: "Ilu-Oke — Life on the Hills",
    subtitle: "Centuries of Highland Settlement and Resilience",
    period: "19th Century to Early 20th Century",
    sourceType: "community-historical-account",
    verificationStatus: "community-account",
    summary:
      "The migrating Takete community advanced to the uplands and founded Ilu-Oke ('Town on the Hill'), southeast of the present town. The rugged landscape made cavalry attacks ineffective. Here the people lived for generations, fortified their community, and established the sacred sanctuary of Agbagba Ide.",
    keyPoints: [
      "Ilu-Oke served as a secure upland settlement for generations during periods of regional warfare.",
      "The community successfully repelled incursions, aided by defensible topography and local wisdom.",
      "Sanctuary traditions associated with the natural rock haven of Agbagba Ide emerged during this era.",
    ],
  },
  {
    id: "okeata-and-upland-movements",
    order: 8,
    title: "Okeata & Upland Movements",
    subtitle: "Temporary Movements and Mountain Redoubts",
    period: "Late 19th Century",
    sourceType: "community-historical-account",
    verificationStatus: "community-account",
    summary:
      "During periods of renewed regional conflict involving Ibadan and Nupe campaigns, segments of the community moved deeper into the surrounding hills to Okeata near the Odede area, while other groups guarded established lines from Okuta Gbooro to Oke Eba. As peace returned, families gradually converged toward agricultural lands.",
    keyPoints: [
      "Upland terrain provided tactical retreats during peak regional turbulence.",
      "The Eseyin Meleri and Eseyin Telu lineages played key roles in defending and farming arable tracts.",
      "Gradual stabilization paved the way for the eventual return to fertile lowlands.",
    ],
  },
  {
    id: "home-at-last-descent-c1926",
    order: 9,
    title: "Home at Last — Descent to the Plains",
    subtitle: "The 1926 Relocation to the Present Site",
    period: "c.1926",
    sourceType: "community-historical-account",
    verificationStatus: "community-account",
    summary:
      "Around 1926, led by hunter-surveyors such as Pa Thomas Ode and affirmed by community consensus, the people descended from the hill settlements of Ilu-Oke to the fertile plain below. The quarters of Odo Takete, Oke Adan, and Oke Ako established the modern town, initially naming it Ileteju before affirming the historic name Takete-Idera.",
    keyPoints: [
      "The descent to the present low-plain site occurred in 1926 or thereabouts.",
      "Community memory commemorates Pa George Fiki as the first child born in the new settlement.",
      "The new site offered fertile farmland, abundant water, and enduring peace.",
    ],
    editorialNote:
      "The c.1926 date marks the relocation from Ilu-Oke to the plains, not the founding of the ancient community itself.",
  },
  {
    id: "present-day-takete-ide",
    order: 10,
    title: "Present-Day Takete-Ide",
    subtitle: "Unity, Progress and Centenary Milestone",
    period: "1926 to Present",
    sourceType: "administrative-record",
    verificationStatus: "verified",
    summary:
      "For nearly a century at its present site, Takete-Ide has enjoyed unbroken communal harmony and progress. Organized under the traditional leadership of the Olu'de and the civic coordination of the Takete-Ide Progressive Union (TIPU), the community looks forward to commemorating 100 years at its current settlement in 2026.",
    keyPoints: [
      "A century of peaceful co-existence, civic development, and education-driven advancement.",
      "Governance shared between the traditional institution (Olu'de-in-Council) and the civic union (TIPU).",
      "The 2026 Centenary celebrates 100 years of flourishing at the present settlement (c.1926–2026).",
    ],
  },
];
