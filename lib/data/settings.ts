import { getPublicSupabase } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/site-config";
import { env } from "@/lib/env";

export interface SiteSettings {
  site_title: string;
  tagline: string;
  contact_email: string | null;
  contact_phone: string | null;
  social_links: Record<string, string>;
  footer_text: string | null;
  weather_enabled: boolean;
  weather_location_label: string;
  weather_forecast_url: string;
  weather_show_on_homepage: boolean;
  weather_show_in_header: boolean;
  google_photos_url: string | null;
  google_photos_enabled: boolean;
  google_photos_title: string;
  google_photos_description: string;
}

const defaults: SiteSettings = {
  site_title: siteConfig.name,
  tagline: siteConfig.tagline,
  contact_email: siteConfig.contact.email,
  contact_phone: null,
  social_links: {
    youtube: siteConfig.contact.youtube,
  },
  footer_text: null,
  weather_enabled: true,
  weather_location_label: "Takete-Ide Amuro",
  weather_forecast_url: env.accuweatherForecastUrl,
  weather_show_on_homepage: true,
  weather_show_in_header: true,
  google_photos_url: process.env.NEXT_PUBLIC_GOOGLE_PHOTOS_URL?.trim() || null,
  google_photos_enabled: true,
  google_photos_title: siteConfig.photoArchive.title,
  google_photos_description: siteConfig.photoArchive.description,
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = getPublicSupabase();
  if (!supabase) return defaults;
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", true).maybeSingle();
  if (error || !data) return defaults;
  return {
    ...defaults,
    ...data,
    contact_email: data.contact_email || defaults.contact_email,
    social_links: {
      ...defaults.social_links,
      ...(data.social_links ?? {}),
    },
    google_photos_url: data.google_photos_url !== undefined ? data.google_photos_url : defaults.google_photos_url,
    google_photos_enabled: data.google_photos_enabled !== undefined ? Boolean(data.google_photos_enabled) : defaults.google_photos_enabled,
    google_photos_title: data.google_photos_title || defaults.google_photos_title,
    google_photos_description: data.google_photos_description || defaults.google_photos_description,
  };
}
