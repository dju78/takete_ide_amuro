/**
 * Structured migration timeline of Takete-Ide from ancestral settlements to the present site.
 *
 * Cautionary timeline: preserves relative chronological sequence without inventing
 * precise calendar dates where unrecorded. The present settlement date uses "c.1926".
 */

import type { SourceType, VerificationStatus } from "./our-story";

export interface TimelineEntry {
  id: string;
  stepNumber: number;
  place: string;
  period: string;
  title: string;
  description: string;
  sourceType: SourceType;
  verificationStatus: VerificationStatus;
  significance: string;
  locationNote?: string;
}

export const MIGRATION_TIMELINE: TimelineEntry[] = [
  {
    id: "amuro-odo",
    stepNumber: 1,
    place: "Amuro-Odo",
    period: "Pre-19th Century",
    title: "Ancestral Co-existence at Amuro-Odo",
    description:
      "According to community historical accounts, the kindred groups of Amuro originally lived together in a fertile plain settlement known as Amuro-Odo before regional warfare forced dispersal.",
    sourceType: "community-historical-account",
    verificationStatus: "community-account",
    significance: "The shared ancestral settlement of Amuro kindred groups before 19th-century regional instability.",
    locationNote: "Situated in the low fertile plains east of the Niger basin.",
  },
  {
    id: "igbo-ide",
    stepNumber: 2,
    place: "Igbo Ide (Igbo Idera)",
    period: "Early to Mid-19th Century",
    title: "Forest Refuge at Igbo Ide",
    description:
      "The ancestors of Takete and Otafun moved east into a dense, fertile forest named Igbo Ide ('Grove of Comfort'). After a period of recovery, renewed incursions prompted a search for fortified upland terrain.",
    sourceType: "community-historical-account",
    verificationStatus: "community-account",
    significance: "First stage of dispersal, named for the solace and shelter it provided.",
    locationNote: "Located north of the modern Takete-Ide–Aghara road.",
  },
  {
    id: "ilu-oke",
    stepNumber: 3,
    place: "Ilu-Oke",
    period: "19th Century to Early 20th Century",
    title: "Highland Settlement and Defense at Ilu-Oke",
    description:
      "Advancing southward into the mountain range, the community established Ilu-Oke ('Town on the Hill'), southeast of the modern site. The rugged terrain provided natural fortification against cavalry raids for generations.",
    sourceType: "community-historical-account",
    verificationStatus: "community-account",
    significance: "Long-standing fortified hill settlement where community institutions and Agbagba Ide traditions flourished.",
    locationNote: "Hilly uplands southeast of the present Takete-Ide town.",
  },
  {
    id: "okeata-uplands",
    stepNumber: 4,
    place: "Okeata / Surrounding Uplands",
    period: "Late 19th Century",
    title: "Mountain Redoubts during Heightened Conflict",
    description:
      "During periods of intensified regional conflict, segments of the community moved deeper into the surrounding hills to Okeata near Odede, while others maintained agricultural and defensive outposts across the slopes.",
    sourceType: "community-historical-account",
    verificationStatus: "community-account",
    significance: "Strategic highland retreat ensuring community survival during regional turbulence.",
    locationNote: "High mountain areas around Odede and surrounding ridges.",
  },
  {
    id: "present-takete-ide",
    stepNumber: 5,
    place: "Present Takete-Ide (Ileteju / Takete-Idera)",
    period: "c.1926",
    title: "Descent to the Plains — Home at Last",
    description:
      "In 1926 or thereabouts, following peaceful reconnaissance by hunter-surveyors such as Pa Thomas Ode, the community descended from Ilu-Oke to the fertile plain below, naming their new home Takete-Idera in celebration of enduring peace and comfort.",
    sourceType: "community-historical-account",
    verificationStatus: "community-account",
    significance: "Establishment of modern Takete-Ide on the fertile low plain, commemorated by the 2026 Centenary.",
    locationNote: "Current town site in Amuro District, MopAmuro LGA, Kogi State.",
  },
];
