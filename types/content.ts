export type ContentStatus = "draft" | "pending_review" | "verified" | "published" | "archived";

export type VerificationStatus =
  | "verified"
  | "community_record"
  | "historical_source"
  | "oral_testimony"
  | "awaiting_verification"
  | "documentary_evidence"
  | "oral_history"
  | "community_tradition"
  | "unverified"
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

export interface ProvenanceRecord {
  source_title?: string | null;
  source_author?: string | null;
  source_type?: string | null;
  source_date?: string | null;
  page_reference?: string | null;
  submitted_by?: string | null;
  verified_by?: string | null;
  last_verified_at?: string | null;
  verification_status: VerificationStatus;
}

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
  is_featured: boolean;
  author_name?: string | null;
  image_caption?: string | null;
  /** External attribution, where a story is reproduced with permission. */
  source_name: string | null;
  source_url: string | null;
  /** Optional pointers to what the article is about (migration 0018). */
  related_project: { title: string; slug: string } | null;
  related_branch_slug: string | null;
  related_event_year: number | null;
  last_verified_at?: string | null;
  verification_status?: VerificationStatus;
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
  object_position?: string;
  is_placeholder?: boolean;
  placeholder_title?: string;
  placeholder_subtitle?: string;
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
  amount_spent?: number | null;
  funding_target: number | null;
  progress_percentage?: number | null;
  currency: string;
  funding_source: string | null;
  responsible_organisation: string | null;
  publication_status?: ContentStatus;
  verification_status: VerificationStatus;
  source_name?: string | null;
  source_url?: string | null;
  last_financial_update?: string | null;
  expenditure_notes?: string | null;
  last_verified_at?: string | null;
  verified_by?: string | null;
  images: { image_url: string; caption: string | null; stage?: "before" | "progress" | "completion" | "general" }[];
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
  contribution?: string | null;
  period?: string | null;
  source_name?: string | null;
  source_url?: string | null;
  consent_status?: "consented" | "public_record" | "family_nominated" | "pending";
  external_links: { label: string; url: string }[];
  verification_status: VerificationStatus;
  last_verified_at?: string | null;
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
  last_verified_at?: string | null;
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
  last_verified_at?: string | null;
}

export interface OralHistory {
  id: string;
  title?: string | null;
  interviewee: string;
  speaker?: string | null;
  interviewer: string | null;
  interview_date: string | null;
  photo_url: string | null;
  audio_url: string | null;
  video_url: string | null;
  transcript: string | null;
  summary: string | null;
  family_compound?: string | null;
  language?: string | null;
  recording_location?: string | null;
  recorded_by?: string | null;
  duration?: string | null;
  english_translation?: string | null;
  historical_notes?: string | null;
  source?: string | null;
  consent_status?: "consented" | "oral_tradition" | "family_authorized" | "pending";
  topics: string[];
  verification_status: VerificationStatus;
  related_family_slug?: string | null;
  related_person_slug?: string | null;
  last_verified_at?: string | null;
}

export interface School {
  id: string;
  name: string;
  slug: string;
  school_type: "public" | "community" | "mission" | "private";
  level: "nursery_primary" | "primary" | "secondary" | "vocational" | "tertiary";
  location: string;
  year_established: number | null;
  establishment_milestones?: { label: string; year: string | number }[];
  historical_description: string | null;
  current_head: string | null;
  approximate_enrolment: number | null;
  facilities: string[];
  community_needs: string[];
  current_projects: string[];
  photographs: string[];
  source_title: string | null;
  source_author: string | null;
  source_date: string | null;
  verified_by: string | null;
  last_verified_at: string | null;
  verification_status: VerificationStatus;
  status: ContentStatus;
  display_order: number;
}

