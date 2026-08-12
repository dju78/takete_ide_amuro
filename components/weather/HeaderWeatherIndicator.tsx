import Link from "next/link";
import { getCurrentWeather } from "@/lib/weather/service";

/** Only renders once real data is available — per spec, never shown when the API can't retrieve current conditions. */
export async function HeaderWeatherIndicator() {
  const current = await getCurrentWeather();
  if (!current) return null;

  return (
    <Link
      href="/weather"
      className="hidden items-center gap-1.5 rounded-full border border-purple-600/15 bg-purple-50 px-3 py-1.5 text-sm font-medium text-purple-600 transition-colors hover:bg-purple-100 min-[1320px]:inline-flex"
    >
      <span aria-hidden="true">🌦️</span>
      Takete-Ide · {current.temperatureC}°C
      <span className="sr-only">, {current.condition}. View full forecast.</span>
    </Link>
  );
}
