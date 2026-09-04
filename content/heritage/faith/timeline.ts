import type { VerificationStatus } from "@/types/content";

export interface ReligiousTimelineEntry {
  id: string;
  yearLabel: string;
  title: string;
  description: string;
  status: VerificationStatus;
  statusNote?: string;
  regionalContext?: boolean;
}

export const RELIGIOUS_HERITAGE_TIMELINE: ReligiousTimelineEntry[] = [
  {
    id: "pre-christian-heritage",
    yearLabel: "Before Christianity",
    title: "Indigenous Religious Heritage & Beliefs",
    description:
      "Takete-Ide maintained an established indigenous religious worldview centred on belief in a Supreme Being (Orisa Oke, Olu Orun, Obarisa). Community spiritual life included prayer, libation, sacrifice, divination and consultation with spiritual intermediaries. Major traditional groupings included Agado and Oliwo, celebrated in annual festivals and masquerade traditions including Akorowo, Ate, Origi, Apa Rege Rege, Otutumoba, and veneration of Otegun, Orisa, and Alase.",
    status: "community_tradition",
    statusNote: "Preserved in the supplied community historical manuscript and living oral traditions.",
  },
  {
    id: "sim-1905-ogga",
    yearLabel: "1905",
    title: "E. P. Lang Reaches Ogga (Regional SIM Expansion)",
    description:
      "Mr. E. P. Lang, joining the Patigi SIM group, treks to Ogga in Yagba West, marking the initial recorded entry of the Sudan Interior Mission into the wider Yagba region, where he encountered local readers of the Yoruba Bible.",
    status: "documentary_evidence",
    statusNote: "Historical regional missionary record.",
    regionalContext: true,
  },
  {
    id: "sim-1908-titcombe",
    yearLabel: "1908",
    title: "Tommie Titcombe Arrives at Egbe (Regional Base)",
    description:
      "Rev. Tommie (Thomas) Titcombe arrives in Yagba and establishes a major SIM mission base at Egbe, mastering the Yagba dialect and combining evangelism with medical and community welfare work.",
    status: "documentary_evidence",
    statusNote: "Historical regional missionary record.",
    regionalContext: true,
  },
  {
    id: "sim-1909-sermon-baptism",
    yearLabel: "1909",
    title: "First Yagba Sermon & Early Baptisms at Ogga",
    description:
      "In May 1909, Titcombe preaches in the Yagba dialect inside Egbe market. On 31 October 1909, ten men and three women are baptised in Ogga — the first recorded SIM baptismal service in Yagbaland.",
    status: "documentary_evidence",
    statusNote: "Historical regional missionary record.",
    regionalContext: true,
  },
  {
    id: "sim-1912-egbe-baptism",
    yearLabel: "1912",
    title: "Major Baptism Service at Egbe",
    description:
      "Following the arrival of Rev. W. Playfair in 1911, Egbe witnesses a large baptism of 119 converts (83 men and 36 women), consolidating Christian missionary presence across the Yagba area.",
    status: "documentary_evidence",
    statusNote: "Historical regional missionary record.",
    regionalContext: true,
  },
  {
    id: "sim-1915-egbe-conference",
    yearLabel: "1915",
    title: "First Egbe Annual Conference",
    description:
      "The first Egbe Annual Conference is convened, during which another 100 believers receive water immersion baptism, demonstrating the widening regional reach of the mission.",
    status: "documentary_evidence",
    statusNote: "Historical regional missionary record.",
    regionalContext: true,
  },
  {
    id: "sim-1919-takete-record",
    yearLabel: "1919",
    title: "SIM Christianity Introduced in Takete-Ide (Community Record)",
    description:
      "According to the community historical record, SIM Christianity was introduced to Takete-Ide around 1919. This date reflects community tradition and requires further documentary confirmation from early church registers.",
    status: "community_tradition",
    statusNote: "Community historical record; subject to ongoing documentary confirmation.",
  },
  {
    id: "sim-1922-active-congregation",
    yearLabel: "1922",
    title: "Rev. Titcombe Visits Takete-Ide; SIM Congregation Active",
    description:
      "Rev. Tommie Titcombe visits Takete-Ide during preparations for an early baptism. Preserved historical records confirm that an SIM Christian congregation was already actively worshipping in the community at this time.",
    status: "documentary_evidence",
    statusNote: "Documented in the preserved First Baptist Church historical account.",
  },
  {
    id: "baptist-nov-1922-founding",
    yearLabel: "November 1922",
    title: "First Baptist Church, Takete-Ide Established",
    description:
      "Six founding leaders (Pa Joash Agunbiade, Pa Luke Olorunleke, Pa Paul Amora, Pa Saul Akedi, Pa Noah Omoyele and Pa Alfred Eseyin), with the support of their wives, establish First Baptist Church in Takete-Ide following doctrine-related baptismal disagreements within the SIM congregation.",
    status: "documentary_evidence",
    statusNote: "Preserved church historical account and community archive.",
  },
  {
    id: "later-denominational-growth",
    yearLabel: "Later Decades",
    title: "Denominational Growth & Contemporary Places of Worship",
    description:
      "In subsequent decades, additional Christian denominations establish congregations in Takete-Ide — including The Apostolic Church, Christ Apostolic Church (CAC), Cherubim and Seraphim Church, Second ECWA Church, Redeemed Christian Church of God (RCCG), Church of God in Christ, Seed of Christ Golden Church (Sebioba), Second Apostolic Church, Healing Church, Deeper Life Bible Church, and Christ Bible Baptist Church.",
    status: "community_tradition",
    statusNote: "Community places of worship; individual archival records in progress.",
  },
];
