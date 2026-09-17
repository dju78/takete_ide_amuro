import { getPublicSupabase } from "@/lib/supabase/server";

export interface OrikiRecord {
  id: string;
  family_origin: string;
  male_oriki: string;
  female_oriki: string;
  notes?: string | null;
  audio_url?: string | null;
  audio_title?: string | null;
  display_order: number;
  published: boolean;
  created_at?: string;
  updated_at?: string;
  updated_by?: string | null;
}

interface ApprovedAudioInfo {
  audio_url: string;
  audio_title: string;
}

const APPROVED_AUDIO_MAP: Record<"eseha" | "mesami" | "eseyintelu", ApprovedAudioInfo> = {
  eseha: {
    audio_url: "/audio/oriki/eseha-jare.ogg",
    audio_title: "Oríkì Eseha Jare",
  },
  mesami: {
    audio_url: "/audio/oriki/mesami-olu.ogg",
    audio_title: "Oríkì Mesami Olu",
  },
  eseyintelu: {
    audio_url: "/audio/oriki/eseyin-telu.ogg",
    audio_title: "Oríkì Eseyin Telu",
  },
};

function normalizeKey(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Resolves verified audio recordings for approved Oríkì families safely.
 * Works seamlessly whether records come from static dataset (IDs "1", "7", "9")
 * or live Supabase rows (UUIDs) with standard community name variations.
 */
export function resolveApprovedAudio(record: Pick<OrikiRecord, "id" | "family_origin" | "male_oriki" | "audio_url" | "audio_title">): ApprovedAudioInfo | null {
  // If record already has a custom audio_url explicitly provided, preserve it
  if (record.audio_url && record.audio_url.trim().length > 0) {
    return {
      audio_url: record.audio_url.trim(),
      audio_title: record.audio_title?.trim() || `Oríkì ${record.family_origin}`,
    };
  }

  // Check static record ID fallback
  if (record.id === "1") return APPROVED_AUDIO_MAP.eseha;
  if (record.id === "7") return APPROVED_AUDIO_MAP.mesami;
  if (record.id === "9") return APPROVED_AUDIO_MAP.eseyintelu;

  const familyNorm = normalizeKey(record.family_origin || "");
  const maleNorm = normalizeKey(record.male_oriki || "");

  // 1. Eseha Jare / Eseha / Eseha Jaree
  if (
    familyNorm.startsWith("eseha") ||
    maleNorm.startsWith("eseha") ||
    familyNorm === "esehajare" ||
    familyNorm === "esehajaree" ||
    familyNorm === "eseha"
  ) {
    return APPROVED_AUDIO_MAP.eseha;
  }

  // 2. Attemesami Olu / Mesami Olu / Atte Mesami Olu
  // Strictly matches "mesami", distinguishing from other Atte/Attem families (Attemogbe, Attemoyi, Attejagbo, etc.)
  if (
    familyNorm.includes("mesami") ||
    maleNorm.includes("mesami")
  ) {
    return APPROVED_AUDIO_MAP.mesami;
  }

  // 3. Eseyin Telu
  // Strictly matches "eseyin" + "telu" (or contains "telu"), distinguishing from Eseyinmeleun and Eseyin Meta
  if (
    (familyNorm.includes("eseyin") && familyNorm.includes("telu")) ||
    (maleNorm.includes("eseyin") && maleNorm.includes("telu")) ||
    familyNorm === "eseyintelu" ||
    maleNorm === "eseyintelu"
  ) {
    return APPROVED_AUDIO_MAP.eseyintelu;
  }

  return null;
}

export function withApprovedAudio(record: OrikiRecord): OrikiRecord {
  const audioInfo = resolveApprovedAudio(record);
  if (!audioInfo) {
    return {
      ...record,
      audio_url: record.audio_url ?? null,
      audio_title: record.audio_title ?? null,
    };
  }
  return {
    ...record,
    audio_url: record.audio_url || audioInfo.audio_url,
    audio_title: record.audio_title || audioInfo.audio_title,
  };
}

export const APPROVED_ORIKI_RECORDS: OrikiRecord[] = [
  { id: "1", family_origin: "Eseha", male_oriki: "Eseha", female_oriki: "Eha", display_order: 1, published: true },
  { id: "2", family_origin: "Attemogbe", male_oriki: "Attemogbe", female_oriki: "Anumogbe", display_order: 2, published: true },
  { id: "3", family_origin: "Attemoyi", male_oriki: "Attemoyi", female_oriki: "Anumoyi", display_order: 3, published: true },
  { id: "4", family_origin: "Eseyinmeleun", male_oriki: "Eseyinmeleun", female_oriki: "Omoeemeleu", display_order: 4, published: true },
  { id: "5", family_origin: "Attejagbo", male_oriki: "Attejagbo", female_oriki: "Anujagbo", display_order: 5, published: true },
  { id: "6", family_origin: "Meleri", male_oriki: "Meleri", female_oriki: "Iyemeleri", display_order: 6, published: true },
  { id: "7", family_origin: "Attemesami Olu", male_oriki: "Attemesami Olu", female_oriki: "Anumesami Olu", display_order: 7, published: true },
  { id: "8", family_origin: "Ako", male_oriki: "Ako", female_oriki: "Ako", display_order: 8, published: true },
  { id: "9", family_origin: "Eseyin Telu", male_oriki: "Eseyin Telu", female_oriki: "Omoe Telu", display_order: 9, published: true },
  { id: "10", family_origin: "Anjaba", male_oriki: "Anjaba", female_oriki: "Anjaba", display_order: 10, published: true },
  { id: "11", family_origin: "Atte Meto", male_oriki: "Atte Meto", female_oriki: "Anu Meto", display_order: 11, published: true },
  { id: "12", family_origin: "Iyaloko", male_oriki: "Iyaloko", female_oriki: "Iyaloko", display_order: 12, published: true },
  { id: "13", family_origin: "Awinrin Mope", male_oriki: "Awinrin Mope", female_oriki: "Awinrin Mope", display_order: 13, published: true },
  { id: "14", family_origin: "Atte Lase", male_oriki: "Atte Lase", female_oriki: "Anu Lase", display_order: 14, published: true },
  { id: "15", family_origin: "Ota", male_oriki: "Ota", female_oriki: "Onanra", display_order: 15, published: true },
  { id: "16", family_origin: "Atte Meya", male_oriki: "Atte Meya", female_oriki: "Anu Meya", display_order: 16, published: true },
  { id: "17", family_origin: "Eseyin Meta", male_oriki: "Eseyin Meta", female_oriki: "Anu Meta", display_order: 17, published: true },
  { id: "18", family_origin: "Obanro", male_oriki: "Obanro", female_oriki: "Omosinla", display_order: 18, published: true },
].map(withApprovedAudio);

export async function getOrikiRecords(options?: { query?: string; publishedOnly?: boolean }): Promise<OrikiRecord[]> {
  const publishedOnly = options?.publishedOnly ?? true;
  const query = options?.query?.trim().toLowerCase();

  const supabase = getPublicSupabase();
  if (supabase) {
    let q = supabase.from("oriki_records").select("*");
    if (publishedOnly) {
      q = q.eq("published", true);
    }
    q = q.order("display_order", { ascending: true }).order("family_origin", { ascending: true });

    const { data, error } = await q;
    if (!error && data && data.length > 0) {
      let results = (data as OrikiRecord[]).map(withApprovedAudio);
      if (query) {
        results = results.filter(
          (r) =>
            r.family_origin.toLowerCase().includes(query) ||
            r.male_oriki.toLowerCase().includes(query) ||
            r.female_oriki.toLowerCase().includes(query) ||
            (r.notes && r.notes.toLowerCase().includes(query))
        );
      }
      return results;
    }
  }

  // Graceful fallback to static approved dataset
  let results = [...APPROVED_ORIKI_RECORDS];
  if (query) {
    results = results.filter(
      (r) =>
        r.family_origin.toLowerCase().includes(query) ||
        r.male_oriki.toLowerCase().includes(query) ||
        r.female_oriki.toLowerCase().includes(query) ||
        (r.notes && r.notes.toLowerCase().includes(query))
    );
  }
  return results;
}

export async function getOrikiRecordById(id: string): Promise<OrikiRecord | null> {
  const supabase = getPublicSupabase();
  if (supabase) {
    const { data, error } = await supabase.from("oriki_records").select("*").eq("id", id).maybeSingle();
    if (!error && data) return withApprovedAudio(data as OrikiRecord);
  }
  return APPROVED_ORIKI_RECORDS.find((r) => r.id === id) ?? null;
}
