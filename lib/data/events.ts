import { createClient } from "@/lib/supabase/server";
import type { TaketeIdeEvent } from "@/types/content";

const SELECT = "*, event_media(media_type, url, caption), event_speeches(speaker, title, body, document_url), event_awards(recipient, award_title, description), event_fundraising(purpose, target_amount, amount_raised, currency)";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapEvent(row: any): TaketeIdeEvent {
  return {
    id: row.id,
    year: row.year,
    slug: row.slug,
    theme: row.theme,
    event_date: row.event_date,
    description: row.description,
    chairman: row.chairman,
    guest_information: row.guest_information,
    programme_document_url: row.programme_document_url,
    status: row.status,
    media: row.event_media ?? [],
    speeches: row.event_speeches ?? [],
    awards: row.event_awards ?? [],
    fundraising: row.event_fundraising ?? [],
  };
}

export async function getPublishedEvents(): Promise<TaketeIdeEvent[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("events").select(SELECT).eq("status", "published").order("year", { ascending: false });
  if (error || !data) return [];
  return data.map(mapEvent);
}

export async function getLatestEvent(): Promise<TaketeIdeEvent | null> {
  const events = await getPublishedEvents();
  return events[0] ?? null;
}

export async function getEventByYear(year: number): Promise<TaketeIdeEvent | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from("events").select(SELECT).eq("year", year).eq("status", "published").maybeSingle();
  if (error || !data) return null;
  return mapEvent(data);
}
