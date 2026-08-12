# ADDITION TO TAKETE-IDE WEBSITE — LOCAL WEATHER

Add a complete local weather feature for **Takete-Ide Amuro, Mopamuro LGA, Kogi State, Nigeria**.

The official weather reference supplied by the project owner is:

`https://www.accuweather.com/en/ng/takete-ide/923542/weather-forecast/923542`

The AccuWeather location identifier shown in this URL is:

`923542`

## IMPORTANT IMPLEMENTATION RULE

Do not scrape the AccuWeather webpage.

Use the official AccuWeather API where API credentials are available.

Keep all API credentials server-side and never expose an AccuWeather API key in browser/client JavaScript.

Add relevant variables to:

`.env.example`

For example:

```text
ACCUWEATHER_API_KEY=
ACCUWEATHER_LOCATION_KEY=923542
NEXT_PUBLIC_ACCUWEATHER_FORECAST_URL=https://www.accuweather.com/en/ng/takete-ide/923542/weather-forecast/923542
```

If the API key is not configured, the website must still build and run successfully.

Use a graceful fallback that displays:

**Takete-Ide Weather**

**Live weather data will be available shortly.**

and a button:

**View Forecast on AccuWeather**

linking to the supplied AccuWeather Takete-Ide forecast page.

Do not use fabricated weather data.

---

# WEATHER NAVIGATION

Add:

**Weather**

to the website navigation where appropriate.

Recommended navigation:

- Home
- Our Story
- Heritage
- Takete-Ide Day
- Development
- News
- Gallery
- Weather
- Diaspora
- More

The exact desktop organisation may use dropdown menus if required to avoid overcrowding.

Create:

`/weather`

---

# HOMEPAGE WEATHER COMPONENT

Add a premium weather section to the homepage.

Position it after:

**Welcome to Our Community**

or immediately before:

**Building the Future**

Choose whichever produces the strongest visual hierarchy.

The section should feel integrated into the Takete-Ide brand rather than looking like a third-party widget pasted onto the website.

Heading:

# Weather in Takete-Ide

Supporting text:

**Current conditions and the outlook for our community.**

Create a responsive weather card.

Display, where provided by the API:

- current temperature
- RealFeel/apparent temperature
- weather condition
- weather icon
- today's high
- today's low
- chance of rain
- humidity
- wind speed
- wind direction
- UV index
- visibility
- pressure
- sunrise
- sunset
- last updated time

Do not display fields that are unavailable.

Use Celsius as the default temperature presentation for the Takete-Ide site.

---

# VISUAL DESIGN

Match the existing Takete-Ide design system.

Use:

- Takete Purple
- Heritage Gold
- Community Green
- Warm Ivory

The weather card should use a sophisticated layout such as:

```text
--------------------------------------------------
 WEATHER IN TAKETE-IDE                  Updated...
--------------------------------------------------

      WEATHER ICON

          29°C
       Light Rain

     Feels like 31°C

 High 30°C                     Low 23°C

--------------------------------------------------
 Rain        Humidity        Wind         UV
 58%           81%          9 km/h         4
--------------------------------------------------

      View Full Forecast →
--------------------------------------------------
```

Treat the above only as a layout example.

Never hard-code those example weather values.

All weather figures must come from the configured weather provider.

---

# WEATHER BACKGROUND STATES

Create tasteful visual variations based on conditions.

Examples:

### Clear / Sunny
Warm daylight treatment.

### Cloudy
Soft neutral/cloud treatment.

### Rain
Subtle rain/cloud visual treatment.

### Thunderstorm
Deeper atmospheric treatment.

### Night
Dark-purple night treatment.

Do not use distracting animations.

Do not sacrifice text contrast.

Respect `prefers-reduced-motion`.

---

# FULL WEATHER PAGE

Create:

`/weather`

Page title:

# Takete-Ide Weather

Subtitle:

**Local weather conditions and forecasts for Takete-Ide Amuro, Kogi State.**

Build the page with the following sections.

---

## 1. CURRENT CONDITIONS

Large weather summary card containing:

- weather icon
- temperature
- weather phrase
- RealFeel/apparent temperature
- high
- low
- precipitation probability
- humidity
- wind
- visibility
- pressure
- UV index

Where supported.

---

## 2. TODAY'S FORECAST

Show periods such as:

- Morning
- Afternoon
- Evening
- Overnight

if appropriate data is available from the configured API.

Display:

- temperature
- condition
- rain probability

---

## 3. FIVE-DAY FORECAST

Create responsive forecast cards.

For each day display:

- day
- date
- weather icon
- condition
- maximum temperature
- minimum temperature
- precipitation probability

Example structure:

```text
MON
🌦
29°
22°
Rain 60%
```

Never use fabricated values.

---

# 4. WEATHER DETAILS

Create a clean grid containing any available values for:

- Humidity
- Wind
- Wind Gusts
- Pressure
- Visibility
- Cloud Cover
- UV Index
- Dew Point

---

# 5. SUNRISE & SUNSET

Where data is available, display:

**Sunrise**

and

**Sunset**

Use subtle sunrise/sunset visual indicators.

---

# 6. RAIN OUTLOOK

Rain is particularly useful information for the community.

Where forecast data permits, create:

# Rain Outlook

Show:

- probability of precipitation
- expected rain periods
- thunderstorm probability where available

Do not exaggerate severe-weather risk.

---

# 7. COMMUNITY CONTEXT

Include a small informational block:

# Planning Your Day in Takete-Ide

Use weather data to provide only neutral practical context.

Examples:

When rain probability is high:

**Rain is possible today. Consider checking conditions before travelling or planning outdoor activities.**

When conditions are hot:

**Warm conditions are expected today. Plan outdoor activities appropriately.**

Do not generate medical recommendations.

Do not present automated weather interpretation as an official emergency warning.

---

# 8. FARMING / AGRICULTURAL CONTEXT

Because Takete-Ide has a strong agrarian heritage, create the architecture for a future:

**Farming Weather**

feature.

For the initial version, this can show relevant weather information such as:

- rainfall
- temperature
- humidity
- forecast conditions

Do not provide agricultural prescriptions or claim crop-specific advice unless reliable agricultural data is later integrated.

The design should allow this feature to expand later.

---

# 9. TAKETE-IDE DAY WEATHER

Build a reusable event-weather component.

For Takete-Ide Day and other community events, when the event date falls within the available forecast window, allow the event page to display:

**Weather for Takete-Ide Day**

with:

- expected conditions
- high/low
- rain probability
- link to full weather page

If the event is outside the forecast range, display:

**A weather forecast will appear closer to the event date.**

Never fabricate long-range forecasts.

---

# 10. WEATHER ON MOBILE

The homepage weather card must work especially well on mobile devices.

Prioritise:

1. Current temperature
2. Current condition
3. Rain probability
4. High/low
5. Link to detailed forecast

Additional metrics may collapse into a secondary details panel.

---

# 11. HEADER WEATHER INDICATOR

When current weather data is successfully available, optionally display a compact indicator in the desktop header such as:

**Takete-Ide · 29°C 🌦**

Clicking it should open:

`/weather`

Do not show this header indicator when the API cannot retrieve current data.

---

# 12. API ARCHITECTURE

Create a dedicated weather service.

Example structure:

```text
lib/
  weather/
    accuweather.ts
    types.ts
    mapper.ts

app/
  weather/
    page.tsx

app/
  api/
    weather/
      current/
      forecast/
```

Use whatever structure best matches the final architecture.

The UI should not depend directly on AccuWeather's raw response format.

Create an internal weather model.

Example:

```typescript
interface WeatherCurrent {
  temperature: number;
  feelsLike?: number;
  condition: string;
  icon?: string;
  humidity?: number;
  windSpeed?: number;
  windDirection?: string;
  precipitationProbability?: number;
  uvIndex?: number;
  visibility?: number;
  pressure?: number;
  observedAt: string;
}
```

Create corresponding forecast types.

---

# 13. SERVER-SIDE FETCHING

Fetch AccuWeather data server-side.

Do not expose API credentials.

Implement:

- caching
- sensible revalidation
- error handling
- request timeout
- safe fallback

Weather does not need to trigger an API call on every page request.

Use an appropriate cache/revalidation interval.

For example, current conditions can refresh periodically rather than on every visitor request.

---

# 14. PROVIDER ABSTRACTION

Do not tightly couple the entire application to AccuWeather.

Create a provider abstraction such as:

```typescript
interface WeatherProvider {
  getCurrentWeather(): Promise<WeatherCurrent>;
  getForecast(): Promise<WeatherForecast[]>;
}
```

Implement:

`AccuWeatherProvider`

first.

This should make it possible to migrate to another weather provider later without rebuilding the user interface.

---

# 15. ACCUWEATHER ATTRIBUTION

When displaying AccuWeather data, provide the attribution and branding required by the current AccuWeather API licence.

Include an appropriate visible attribution such as:

**Weather data provided by AccuWeather**

with the required branding/logo implementation where required by the licence.

Also provide:

**View full forecast on AccuWeather**

linking to:

`https://www.accuweather.com/en/ng/takete-ide/923542/weather-forecast/923542`

Do not remove required attribution.

Do not imitate or misuse AccuWeather trademarks.

---

# 16. ERROR HANDLING

If the weather API fails:

Do not break the homepage.

Do not display fake previous values as live conditions without indicating their status.

Show a graceful component such as:

**Weather temporarily unavailable**

**View the latest Takete-Ide forecast on AccuWeather**

with the external link.

Record technical errors server-side.

---

# 17. ACCESSIBILITY

Weather icons cannot be the only indication of conditions.

For example:

Do not show only:

🌧

Show:

**Rain**

alongside the visual icon.

Ensure:

- accessible labels
- keyboard access
- sufficient contrast
- screen-reader-friendly values

---

# 18. SEO

Create metadata for `/weather`.

Suggested title architecture:

**Takete-Ide Weather | Takete-Ide Amuro, Kogi State**

Suggested description:

**View current conditions and weather forecasts for Takete-Ide Amuro in Mopamuro Local Government Area, Kogi State, Nigeria.**

Do not keyword-stuff.

---

# 19. HOMEPAGE WEATHER CTA

The homepage weather card should end with:

**View Full Forecast**

linking internally to:

`/weather`

The `/weather` page can then provide the external AccuWeather link.

This keeps visitors within the Takete-Ide website first.

---

# 20. ADMIN WEATHER SETTINGS

Add a weather section under:

`Admin → Website Settings → Weather`

Allow authorised administrators to manage:

- Enable weather section
- Location label
- AccuWeather location key
- External forecast URL
- Homepage weather visibility
- Header weather visibility

Do not allow ordinary editors to see or edit secret API credentials.

The API key must remain an environment secret.

---

# 21. DOCUMENTATION

Update:

`README.md`

and:

`docs/ARCHITECTURE.md`

with weather integration instructions.

Create:

`docs/WEATHER_INTEGRATION.md`

Document:

- weather provider
- Takete-Ide location key
- environment variables
- API implementation
- caching
- attribution
- fallback behaviour
- troubleshooting
- changing weather provider

---

# 22. TESTING

Test:

- current-weather success
- forecast success
- missing API key
- API timeout
- API failure
- incomplete provider response
- mobile weather component
- Celsius formatting
- weather page
- AccuWeather external link
- accessibility
- homepage fallback

Mock external weather API calls during automated tests.

Do not rely on live API calls for the main test suite.

---

# 23. FINAL REQUIREMENT

Weather must become a genuine functional part of the Takete-Ide website rather than simply placing an external link in the footer.

The finished experience should allow someone visiting the Takete-Ide website to immediately understand:

**What is the weather like in Takete-Ide now?**

**What is today's outlook?**

**Is rain expected?**

**What are the next few days likely to look like?**

while still providing access to the complete forecast on AccuWeather.

Build this feature as part of the main Takete-Ide website without asking the project owner additional questions.