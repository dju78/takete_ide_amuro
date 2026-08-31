export type ContentStatus = "draft" | "pending_review" | "verified" | "published" | "archived";

export type VerificationStatus =
  | "unverified"
  | "oral_history"
  | "community_tradition"
  | "documentary_evidence"
  | "verified"
  | "disputed";

export type UserRole =
  | "super_admin"
  | "administrator"
  | "editor"
  | "historian"
  | "project_manager"
  | "media_manager"
  // Financial administration only — see requireFinancialAdmin in lib/auth.ts.
  | "treasurer";

export type ProjectStatus = "proposed" | "planning" | "fundraising" | "in_progress" | "completed" | "on_hold";

export type AccessLevel = "public" | "community" | "admin_only";

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  featured_image: string | null;
  featured_image_alt: string | null;
  category: { name: string; slug: string } | null;
  status: ContentStatus;
  published_at: string | null;
  tags: string[];
}

export interface TaketeIdeEvent {
  id: string;
  year: number;
  slug: string;
  theme: string | null;
  event_date: string | null;
  description: string | null;
  chairman: string | null;
  guest_information: string | null;
  programme_document_url: string | null;
  status: ContentStatus;
  media: { media_type: "photo" | "video"; url: string; caption: string | null }[];
  speeches: { speaker: string; title: string | null; body: string | null; document_url: string | null }[];
  awards: { recipient: string; award_title: string; description: string | null }[];
  fundraising: { purpose: string; target_amount: number | null; amount_raised: number | null; currency: string }[];
}

export interface GalleryItem {
  id: string;
  title: string | null;
  image_url: string;
  alt_text: string;
  caption: string | null;
  category: string;
  event_year: number | null;
}

export interface DevelopmentProject {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string | null;
  objective: string | null;
  status: ProjectStatus;
  location: string | null;
  start_date: string | null;
  expected_completion: string | null;
  budget: number | null;
  amount_raised: number | null;
  funding_target: number | null;
  currency: string;
  funding_source: string | null;
  responsible_organisation: string | null;
  verification_status: VerificationStatus;
  images: { image_url: string; caption: string | null }[];
  updates: { title: string; body: string | null; update_date: string }[];
  documents: { title: string; document_url: string; document_type: string | null }[];
  timeline: { milestone: string; event_date: string | null; notes: string | null }[];
}

export interface HistoricalPerson {
  id: string;
  name: string;
  slug: string;
  category: string;
  photo_url: string | null;
  biography: string | null;
  achievements: string | null;
  external_links: { label: string; url: string }[];
  verification_status: VerificationStatus;
}

export interface TraditionalRuler {
  id: string;
  full_name: string;
  regnal_title: string;
  reign_start: string | null;
  reign_end: string | null;
  is_current: boolean;
  biography: string | null;
  photo_url: string | null;
  verification_status: VerificationStatus;
}

export interface ArchiveItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  item_date: string | null;
  is_approximate_date: boolean;
  category: string;
  contributor: string | null;
  rights_notes: string | null;
  verification_status: VerificationStatus;
  tags: string[];
  file_url: string | null;
  thumbnail_url: string | null;
  access_level: AccessLevel;
}

export interface OralHistory {
  id: string;
  interviewee: string;
  interviewer: string | null;
  interview_date: string | null;
  photo_url: string | null;
  audio_url: string | null;
  video_url: string | null;
  transcript: string | null;
  summary: string | null;
  topics: string[];
  verification_status: VerificationStatus;
}
