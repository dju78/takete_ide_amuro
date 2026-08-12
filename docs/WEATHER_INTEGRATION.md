# Weather Integration

## Provider

[AccuWeather](https://developer.accuweather.com/) REST API, called **server-side only**.
Takete-Ide's resolved location key is `923542` (from the supplied forecast URL
`https://www.accuweather.com/en/ng/takete-ide/923542/weather-forecast/923542`).

## Environment Variables

```
ACCUWEATHER_API_KEY=                # server-only secret, from your AccuWeather developer account
ACCUWEATHER_LOCATION_KEY=923542     # already resolved for Takete-Ide; safe default
NEXT_PUBLIC_ACCUWEATHER_FORECAST_URL=https://www.accuweather.com/en/ng/takete-ide/923542/weather-forecast/923542
```

With `ACCUWEATHER_API_KEY` unset, every weather surface renders its graceful fallback — the site
still builds and runs.

## Architecture

```
types/weather.ts                    Internal model (WeatherCurrent, WeatherForecast) + WeatherProvider interface
lib/weather/accuweather-provider.ts AccuWeatherProvider implements WeatherProvider
lib/weather/mapper.ts               Raw AccuWeather JSON → internal model
lib/weather/service.ts              getCurrentWeather() / getForecast() — what the rest of the app calls
lib/weather/icon.ts                 Icon-code → CDN URL, and → background "mood" for the card
app/api/weather/current/route.ts    Public API route (available: boolean, current?)
app/api/weather/forecast/route.ts   Public API route (available: boolean, forecast?)
components/weather/*                WeatherCard (homepage + /weather), HeaderWeatherIndicator,
                                     EventWeather (Takete-Ide Day pages), WeatherUnavailable, attribution
app/weather/page.tsx                Full forecast page
```

The UI never touches AccuWeather's raw response shape — only the internal `WeatherCurrent` /
`WeatherForecast` types from `types/weather.ts`. Swapping providers means writing one new class that
implements `WeatherProvider` and pointing `lib/weather/service.ts` at it.

## Caching

`fetch(..., { next: { revalidate: 1800 } })` — a 30-minute window. Current conditions don't need to
be fetched per-visitor-request; this keeps API usage well within free/low tiers.

## Fallback Behaviour

- **No API key configured** → `getCurrentWeather()`/`getForecast()` return `null` immediately
  (`isWeatherConfigured` check in `lib/weather/service.ts`), no network call attempted.
- **API call fails or times out** (8s timeout, `AbortController`) → caught, logged via
  `console.error("[weather] …")`, function returns `null`.
- Every consumer (`WeatherHomeSection`, `/weather`, `HeaderWeatherIndicator`) treats `null` as "show
  the fallback" — `WeatherUnavailable` (linking out to AccuWeather directly) on the homepage/weather
  page, and simply rendering nothing in the header (per spec: never show the header indicator without
  real data).

## Attribution

`components/weather/AccuWeatherAttribution.tsx` renders "Weather data provided by AccuWeather" with
a link to the official Takete-Ide forecast page on every weather surface, satisfying the AccuWeather
API licence's attribution requirement. Do not remove it.

## Admin Controls

`/admin/settings` → Weather section: enable/disable, location label, forecast URL, homepage/header
visibility toggles. The API key and location key remain environment secrets, not editable there.

## Changing Provider

1. Implement `WeatherProvider` (`getCurrentWeather`, `getForecast`) against the new API in
   `lib/weather/<provider>-provider.ts`.
2. Write a mapper from that API's response into `WeatherCurrent`/`WeatherForecast`.
3. Swap the `new AccuWeatherProvider(...)` call in `lib/weather/service.ts#getProvider()`.
4. Update the attribution component and `.env.example`.

## Testing

Weather logic is written to be mockable at the `WeatherProvider` boundary — tests should construct a
fake provider implementing the interface rather than hitting the live API. Cases worth covering:
success, missing API key, timeout, non-200 response, and a response missing optional fields (the UI
must degrade field-by-field, e.g. omit "UV Index" rather than crash, since every value in
`WeatherCurrent` beyond `temperatureC`/`condition`/`observedAt` is optional).
