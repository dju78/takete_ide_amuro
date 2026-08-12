import { createClient } from "@/lib/supabase/server";
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
}

const defaults: SiteSettings = {
  site_title: siteConfig.name,
  tagline: siteConfig.tagline,
  contact_email: null,
  contact_phone: null,
  social_links: {},
  footer_text: null,
  weather_enabled: true,
  weather_location_label: "Takete-Ide Amuro",
  weather_forecast_url: env.accuweatherForecastUrl,
  weather_show_on_homepage: true,
  weather_show_in_header: true,
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  if (!supabase) return defaults;
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", true).maybeSingle();
  if (error || !data) return defaults;
  return { ...defaults, ...data };
}
