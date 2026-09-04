"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import { logAudit } from "@/lib/data/admin";
import type { AdminFormState } from "@/lib/actions/admin-news";

export async function updateSiteSettingsAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const user = await requireStaff("administrator");
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Supabase is not configured." };

  const social_links = {
    facebook: String(formData.get("social_facebook") ?? "") || undefined,
    instagram: String(formData.get("social_instagram") ?? "") || undefined,
    whatsapp: String(formData.get("social_whatsapp") ?? "") || undefined,
    youtube: String(formData.get("social_youtube") ?? "") || undefined,
  };

  const { error } = await supabase
    .from("site_settings")
    .update({
      site_title: String(formData.get("site_title") ?? "").trim(),
      tagline: String(formData.get("tagline") ?? "").trim(),
      contact_email: String(formData.get("contact_email") ?? "").trim() || null,
      contact_phone: String(formData.get("contact_phone") ?? "").trim() || null,
      social_links,
      footer_text: String(formData.get("footer_text") ?? "").trim() || null,
      weather_enabled: formData.get("weather_enabled") === "on",
      weather_location_label: String(formData.get("weather_location_label") ?? "").trim(),
      weather_forecast_url: String(formData.get("weather_forecast_url") ?? "").trim(),
      weather_show_on_homepage: formData.get("weather_show_on_homepage") === "on",
      weather_show_in_header: formData.get("weather_show_in_header") === "on",
      updated_by: user.id,
    })
    .eq("id", true);

  if (error) return { status: "error", message: `Could not save settings: ${error.message}` };

  await logAudit(user.id, "update", "site_settings");
  revalidatePath("/", "layout");
  return { status: "idle", message: "Settings saved." };
}
