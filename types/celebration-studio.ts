export type PosterFormatId = "square" | "portrait" | "story" | "print";

export interface PosterFormat {
  id: PosterFormatId;
  label: string;
  sublabel: string;
  width: number;
  height: number;
  aspectRatio: string;
  recommendedFor: string;
}

export type TemplateCategory =
  | "personal"
  | "family"
  | "leadership"
  | "heritage"
  | "custom";

export interface PosterSafeZone {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface PosterPhotoConfig {
  shape: "circle" | "arch" | "rounded-rect" | "oval" | "full-bleed";
  borderWidth: number;
  borderColor: string;
  hasGoldFrame: boolean;
  defaultPosition: { x: number; y: number; width: number; height: number };
}

export interface CelebrationTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  themeColor: string;
  accentColor: string;
  backgroundColor: string;
  backgroundStyle: "ceremonial-purple" | "heritage-green" | "royal-gold" | "festive-ivory" | "photo-backdrop";
  defaultBackgroundPhoto?: string;
  photoConfig: PosterPhotoConfig;
  defaultTitle?: string;
  defaultMessage: string;
  defaultSalutation?: string;
  defaultSignOff?: string;
  defaultLocalExpression?: string;
  supportedFormats: PosterFormatId[];
  requiredFields: Array<"name" | "familyName" | "title" | "greeting" | "message" | "signOff" | "localExpression">;
  optionalFields: Array<"name" | "familyName" | "title" | "greeting" | "message" | "signOff" | "localExpression">;
  badgeText?: string;
}

export interface CampaignConfig {
  id: string;
  name: string;
  shortName: string;
  year: number;
  eventDates: string;
  mainEventDate: string;
  theme: string;
  motto: string;
  tagline: string;
  logoUrl: string;
  logoAlt: string;
  primaryColor: string;
  accentColor: string;
  secondaryColor: string;
  filenamePrefix: string;
  defaultMessages: string[];
  templates: CelebrationTemplate[];
}

export interface PhotoAdjustments {
  zoom: number; // 1.0 to 3.0
  panX: number; // -100 to 100 percentage
  panY: number; // -100 to 100 percentage
  rotation: number; // 0, 90, 180, 270 degrees
  filter: "original" | "warm" | "vibrant" | "classic-bw";
  removeBackground: boolean;
}

export interface PosterCustomOptions {
  backgroundPhoto?: string;
  backgroundColorScheme?: "purple-gold" | "green-gold" | "royal-purple" | "warm-ivory" | "festive-dual";
  frameStyle?: "circle" | "arch" | "rounded-rect" | "oval";
}

export interface PersonalisationData {
  name: string;
  familyName: string;
  title: string;
  greeting: string;
  message: string;
  signOff: string;
  localExpression: string;
  customOptions?: PosterCustomOptions;
}

export interface CelebrationStudioState {
  step: 1 | 2 | 3 | 4 | 5;
  selectedTemplateId: string;
  photoUrl: string | null;
  photoFile: File | null;
  photoAdjustments: PhotoAdjustments;
  personalisation: PersonalisationData;
  selectedFormat: PosterFormatId;
  previewScale: number;
  isRendering: boolean;
}
