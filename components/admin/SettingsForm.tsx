"use client";

import { useActionState } from "react";
import { TextField, CheckboxField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { updateSiteSettingsAction } from "@/lib/actions/admin-settings";
import type { AdminFormState } from "@/lib/actions/admin-news";
import type { SiteSettings } from "@/lib/data/settings";

const initialState: AdminFormState = { status: "idle" };

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction] = useActionState(updateSiteSettingsAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-8" noValidate>
      {state.message && (
        <p className={`rounded-xl p-3 text-sm ${state.status === "error" ? "bg-red-100 text-red-700" : "bg-green-600/10 text-green-700"}`}>
          {state.message}
        </p>
      )}

      <fieldset className="flex flex-col gap-5">
        <legend className="mb-1 font-serif text-lg font-bold text-purple-600">Site Identity</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Site Title" name="site_title" defaultValue={settings.site_title} required />
          <TextField label="Tagline" name="tagline" defaultValue={settings.tagline} required />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-5">
        <legend className="mb-1 font-serif text-lg font-bold text-purple-600">Contact Details</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Contact Email" name="contact_email" type="email" defaultValue={settings.contact_email ?? ""} />
          <TextField label="Contact Phone" name="contact_phone" defaultValue={settings.contact_phone ?? ""} />
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <TextField label="Facebook URL" name="social_facebook" defaultValue={settings.social_links?.facebook ?? ""} />
          <TextField label="Instagram URL" name="social_instagram" defaultValue={settings.social_links?.instagram ?? ""} />
          <TextField label="WhatsApp Link" name="social_whatsapp" defaultValue={settings.social_links?.whatsapp ?? ""} />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-5">
        <legend className="mb-1 font-serif text-lg font-bold text-purple-600">Weather</legend>
        <CheckboxField name="weather_enabled" label="Enable the weather section site-wide" defaultChecked={settings.weather_enabled} />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Location Label" name="weather_location_label" defaultValue={settings.weather_location_label} />
          <TextField label="AccuWeather Forecast URL" name="weather_forecast_url" defaultValue={settings.weather_forecast_url} />
        </div>
        <CheckboxField name="weather_show_on_homepage" label="Show weather card on the homepage" defaultChecked={settings.weather_show_on_homepage} />
        <CheckboxField name="weather_show_in_header" label="Show compact weather indicator in the site header" defaultChecked={settings.weather_show_in_header} />
        <p className="text-xs text-charcoal/50">
          The AccuWeather API key and location key are environment secrets (ACCUWEATHER_API_KEY,
          ACCUWEATHER_LOCATION_KEY) and are not editable from this screen.
        </p>
      </fieldset>

      <fieldset className="flex flex-col gap-5">
        <legend className="mb-1 font-serif text-lg font-bold text-purple-600">Footer</legend>
        <TextField label="Footer Text" name="footer_text" defaultValue={settings.footer_text ?? ""} />
      </fieldset>

      <SubmitButton>Save Settings</SubmitButton>
    </form>
  );
}
