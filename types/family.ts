export type FamilyVerificationStatus =
  | "draft"
  | "family_submitted"
  | "oral_history"
  | "documentary_evidence"
  | "community_reviewed"
  | "verified"
  | "disputed";

export interface Compound {
  id: string;
  name: string;
  alternative_name: string | null;
  slug: string;
  description: string | null;
  photo_url: string | null;
  approximate_location: string | null;
  verification_status: FamilyVerificationStatus;
}

export interface Family {
  id: string;
  name: string;
  slug: string;
  alternative_names: string[];
  compound: Pick<Compound, "id" | "name" | "slug"> | null;
  summary: string | null;
  history: string | null;
  known_ancestral_accounts: string | null;
  migration_settlement_history: string | null;
  values_and_traditions: string | null;
  notable_contributions: string | null;
  verification_status: FamilyVerificationStatus;
  media: FamilyMedia[];
  oriki: OrikiSummary[];
}

export interface FamilyMedia {
  id: string;
  media_type: "photo" | "document" | "audio" | "video";
  url: string;
  caption: string | null;
  approximate_date: string | null;
  people_shown: string | null;
}

export interface OrikiSummary {
  id: string;
  title: string;
  slug: string;
  verification_status: FamilyVerificationStatus;
}

export interface Oriki {
  id: string;
  title: string;
  slug: string;
  family: Pick<Family, "id" | "name" | "slug"> | null;
  compound: Pick<Compound, "id" | "name" | "slug"> | null;
  language: string;
  original_text: string;
  transliteration: string | null;
  english_interpretation: string | null;
  cultural_notes: string | null;
  performer: string | null;
  recording_date: string | null;
  verification_status: FamilyVerificationStatus;
  media: { media_type: "audio" | "video"; url: string; transcript: string | null }[];
}
