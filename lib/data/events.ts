import { getPublicSupabase } from "@/lib/supabase/server";
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

export const CANONICAL_EVENTS: TaketeIdeEvent[] = [
  {
    id: "event-2025",
    year: 2025,
    slug: "takete-ide-day-2025",
    theme: "Celebrating Heritage, Community Unity & Socio-Cultural Development",
    event_date: "2025-10-25",
    description:
      "The 2025 Takete-Ide Day celebration held on 25 October 2025, bringing together indigenes at home and in the diaspora, royal fathers, community elders and distinguished state dignitaries including the Deputy Governor of Kogi State for a historic celebration of culture, awards conferment and community development.",
    chairman: "Chief Samuel O. Ipinlaiye & Community Dignitaries",
    guest_information:
      "His Excellency Comrade Joel Salifu Oyibo (Deputy Governor of Kogi State), His Royal Highness Oba Philip Ebilakun (JP) (The Olude of Takete-Ide Amuro), Prince (Bldr) Richard Dare Fiki (National President, TIPU), and community leaders.",
    programme_document_url: null,
    status: "published",
    media: [
      {
        media_type: "video",
        url: "/videos/takete-ide/arrival-of-deputy-governor.mp4",
        caption: "Arrival of the Deputy Governor of Kogi State, His Excellency Comrade Joel Salifu Oyibo, at Takete-Ide for the annual celebration.",
      },
      {
        media_type: "photo",
        url: "/images/takete-ide/celebrations/cultural-ambassador-award-conferment-2025.jpg",
        caption: "Conferment of Cultural Ambassador certificate to Amb. Chief Samuel O. Ipinlaiye by HRH Oba Philip Ebilakun (JP) alongside the Deputy Governor of Kogi State.",
      },
      {
        media_type: "photo",
        url: "/images/takete-ide/celebrations/chief-samuel-ipinlaiye-cultural-attire.jpg",
        caption: "Amb. Chief Samuel O. Ipinlaiye adorned in traditional Takete-Ide woven regalia and sash holding ceremonial staff.",
      },
      {
        media_type: "photo",
        url: "/images/takete-ide/places/takete-ide-street-view.png",
        caption: "Takete-Ide townscape and arrival road during the celebration period.",
      },
      {
        media_type: "photo",
        url: "/images/takete-ide/takete-ide-day-2025.jpg",
        caption: "Community assembly and news coverage of Takete-Ide Day 2025.",
      },
    ],
    speeches: [
      {
        speaker: "His Excellency Comrade Joel Salifu Oyibo",
        title: "Address by the Deputy Governor of Kogi State",
        body: "Commended the people of Takete-Ide for their enduring unity, self-help development ethos and cultural pride, reiterating the state government's commitment to community infrastructure and grassroots development.",
        document_url: null,
      },
      {
        speaker: "HRH Oba Philip Ebilakun (JP)",
        title: "Royal Address by The Olude of Takete-Ide Amuro",
        body: "Welcomed all guests, celebrated the sons and daughters of Takete-Ide, and urged all indigenes to maintain peace, mutual support and active involvement in preparing for the centenary.",
        document_url: null,
      },
    ],
    awards: [
      {
        recipient: "Amb. Chief Samuel O. Ipinlaiye",
        award_title: "Cultural Ambassador of Takete-Ide",
        description:
          "Conferred on 25th October 2025 by His Royal Highness Oba Philip Ebilakun (JP), The Olude of Takete-Ide Amuro, and Prince (Bldr) Richard Dare Fiki, National President of TIPU, in recognition and conferment of dedicated service and cultural ambassadorship.",
      },
    ],
    fundraising: [
      {
        purpose: "Community Infrastructure & Centenary Heritage Projects",
        target_amount: 50000000,
        amount_raised: 18500000,
        currency: "NGN",
      },
    ],
  },
  {
    id: "event-2024",
    year: 2024,
    slug: "takete-ide-day-2024",
    theme: "Preserving Our Heritage, Inspiring the Future",
    event_date: "2024-11-02",
    description:
      "The 2024 Takete-Ide Day celebration and community reunion focusing on youth empowerment, educational development, and preparatory milestones toward the 2026 Centenary.",
    chairman: "TIPU Central Executive & Community Elders",
    guest_information: "Royal fathers of Amuro land, community leaders, and branch delegates.",
    programme_document_url: null,
    status: "published",
    media: [
      {
        media_type: "photo",
        url: "/images/takete-ide/takete-ide-day.jpg",
        caption: "Community members gathered in celebration of Takete-Ide Day.",
      },
      {
        media_type: "photo",
        url: "/images/takete-ide/cultural-procession.jpg",
        caption: "Traditional cultural procession during the annual celebration.",
      },
    ],
    speeches: [],
    awards: [],
    fundraising: [
      {
        purpose: "Civic Centre Renovations and Community Electrification",
        target_amount: 30000000,
        amount_raised: 12000000,
        currency: "NGN",
      },
    ],
  },
];

export async function getPublishedEvents(): Promise<TaketeIdeEvent[]> {
  const supabase = getPublicSupabase();
  let dbEvents: TaketeIdeEvent[] = [];
  if (supabase) {
    try {
      const { data, error } = await supabase.from("events").select(SELECT).eq("status", "published").order("year", { ascending: false });
      if (!error && data && data.length > 0) {
        dbEvents = data.map(mapEvent);
      }
    } catch {
      // Fall back to canonical records
    }
  }

  const map = new Map<number, TaketeIdeEvent>();
  for (const event of CANONICAL_EVENTS) {
    map.set(event.year, event);
  }
  for (const event of dbEvents) {
    map.set(event.year, event);
  }

  return Array.from(map.values()).sort((a, b) => b.year - a.year);
}

export async function getLatestEvent(): Promise<TaketeIdeEvent | null> {
  const events = await getPublishedEvents();
  return events[0] ?? null;
}

export async function getEventByYear(year: number): Promise<TaketeIdeEvent | null> {
  const events = await getPublishedEvents();
  return events.find((e) => e.year === year) ?? null;
}
