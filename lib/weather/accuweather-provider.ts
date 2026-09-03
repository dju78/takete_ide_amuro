import type { WeatherProvider, WeatherCurrent, WeatherForecast } from "@/types/weather";
import { WeatherUnavailableError } from "@/types/weather";
import { mapCurrentConditions, mapForecast } from "@/lib/weather/mapper";

const BASE_URL = "https://dataservice.accuweather.com";
const REVALIDATE_SECONDS = 1800; // 30 minutes — current conditions don't need per-request calls.
const TIMEOUT_MS = 3000;

async function fetchWithTimeout(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal, next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) {
      throw new WeatherUnavailableError(`AccuWeather request failed with status ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    if (error instanceof WeatherUnavailableError) throw error;
    console.error("[weather] AccuWeather request error", error);
    throw new WeatherUnavailableError();
  } finally {
    clearTimeout(timeout);
  }
}

export class AccuWeatherProvider implements WeatherProvider {
  constructor(
    private apiKey: string,
    private locationKey: string,
  ) {}

  async getCurrentWeather(): Promise<WeatherCurrent> {
    const url = `${BASE_URL}/currentconditions/v1/${this.locationKey}?apikey=${this.apiKey}&details=true`;
    const raw = await fetchWithTimeout(url);
    return mapCurrentConditions(raw);
  }

  async getForecast(): Promise<WeatherForecast> {
    const url = `${BASE_URL}/forecasts/v1/daily/5day/${this.locationKey}?apikey=${this.apiKey}&details=true&metric=true`;
    const raw = await fetchWithTimeout(url);
    return mapForecast(raw);
  }
}
