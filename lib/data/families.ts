import { createClient } from "@/lib/supabase/server";
import type { Compound, Family, Oriki } from "@/types/family";

const FAMILY_SELECT =
  "*, compounds(id, name, slug), family_media(id, media_type, url, caption, approximate_date, people_shown, publication_permission), oriki(id, title, slug, verification_status, status)";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapFamily(row: any): Family {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    alternative_names: row.alternative_names ?? [],
    compound: row.compounds ? { id: row.compounds.id, name: row.compounds.name, slug: row.compounds.slug } : null,
    summary: row.summary,
    history: row.history,
    known_ancestral_accounts: row.known_ancestral_accounts,
    migration_settlement_history: row.migration_settlement_history,
    values_and_traditions: row.values_and_traditions,
    notable_contributions: row.notable_contributions,
    verification_status: row.verification_status,
    media: (row.family_media ?? []).filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (m: any) => m.publication_permission,
    ),
    oriki: (row.oriki ?? []).filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (o: any) => o.status === "published",
    ),
  };
}

export async function getFamilies(): Promise<Family[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("families").select(FAMILY_SELECT).eq("status", "published").order("name");
  if (error || !data) return [];
  return data.map(mapFamily);
}

export async function getFamilyBySlug(slug: string): Promise<Family | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from("families").select(FAMILY_SELECT).eq("slug", slug).eq("status", "published").maybeSingle();
  if (error || !data) return null;
  return mapFamily(data);
}

export async function getCompounds(): Promise<Compound[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("compounds").select("*").eq("status", "published").order("name");
  if (error || !data) return [];
  return data;
}

const ORIKI_SELECT =
  "*, families(id, name, slug), compounds(id, name, slug), oriki_media(media_type, url, transcript)";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapOriki(row: any): Oriki {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    family: row.families ? { id: row.families.id, name: row.families.name, slug: row.families.slug } : null,
    compound: row.compounds ? { id: row.compounds.id, name: row.compounds.name, slug: row.compounds.slug } : null,
    language: row.language,
    original_text: row.original_text,
    transliteration: row.transliteration,
    english_interpretation: row.english_interpretation,
    cultural_notes: row.cultural_notes,
    performer: row.performer,
    recording_date: row.recording_date,
    verification_status: row.verification_status,
    consentConfirmed: Boolean(row.consent_confirmed),
    // Recordings are withheld unless the performer/family confirmed consent for
    // the recording to be archived at all (migration 0011). `publication_permission`
    // governs whether the Oríkì text may appear publicly; `consent_confirmed` is
    // the narrower, prior question about the recording itself — so the text can
    // be published while the audio or video stays unavailable.
    media: row.consent_confirmed ? (row.oriki_media ?? []) : [],
  };
}

export async function getOrikiList(): Promise<Oriki[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("oriki")
    .select(ORIKI_SELECT)
    .eq("status", "published")
    .eq("publication_permission", true)
    .order("title");
  if (error || !data) return [];
  return data.map(mapOriki);
}

/**
 * A single Oríkì for the public detail page.
 *
 * `publication_permission` is checked here as well as in the listing. Without it
 * an Oríkì the family had not permitted for publication was hidden from the index
 * but still served in full at its own URL — the family's consent decision has to
 * hold on every route that can reach the row, not just the one that lists it.
 */
export async function getOrikiBySlug(slug: string): Promise<Oriki | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("oriki")
    .select(ORIKI_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .eq("publication_permission", true)
    .maybeSingle();
  if (error || !data) return null;
  return mapOriki(data);
}
