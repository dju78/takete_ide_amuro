import { CampaignConfig } from "@/types/celebration-studio";
import { CELEBRATION_TEMPLATES } from "./templates";
import { APPROVED_MESSAGES } from "./messages";

/**
 * Single source of truth for Celebration Studio campaigns.
 * Designed to be modular so future campaigns (e.g. Takete-Ide Day 2027) can be registered
 * without rewriting UI or rendering code.
 */
export const TAKETE_IDE_CENTENARY_2026: CampaignConfig = {
  id: "centenary-2026",
  name: "Takete-Ide Centenary Celebration 2026",
  shortName: "Centenary 2026",
  year: 2026,
  eventDates: "29–31 October 2026",
  mainEventDate: "31 October 2026",
  theme: "FAITH, UNITY AND PROGRESS",
  motto: "AGBAGBA IDE AGBE WA O",
  tagline: "A CENTURY OF HERITAGE · A FUTURE OF GREATER GLORY",
  logoUrl: "/images/takete-ide/tipu-emblem.png",
  logoAlt: "Takete-Ide Progressive Union (TIPU) Official Emblem",
  primaryColor: "#321357",
  accentColor: "#d4a72c",
  secondaryColor: "#245c3a",
  filenamePrefix: "takete-ide-centenary",
  defaultMessages: APPROVED_MESSAGES.map((m) => m.text),
  templates: CELEBRATION_TEMPLATES,
};

export const REGISTERED_CAMPAIGNS: Record<string, CampaignConfig> = {
  "centenary-2026": TAKETE_IDE_CENTENARY_2026,
};

export function getActiveCampaign(campaignId = "centenary-2026"): CampaignConfig {
  return REGISTERED_CAMPAIGNS[campaignId] || TAKETE_IDE_CENTENARY_2026;
}
