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
    "In the cultural memory of Takete-Ide, Agbagba Ide is remembered as a sacred rock cave and place of refuge and protection during the turbulent regional conflicts of the nineteenth century. Within community belief, the sanctuary came to symbolise divine protection, resilience and unity, leaving a lasting legacy in community consciousness.",
  culturalSignificance: [
    "Historic Haven: Associated with protective shelter for community members during 19th-century regional conflicts.",
    "Symbol of Divine Protection: Revered within community tradition as a manifestation of divine care in times of danger.",
    "Community Emblem: Served historically as a rallying symbol of courage and unity, inspiring portable cultural emblems.",
    "Living Oral Heritage: Celebrated in the preserved Takete-Ide Community Anthem and the praise poetry of Oriki Agbagba Ide.",
  ],
  associatedPraiseTraditions: {
    anthemMention: true,
    orikiMention: true,
    editorialNote:
      "The full original Yoruba texts of the preserved Takete-Ide Community Anthem and the Oriki Agbagba Ide are retained within the source archive (takete-history-original.md). Future digital publication on public audio/archive pages will include authenticated recitations, verified transcriptions, and community-authorized contextual interpretations.",
  },
  editorialSafeguards:
    "Cultural and spiritual narratives surrounding Agbagba Ide are presented as living cultural heritage and collective memory. In accordance with editorial standards, sacred beliefs and oral traditions are treated with deep respect while maintaining a clear distinction from physical, scientific, or archival documentation.",
};
