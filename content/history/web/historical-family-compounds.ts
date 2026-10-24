/**
 * Documented Historical Family Names & Ward/Compound Associations
 *
 * Source: content/history/sources/takete-history-original.md
 * Alignment confirmed by project owner from the canonical historical manuscript.
 *
 * NOTE: This dataset represents families and wards/compounds specifically
 * recorded in the 13-ruler Olu’de register. It is not an exhaustive
 * list of all Takete-Ide families or compounds.
 */

export interface HistoricalOludeEntry {
  number: number;
  name: string;
  family: string;
  /** Quarter or compound recorded for the ruler. */
  ward: string;
  /** One of the three broad wards (Odo-Takete, Oke-Adan, Oke-Ako) among which the stool rotates. */
  wardArea?: string;
  notes?: string;
}

export function oludeLocationLabel(entry: HistoricalOludeEntry): string {
  return entry.wardArea && entry.wardArea !== entry.ward ? `${entry.ward}, ${entry.wardArea}` : entry.ward;
}

export interface DocumentedCompound {
  id: string;
  name: string;
  documentedFamilies: string[];
  associatedRulers: string[];
  recordType: "Historical manuscript record";
}

export interface DocumentedFamily {
  id: string;
  name: string;
  documentedCompounds: string[];
  associatedRulers: string[];
  recordType: "Historical manuscript record";
}

// Family spellings follow the site's established forms. Where the two published
// lists record different lineages (rulers 1, 6 and 12), the existing entry is kept;
// the conflicts are recorded in the private editorial review log.
export const CONFIRMED_OLUDE_REGISTER: HistoricalOludeEntry[] = [
  { number: 1, name: "Olu’de Opalu", family: "Atemayi", ward: "Oke-Ako", wardArea: "Oke-Ako" },
  { number: 2, name: "Olu’de Ide", family: "Eseyintelu", ward: "Ile-Nla", wardArea: "Odo-Takete", notes: "Compound also recorded as Ilela." },
  { number: 3, name: "Olu’de Oriko", family: "Oriko", ward: "Osikegun", wardArea: "Oke-Adan" },
  { number: 4, name: "Olu’de Opaku Gogori", family: "Atemesami", ward: "Osikegun", wardArea: "Oke-Adan", notes: "Also recorded as Olu’de Atte Gbogori." },
  { number: 5, name: "Olu’de Orunbe", family: "Eseyintelu", ward: "Osikegun", wardArea: "Oke-Adan", notes: "Also recorded as Olu’de Orunmbe." },
  { number: 6, name: "Olu’de Obadofin Obere", family: "Atemeji", ward: "Oketaro", wardArea: "Odo-Takete" },
  { number: 7, name: "Olu’de Obaba Omologun", family: "Atemeto", ward: "Oke-Oja", wardArea: "Oke-Ako" },
  { number: 8, name: "Olu’de Obajemu Atepa", family: "Atemogbe", ward: "Oke-Oja", wardArea: "Oke-Ako" },
  { number: 9, name: "Olu’de Okoo Elewa", family: "Eseyinmeleri", ward: "Osikegun", wardArea: "Oke-Adan", notes: "Also recorded as Olu’de Elewa. Reigning Olu’de during the move from Ilu-Oke to the present site." },
  { number: 10, name: "Olu’de Obajemu Tolufase", family: "Atejagbo", ward: "Osikegun", wardArea: "Oke-Adan", notes: "Also recorded as Olu’de Obajemu Ate." },
  { number: 11, name: "Olu’de Alfa Olukotun", family: "Atejaba", ward: "Oketaro", wardArea: "Odo-Takete", notes: "Also recorded as Olu’de Alufa Olukotun." },
  { number: 12, name: "Olu’de Joshua Alege Fiki", family: "Atemayi", ward: "Oke-Oja", wardArea: "Oke-Ako", notes: "Also recorded as Olu’de J.A. Fiki. Reigned 1983–2003 and later became the Alamuro." },
  { number: 13, name: "Oba Philip Omolade Aladuge Ebilakun", family: "Eseyintelu", ward: "Ikoj’Agun", wardArea: "Oke-Adan", notes: "The reigning Olu’de." },
];

/**
 * Unique Ward/Compound records documented in the historical Olu’de register.
 */
export const DOCUMENTED_HISTORICAL_COMPOUNDS: DocumentedCompound[] = [
  {
    id: "oke-ako",
    name: "Oke-Ako",
    documentedFamilies: ["Atemayi"],
    associatedRulers: ["Olu’de Opalu"],
    recordType: "Historical manuscript record",
  },
  {
    id: "ile-nla",
    name: "Ile-Nla",
    documentedFamilies: ["Eseyintelu"],
    associatedRulers: ["Olu’de Ide"],
    recordType: "Historical manuscript record",
  },
  {
    id: "osikegun",
    name: "Osikegun",
    documentedFamilies: ["Oriko", "Atemesami", "Eseyintelu", "Eseyinmeleri", "Atejagbo"],
    associatedRulers: [
      "Olu’de Oriko",
      "Olu’de Opaku Gogori",
      "Olu’de Orunbe",
      "Olu’de Okoo Elewa",
      "Olu’de Obajemu Tolufase",
    ],
    recordType: "Historical manuscript record",
  },
  {
    id: "oketaro",
    name: "Oketaro",
    documentedFamilies: ["Atemeji", "Atejaba"],
    associatedRulers: ["Olu’de Obadofin Obere", "Olu’de Alfa Olukotun"],
    recordType: "Historical manuscript record",
  },
  {
    id: "oke-oja",
    name: "Oke-Oja",
    documentedFamilies: ["Atemeto", "Atemogbe", "Atemayi"],
    associatedRulers: ["Olu’de Obaba Omologun", "Olu’de Obajemu Atepa", "Olu’de Joshua Alege Fiki"],
    recordType: "Historical manuscript record",
  },
  {
    id: "ikojagun",
    name: "Ikoj’Agun",
    documentedFamilies: ["Eseyintelu"],
    associatedRulers: ["Oba Philip Omolade Aladuge Ebilakun"],
    recordType: "Historical manuscript record",
  },
];

/**
 * Unique Family records documented in the historical Olu’de register.
 */
export const DOCUMENTED_HISTORICAL_FAMILIES: DocumentedFamily[] = [
  {
    id: "atejaba",
    name: "Atejaba",
    documentedCompounds: ["Oketaro"],
    associatedRulers: ["Olu’de Alfa Olukotun"],
    recordType: "Historical manuscript record",
  },
  {
    id: "atejagbo",
    name: "Atejagbo",
    documentedCompounds: ["Osikegun"],
    associatedRulers: ["Olu’de Obajemu Tolufase"],
    recordType: "Historical manuscript record",
  },
  {
    id: "atemayi",
    name: "Atemayi",
    documentedCompounds: ["Oke-Ako", "Oke-Oja"],
    associatedRulers: ["Olu’de Opalu", "Olu’de Joshua Alege Fiki"],
    recordType: "Historical manuscript record",
  },
  {
    id: "atemeji",
    name: "Atemeji",
    documentedCompounds: ["Oketaro"],
    associatedRulers: ["Olu’de Obadofin Obere"],
    recordType: "Historical manuscript record",
  },
  {
    id: "atemesami",
    name: "Atemesami",
    documentedCompounds: ["Osikegun"],
    associatedRulers: ["Olu’de Opaku Gogori"],
    recordType: "Historical manuscript record",
  },
  {
    id: "atemeto",
    name: "Atemeto",
    documentedCompounds: ["Oke-Oja"],
    associatedRulers: ["Olu’de Obaba Omologun"],
    recordType: "Historical manuscript record",
  },
  {
    id: "atemogbe",
    name: "Atemogbe",
    documentedCompounds: ["Oke-Oja"],
    associatedRulers: ["Olu’de Obajemu Atepa"],
    recordType: "Historical manuscript record",
  },
  {
    id: "eseyinmeleri",
    name: "Eseyinmeleri",
    documentedCompounds: ["Osikegun"],
    associatedRulers: ["Olu’de Okoo Elewa"],
    recordType: "Historical manuscript record",
  },
  {
    id: "eseyintelu",
    name: "Eseyintelu",
    documentedCompounds: ["Ile-Nla", "Osikegun", "Ikoj’Agun"],
    associatedRulers: ["Olu’de Ide", "Olu’de Orunbe", "Oba Philip Omolade Aladuge Ebilakun"],
    recordType: "Historical manuscript record",
  },
  {
    id: "oriko",
    name: "Oriko",
    documentedCompounds: ["Osikegun"],
    associatedRulers: ["Olu’de Oriko"],
    recordType: "Historical manuscript record",
  },
];
