/**
 * Structured content module for the special canonical historical archive overview.
 *
 * Used exclusively for the canonical historical community account
 * (/archive/takete-history-original) to present an inside overview,
 * migration strip, name transition note, and related heritage links.
 */

export interface ArchiveOverviewCard {
  title: string;
  summary: string;
  href: string;
  linkLabel: string;
}

export const ARCHIVE_OVERVIEW_CARDS: ArchiveOverviewCard[] = [
  {
    title: "1. Takete-Idera — A Place of Comfort",
    summary:
      "Explores the literal meaning of Takete-Idera ('separated to a place of comfort/rest'), the community's geographic placement, surrounding waterways and peaceful ethos.",
    href: "/our-story#comfort",
    linkLabel: "Read in Our Story",
  },
  {
    title: "2. Takete within Amuro & Okun",
    summary:
      "Details Takete-Ide's position as one of the seven historic Amuro towns, its shared Okun cultural heritage, and regional civic ties.",
    href: "/our-story#amuro",
    linkLabel: "Explore Amuro context",
  },
  {
    title: "3. A People’s Search for Peace",
    summary:
      "Records how forebears navigated nineteenth-century regional warfare and cavalry incursions by seeking naturally fortified settlements in the uplands.",
    href: "/our-story#peace",
    linkLabel: "Read historical context",
  },
  {
    title: "4. The Migration Journey",
    summary:
      "Traces the sequential movement across ancestral sites: Amuro-Odo, Igbo Ide, Ilu-Oke, and Okeata, culminating in the descent to the plains c.1926.",
    href: "/our-story#journey",
    linkLabel: "View migration timeline",
  },
  {
    title: "5. Landscape, Rivers & Hills",
    summary:
      "Documents the prominent natural topography—Obasoro Hill, Oke Elegan, Oroke Agodi, Eba River, Owowo River, and sacred sanctuary sites.",
    href: "/heritage",
    linkLabel: "Explore landscape",
  },
  {
    title: "6. Traditional Institution & Cultural Memory",
    summary:
      "Preserves the historical Olu’de register, the Takete-Ide Traditional Council structure, the Alamuro rotation, and praise traditions like Oríkì and the Community Anthem.",
    href: "/heritage/traditional-institution",
    linkLabel: "View traditional institution",
  },
];

export const ILETEJU_TRANSITION = {
  title: "Ileteju to Takete-Idera",
  body:
    "According to the supplied community historical account, the new low-plain location settled around 1926 was initially known as Ileteju, meaning 'flat land'. Following subsequent community deliberation and collective affirmation, the settlers adopted the name Takete-Idera to signify their enduring arrival in a home of comfort, rest, and renewed peace.",
  note: "Attribution: Supplied community historical manuscript. Name transition date is not individually dated.",
};

export const RELATED_HERITAGE_LINKS = [
  {
    title: "Our Story & Timeline",
    description: "The complete 5-stage migration history and settlement narrative.",
    href: "/our-story",
  },
  {
    title: "Centenary 2026",
    description: "Commemorating approximately a century at the present settlement.",
    href: "/centenary",
  },
  {
    title: "Culture & Heritage",
    description: "Festivals, attire, places of worship and community traditions.",
    href: "/heritage",
  },
  {
    title: "Agbagba Ide",
    description: "Sacred sanctuary, cultural memory and symbol of resilience.",
    href: "/heritage/agbagba-ide",
  },
  {
    title: "Traditional Institution",
    description: "The Olu’de, Council of Chiefs, and Amuro traditional structure.",
    href: "/heritage/traditional-institution",
  },
  {
    title: "Oríkì & Oral Heritage",
    description: "Praise poetry and living cultural expressions.",
    href: "/oriki",
  },
  {
    title: "Landscape & Landmarks",
    description: "Photographs and documentation of hills, streams and landmarks.",
    href: "/gallery?category=Nature",
  },
];
