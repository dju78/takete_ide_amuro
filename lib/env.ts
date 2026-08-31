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

  // ── Paystack ──────────────────────────────────────────────────────────────
  // The secret key is read here but must never be imported into a Client
  // Component. Only lib/payments/paystack.ts touches it, and that module is
  // marked server-only.
  paystackSecretKey: process.env.PAYSTACK_SECRET_KEY,

  // Contribution bounds, in the currency's major unit (naira). Defaults are an
  // operational guard against typos and abuse, not a legal limit — the union can
  // set its own policy by overriding these.
  contributionMinMajor: Number(process.env.CONTRIBUTION_MIN_AMOUNT ?? 100),
  contributionMaxMajor: Number(process.env.CONTRIBUTION_MAX_AMOUNT ?? 5_000_000),
};

/**
 * Online contributions require the secret key and nothing else.
 *
 * This is a redirect flow: the server calls transaction/initialize with the
 * secret key and the browser is sent to Paystack's own checkout, so no publishable
 * key is ever needed. Gating on one would have made the feature depend on a
 * variable that does nothing — a missing value disabling a payment path that
 * would otherwise work perfectly.
 *
 * With the key unset the online path disappears entirely and the Direct Bank
 * Transfer card is unaffected.
 */
export const isPaystackConfigured = Boolean(env.paystackSecretKey);

/**
 * The secret key is self-describing, so the mode is derived from it rather than
 * from a separate flag that someone could forget to flip.
 *
 * Anything that is not explicitly a live-prefixed key resolves to "test",
 * including a malformed one — the failure mode of this comparison is to
 * under-claim rather than to present a test deployment as production.
 */
export const paystackMode: "test" | "live" | "unconfigured" = !env.paystackSecretKey
  ? "unconfigured"
  : env.paystackSecretKey.startsWith("sk_live_")
    ? "live"
    : "test";

export const isSupabaseConfigured = Boolean(env.supabaseUrl && env.supabaseAnonKey);
export const isWeatherConfigured = Boolean(env.accuweatherApiKey && env.accuweatherLocationKey);
export const isEmailConfigured = Boolean(env.emailProviderApiKey && env.emailFrom);
