import { env, isWeatherConfigured } from "@/lib/env";
import { AccuWeatherProvider } from "@/lib/weather/accuweather-provider";
import type { WeatherCurrent, WeatherForecast, WeatherProvider } from "@/types/weather";

/**
 * Provider abstraction (spec: Weather addition §14). The rest of the app only
 * ever talks to WeatherProvider / the functions below — swapping AccuWeather
 * for another service later means writing one new class here.
 */
function getProvider(): WeatherProvider | null {
  if (!isWeatherConfigured) return null;
  return new AccuWeatherProvider(env.accuweatherApiKey!, env.accuweatherLocationKey);
}

export async function getCurrentWeather(): Promise<WeatherCurrent | null> {
  const provider = getProvider();
  if (!provider) return null;
  try {
    return await provider.getCurrentWeather();
  } catch (error) {
    console.error("[weather] getCurrentWeather failed", error);
    return null;
  }
}

export async function getForecast(): Promise<WeatherForecast | null> {
  const provider = getProvider();
  if (!provider) return null;
  try {
    return await provider.getForecast();
  } catch (error) {
    console.error("[weather] getForecast failed", error);
    return null;
  }
}
