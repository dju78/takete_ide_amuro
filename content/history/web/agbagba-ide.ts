/**
 * Cultural tradition and community memory module for Agbagba Ide.
 *
 * Strictly frames Agbagba Ide within cultural memory, sacred tradition,
 * and symbolic community identity, avoiding treating supernatural traditions
 * as empirical/scientific claims.
 */

export interface AgbagbaIdeTradition {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  culturalSignificance: string[];
  associatedPraiseTraditions: {
    anthemMention: boolean;
    orikiMention: boolean;
    editorialNote: string;
  };
  editorialSafeguards: string;
}

export const AGBAGBA_IDE_TRADITION: AgbagbaIdeTradition = {
  id: "agbagba-ide",
  title: "Agbagba Ide",
  subtitle: "Symbol, Memory and Community Tradition",
  summary:
    "In the cultural memory of Takete-Ide, Agbagba Ide is remembered as a sacred rock cave and natural haven that provided unfailing sanctuary during the turbulent regional warfare of the nineteenth century. Revered by community forebears as divine protection from Olorun (God), its legacy is embedded in community consciousness as an enduring emblem of resilience, survival, and peace.",
  culturalSignificance: [
    "Historic Haven: Associated with protective shelter for community members during 19th-century Nupe and regional conflicts.",
    "Symbol of Divine Deliverance: Revered in local tradition as a manifestation of divine favor and protection in times of existential danger.",
    "Community Emblem: Served historically as a rallying symbol of courage and unity, inspiring portable cultural emblems.",
    "Living Oral Heritage: Celebrated in the Takete-Ide Community Anthem and the ancient praise poetry of Oriki Agbagba Ide.",
  ],
  associatedPraiseTraditions: {
    anthemMention: true,
    orikiMention: true,
    editorialNote:
      "The full original Yoruba texts of the Takete-Ide Community Anthem and the Oriki Agbagba Ide are preserved within the source archive (takete-history-original.md). Future digital publication on public audio/archive pages will include authenticated recitations, verified transcriptions, and community-authorized contextual interpretations.",
  },
  editorialSafeguards:
    "Cultural and spiritual narratives surrounding Agbagba Ide are presented as living cultural heritage and collective memory. In accordance with editorial standards, sacred beliefs and oral traditions are treated with deep respect while maintaining a clear distinction from physical, scientific, or archival documentation.",
};
