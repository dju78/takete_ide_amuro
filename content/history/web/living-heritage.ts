/**
 * Living Oral Heritage: Takete-Ide Community Anthem & Oríkì Agbagba Ide
 *
 * Source: content/history/sources/takete-history-original.md
 *
 * Strictly preserves the verbatim original Yoruba / local-dialect texts
 * without invented translations, musical modifications, or altered performance markings.
 */

export interface AnthemVerse {
  type: "standard" | "refrain" | "call_and_response";
  lines: string[];
}

export const TAKETE_IDE_ANTHEM = {
  title: "Takete-Ide Community Anthem",
  classification: "Community Anthem / Preserved Oral Heritage",
  sourceFraming:
    "The following anthem is preserved verbatim in the supplied Takete-Ide historical community account. Original orthography and performance notations are retained.",
  originalText: [
    "Takete Ide ilu olokiki, ngha tedo h’owo oke",
    "Nghun gbpgbo aiye ri",
    "Olorun gha ape o, ngho daagha hi Takete",
    "",
    "Agbagba Ide gbogbo /2*",
    "O le ha h’abe re ojo a paa",
    "Ide ni unkan a mo mo /2*",
    "Ile nghin san ghun wara at’oyin",
    "Eje a howo po t’agbe Takete Ide ga",
    "Solo/ T’agbe Tahete Ide ga",
    "All/ T.agbe Takete Ide ga",
    "Eje a ho wo po t’agbe Takete Ide ga",
  ],
  performanceNotes:
    "Notations in the source: '/2*' indicates a two-fold repetition of the line; 'Solo/' and 'All/' denote the traditional call-and-response refrain.",
};

export const ORIKI_AGBAGBA_IDE = {
  title: "Oríkì Agbagba Ide",
  classification: "Praise Poetry (Oríkì) / Living Oral Heritage",
  sourceFraming:
    "The following praise poem is preserved verbatim in the supplied Takete-Ide historical community account, heralding the sanctuary of Agbagba Ide.",
  originalText: [
    "Agbagba Ide gbogbo",
    "Oni e ha h’abe re ojo a pa",
    "Ide ni nkan a mo mo",
    "Agbodo gbodo ina",
    "A ja gbara gbara",
    "Ja gun lolo, j’agun okuta",
    "O s’owo ota nain kurugbe kurugbe",
    "Ore ota nain m’olo re’la",
    "O m’owo ota nain s’apoporo joko",
    "Asere sere eho",
    "Ol’ofe mi ‘ro ojo",
    "A mi g’orun ghanghan l’ekikan",
  ],
  editorialNote:
    "Preserved in original form for community documentation. Authorised translations and authenticated audio recitations will be published upon confirmation with community elders and the traditional council.",
};
