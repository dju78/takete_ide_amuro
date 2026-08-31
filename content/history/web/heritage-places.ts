/**
 * Historical and natural heritage places of Takete-Ide.
 *
 * Connects the historical narrative with landscape and place records.
 *
 * Strict media rule: Known authentic images are referenced only where verified.
 * Places without verified photographs use null (or branded placeholders) and
 * never invent paths or duplicate unrelated photographs.
 */

export interface HeritagePlace {
  id: string;
  name: string;
  category: "hill-mountain" | "river-water" | "historical-site" | "cultural-sanctuary";
  description: string;
  historicalSignificance: string;
  verifiedImage: string | null;
  imageAlt: string | null;
  photoStatus: "authentic" | "awaiting-archive-photo";
}

export const HERITAGE_PLACES: HeritagePlace[] = [
  {
    id: "obasoro-hill",
    name: "Obasoro Hill",
    category: "hill-mountain",
    description:
      "A prominent hill west of Takete-Ide that forms an iconic landmark of the community's surrounding mountainous topography.",
    historicalSignificance:
      "Part of the protective upland ring that provided defensive observation and natural beauty throughout community history.",
    verifiedImage: "/images/takete-ide/obasoro-hill.jpg",
    imageAlt: "Obasoro Hill, a prominent natural upland landmark of Takete-Ide Amuro",
    photoStatus: "authentic",
  },
  {
    id: "eba-river",
    name: "Eba River (Omi Ebba)",
    category: "river-water",
    description:
      "A vital water body approached from the eastern axis (Otafun / Aghara) flowing through the fertile lowlands of Takete-Ide.",
    historicalSignificance:
      "A historic source of domestic water, fishing, and natural boundary demarcation between neighbouring kindred settlements.",
    verifiedImage: "/images/takete-ide/eba-river-bank.jpg",
    imageAlt: "The tranquil bank of the Eba River in Takete-Ide Amuro",
    photoStatus: "authentic",
  },
  {
    id: "owowo-river",
    name: "Owowo River",
    category: "river-water",
    description:
      "A notable river on the western approaches to Takete-Ide along the Ayede axis.",
    historicalSignificance:
      "Historically crossed by visitors approaching from the west, contributing to the rich aquatic endowments of the territory.",
    verifiedImage: null,
    imageAlt: null,
    photoStatus: "awaiting-archive-photo",
  },
  {
    id: "oke-elegan",
    name: "Oke Elegan",
    category: "hill-mountain",
    description:
      "The largest and most imposing mountain massif rising to the south of Takete-Ide.",
    historicalSignificance:
      "Stands out in size and natural grandeur as the primary southern highland sentinel of the community landscape.",
    verifiedImage: null,
    imageAlt: null,
    photoStatus: "awaiting-archive-photo",
  },
  {
    id: "oroke-agodi",
    name: "Oroke Agodi",
    category: "hill-mountain",
    description:
      "A rugged upland feature rising to the west alongside Obasoro.",
    historicalSignificance:
      "Forms part of the historic hunting terrain and highland terrain traversed by the community's early settlers.",
    verifiedImage: null,
    imageAlt: null,
    photoStatus: "awaiting-archive-photo",
  },
  {
    id: "ilu-oke-site",
    name: "Ilu-Oke Historical Site",
    category: "historical-site",
    description:
      "The ancient upland settlement southeast of the present town where Takete-Ide resided for generations before the c.1926 descent.",
    historicalSignificance:
      "The historic fortified hilltop home of the community during the 19th-century regional conflict era.",
    verifiedImage: null,
    imageAlt: null,
    photoStatus: "awaiting-archive-photo",
  },
  {
    id: "igbo-ide-site",
    name: "Igbo Ide (Igbo Idera)",
    category: "historical-site",
    description:
      "The historic forest grove north of the Takete-Ide–Aghara road settled upon the initial dispersal from Amuro-Odo.",
    historicalSignificance:
      "The first refuge after leaving Amuro-Odo, where the name Idera ('Comfort') was first bestowed by Takete and Otafun ancestors.",
    verifiedImage: null,
    imageAlt: null,
    photoStatus: "awaiting-archive-photo",
  },
  {
    id: "agbagba-ide-sanctuary",
    name: "Agbagba Ide",
    category: "cultural-sanctuary",
    description:
      "A sacred rock cave and natural haven revered in community memory and cultural tradition.",
    historicalSignificance:
      "Served as an unfailing sanctuary during times of peril, commemorated in the Takete-Ide Community Anthem and the Oriki Agbagba Ide.",
    verifiedImage: null,
    imageAlt: null,
    photoStatus: "awaiting-archive-photo",
  },
];
