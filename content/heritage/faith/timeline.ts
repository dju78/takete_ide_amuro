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
    title: "SIM Christianity Introduced in Takete-Ide",
    description:
      "SIM Christianity was introduced to Takete-Ide around 1919, establishing the early Christian fellowship in the community.",
    status: "community_tradition",
    statusNote: "Preserved community historical tradition.",
  },
  {
    id: "sim-1921-first-baptisms",
    yearLabel: "12 January 1921",
    title: "First Recorded Baptisms at Ilu-Oke",
    description:
      "About two years after Christianity reached the community, Rev. Tommie Titcombe, the missionary from Egbe, baptises four pioneer members: Peter Olowodara, Daniel Eseyin, Luke Olorunleke and Thomas Ode Ayeni.",
    status: "documentary_evidence",
    statusNote: "Recorded in the TIPU centenary history.",
  },
  {
    id: "sim-1922-active-congregation",
    yearLabel: "1922",
    title: "Rev. Titcombe Visits Takete-Ide; SIM Congregation Active",
    description:
      "Rev. Tommie Titcombe visits Takete-Ide during preparations for early church baptisms. Preserved historical records confirm that an SIM Christian congregation was already actively worshipping in the community at this time.",
    status: "documentary_evidence",
    statusNote: "Documented in preserved church historical accounts.",
  },
  {
    id: "baptist-nov-1922-founding",
    yearLabel: "November 1922",
    title: "First Baptist Church, Takete-Ide Established",
    description:
      "Six founding leaders (Pa Joash Agunbiade, Pa Luke Olorunleke, Pa Paul Amora, Pa Saul Akedi, Pa Noah Eseyin Omoyele and Pa Alfred Eseyin), with the support of their wives, establish First Baptist Church in Takete-Ide following doctrine-related baptismal disagreements within the SIM congregation.",
    status: "documentary_evidence",
    statusNote: "Preserved church historical account and community archive.",
  },
  {
    id: "sim-1925-women-baptisms",
    yearLabel: "27 March 1925",
    title: "First Women Baptised in Takete-Ide",
    description:
      "Five women are baptised at Ilu-Oke by Mr C.P. Jensen and Rev. Titcombe, the first women baptised in the church: Maria Anulase, Maria Iya Egbe, Leah Efa, Maria Iyagidan and Rakeli Omosofe.",
    status: "documentary_evidence",
    statusNote: "Recorded in the TIPU centenary history.",
  },
  {
    id: "sim-1927-land-allocation",
    yearLabel: "11 December 1927",
    title: "Land Granted for the First Church Building",
    description:
      "Oba Olukotun, paramount ruler of Yagbaland, writes to the Olu’de asking him to make land available to SIM for a church at the new site. The Olu’de grants the request and a plot is allocated. Until then, members had worshipped in Pa David Olukomogbon’s house.",
    status: "documentary_evidence",
    statusNote: "Recorded in the TIPU centenary history.",
  },
  {
    id: "sim-1928-groundbreaking",
    yearLabel: "15 May 1928",
    title: "Work Begins on the First Church Building",
    description:
      "Building work begins in earnest. Mr W.S. Craig performs the groundbreaking ceremony, while Pastor-teacher Paul Agbale and Pa Nicodemus travel to Lokoja to seek approval for the project.",
    status: "documentary_evidence",
    statusNote: "Recorded in the TIPU centenary history.",
  },
  {
    id: "sim-1930-choir",
    yearLabel: "29 December 1930",
    title: "First Organised Church Choir Inaugurated",
    description:
      "A group of fifteen members, 11 men and four women, becomes the first church choir. Pa Ezra Afolabi is remembered as the first choirmaster.",
    status: "documentary_evidence",
    statusNote: "Recorded in the TIPU centenary history.",
  },
  {
    id: "apostolic-1938-founding",
    yearLabel: "1938",
    title: "The Apostolic Church Established",
    description:
      "The Apostolic Church takes root in Takete-Ide, partly through the missionary work of Rev. K.P. Titus of Isanlu. Its pioneer members were Stephen Eseyin (Baba Egbe), Lot Eseyin and Daniel Oloruntoba.",
    status: "documentary_evidence",
    statusNote: "Recorded in the TIPU centenary history.",
  },
  {
    id: "sim-1939-historic-bell",
    yearLabel: "24 May 1939",
    title: "The Church Bell Arrives from Lagos",
    description:
      "Eight church members walk to Lagos, a journey of up to two months, to obtain an iron bar cut from the new railway works for use as a bell, and carry it home on their heads. Four of the volunteers are named in the record: Peter Olowodara, Mark Soje, Samuel Ogunboluje and Jacob Alemeru. The bell arrives on 24 May 1939 and is still in use.",
    status: "documentary_evidence",
    statusNote: "Recorded in the TIPU centenary history.",
  },
  {
    id: "church-of-god-1980",
    yearLabel: "1980",
    title: "Church of God in Christ Established",
    description:
      "Church of God in Christ is established in Takete-Ide.",
    status: "documentary_evidence",
    statusNote: "Recorded in the TIPU centenary history.",
  },
  {
    id: "healing-church-1999",
    yearLabel: "1999",
    title: "Healing Church International Established",
    description:
      "Healing Church International is established in Takete-Ide.",
    status: "documentary_evidence",
    statusNote: "Recorded in the TIPU centenary history.",
  },
  {
    id: "ecwa-lcc-2003",
    yearLabel: "17 December 2003",
    title: "Takete-Ide ECWA Local Church Council Established",
    description:
      "The Takete-Ide ECWA Local Church Council is established, comprising 1st ECWA Takete-Ide, ECWA Ayedayo, ECWA Ayede and 2nd ECWA Takete-Ide.",
    status: "documentary_evidence",
    statusNote: "Recorded in the TIPU centenary history.",
  },
  {
    id: "rccg-2006",
    yearLabel: "2006",
    title: "Redeemed Christian Church of God (RCCG) Established",
    description:
      "The Redeemed Christian Church of God (RCCG) is established in Takete-Ide.",
    status: "documentary_evidence",
    statusNote: "Recorded in the TIPU centenary history.",
  },
  {
    id: "later-denominational-growth",
    yearLabel: "Later Decades",
    title: "Other Congregations in Takete-Ide",
    description:
      "Other congregations serving Takete-Ide today include Christ Apostolic Church (CAC), Cherubim and Seraphim Church, Second ECWA Church, Seed of Christ Golden Church (Sebioba), Second Apostolic Church, Deeper Life Bible Church and Christ Bible Baptist Church.",
    status: "community_tradition",
    statusNote: "Preserved community historical records.",
  },
];
