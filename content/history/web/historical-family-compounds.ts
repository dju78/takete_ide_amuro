/**
 * Documented Historical Family Names & Ward/Compound Associations
 *
 * Source: content/history/sources/takete-history-original.md
 * Alignment confirmed by project owner from the canonical historical manuscript.
 *
 * NOTE: This dataset represents families and wards/compounds specifically
 * recorded in the 12-ruler historical Olu’de register. It is not an exhaustive
 * list of all Takete-Ide families or compounds.
 */

export interface HistoricalRegisterEntry {
  ruler: string;
  family: string;
  compound: string;
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

export const HISTORICAL_REGISTER_ROWS: HistoricalRegisterEntry[] = [
  { ruler: "Olu’de Opalu", family: "Atemayi", compound: "Oke-Ako" },
  { ruler: "Olu’de Ide", family: "Eseyintelu", compound: "Ile-Nla" },
  { ruler: "Olu’de Oriko", family: "Oriko", compound: "Osikegun" },
  { ruler: "Olu’de Atte Gbogori", family: "Atemesami", compound: "Osikegun" },
  { ruler: "Olu’de Orunmbe", family: "Eseyintelu", compound: "Osikegun" },
  { ruler: "Olu’de Obadofin Obere", family: "Atemeji", compound: "Oketaro" },
  { ruler: "Olu’de Obaba Omologun", family: "Atemeto", compound: "Oke-Oja" },
  { ruler: "Olu’de Obajemu Atepa", family: "Atemogbe", compound: "Oke-Oja" },
  { ruler: "Olu’de Elewa", family: "Eseyinmeleri", compound: "Osikegun" },
  { ruler: "Olu’de Obajemu Ate", family: "Atejagbo", compound: "Osikegun" },
  { ruler: "Olu’de Alufa Olukotun", family: "Atejaba", compound: "Oketaro" },
  { ruler: "Olu’de J.A. Fiki", family: "Atemayi", compound: "Oke-Oja" },
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
      "Olu’de Atte Gbogori",
      "Olu’de Orunmbe",
      "Olu’de Elewa",
      "Olu’de Obajemu Ate",
    ],
    recordType: "Historical manuscript record",
  },
  {
    id: "oketaro",
    name: "Oketaro",
    documentedFamilies: ["Atemeji", "Atejaba"],
    associatedRulers: ["Olu’de Obadofin Obere", "Olu’de Alufa Olukotun"],
    recordType: "Historical manuscript record",
  },
  {
    id: "oke-oja",
    name: "Oke-Oja",
    documentedFamilies: ["Atemeto", "Atemogbe", "Atemayi"],
    associatedRulers: ["Olu’de Obaba Omologun", "Olu’de Obajemu Atepa", "Olu’de J.A. Fiki"],
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
    associatedRulers: ["Olu’de Alufa Olukotun"],
    recordType: "Historical manuscript record",
  },
  {
    id: "atejagbo",
    name: "Atejagbo",
    documentedCompounds: ["Osikegun"],
    associatedRulers: ["Olu’de Obajemu Ate"],
    recordType: "Historical manuscript record",
  },
  {
    id: "atemayi",
    name: "Atemayi",
    documentedCompounds: ["Oke-Ako", "Oke-Oja"],
    associatedRulers: ["Olu’de Opalu", "Olu’de J.A. Fiki"],
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
    associatedRulers: ["Olu’de Atte Gbogori"],
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
    associatedRulers: ["Olu’de Elewa"],
    recordType: "Historical manuscript record",
  },
  {
    id: "eseyintelu",
    name: "Eseyintelu",
    documentedCompounds: ["Ile-Nla", "Osikegun"],
    associatedRulers: ["Olu’de Ide", "Olu’de Orunmbe"],
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
