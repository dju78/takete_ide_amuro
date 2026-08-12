import Link from "next/link";
import { env } from "@/lib/env";

export function AccuWeatherAttribution() {
  return (
    <div className="flex flex-col items-center gap-2 border-t border-charcoal/10 pt-6 text-center text-sm text-charcoal/60">
      <p>Weather data provided by AccuWeather.</p>
      <Link
        href={env.accuweatherForecastUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-purple-600 underline underline-offset-2 hover:text-purple-400"
      >
        View full forecast on AccuWeather →
      </Link>
    </div>
  );
}
