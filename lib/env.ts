/**
 * Central place that knows which env vars exist and whether each optional
 * integration is configured. Never throws — the site must build and run
 * with zero secrets configured (see docs/DECISIONS.md).
 */
export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  accuweatherApiKey: process.env.ACCUWEATHER_API_KEY,
  accuweatherLocationKey: process.env.ACCUWEATHER_LOCATION_KEY || "923542",
  accuweatherForecastUrl:
    process.env.NEXT_PUBLIC_ACCUWEATHER_FORECAST_URL ||
    "https://www.accuweather.com/en/ng/takete-ide/923542/weather-forecast/923542",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://taketeideamuro.org",
  emailFrom: process.env.EMAIL_FROM,
  emailProviderApiKey: process.env.EMAIL_PROVIDER_API_KEY,
  contactNotifyAddress: process.env.CONTACT_NOTIFY_EMAIL,
};

export const isSupabaseConfigured = Boolean(env.supabaseUrl && env.supabaseAnonKey);
export const isWeatherConfigured = Boolean(env.accuweatherApiKey && env.accuweatherLocationKey);
export const isEmailConfigured = Boolean(env.emailProviderApiKey && env.emailFrom);
