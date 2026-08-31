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
    title: "5. Traditional Institution & Confirmed Register",
    summary:
      "Preserves the 12-ruler historical Olu’de register with confirmed family and ward/compound affiliations, the Traditional Council, and the rotating Alamuro stool structure.",
    href: "/heritage/traditional-institution",
    linkLabel: "View traditional institution",
  },
  {
    title: "6. Living Oral Heritage — Anthem & Oríkì",
    summary:
      "Preserves the verbatim Takete-Ide Community Anthem and Oríkì Agbagba Ide, celebrating divine deliverance, communal resilience, and the sacred memory of Agbagba Ide.",
    href: "/heritage/takete-ide-anthem",
    linkLabel: "Explore anthem & oríkì",
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
    title: "Community Anthem & Oríkì",
    description: "Verbatim text of the Takete-Ide Anthem and Oríkì Agbagba Ide.",
    href: "/heritage/takete-ide-anthem",
  },
  {
    title: "Traditional Institution",
    description: "The Olu’de, confirmed ruler register, family/ward ties, and Amuro structure.",
    href: "/heritage/traditional-institution",
  },
  {
    title: "Agbagba Ide Tradition",
    description: "Sacred sanctuary, cultural memory and symbol of resilience.",
    href: "/heritage/agbagba-ide",
  },
  {
    title: "Culture & Heritage",
    description: "Festivals, attire, places of worship and community traditions.",
    href: "/heritage",
  },
  {
    title: "Landscape & Landmarks",
    description: "Photographs and documentation of hills, streams and landmarks.",
    href: "/gallery?category=Nature",
  },
];
