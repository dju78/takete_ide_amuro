import { CloudSun } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { env } from "@/lib/env";

export function WeatherUnavailable({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 rounded-2xl bg-purple-700 text-center text-white ${compact ? "p-6" : "p-12"}`}
    >
      <CloudSun className="h-8 w-8 text-gold-300" aria-hidden="true" />
      <div>
        <p className="font-serif text-lg font-semibold">Takete-Ide Weather Forecast</p>
        <p className="mt-1 text-sm text-white/80">
          Current conditions and the multi-day local forecast for Takete-Ide are available directly on AccuWeather.
        </p>
      </div>
      <ButtonLink href={env.accuweatherForecastUrl} target="_blank" rel="noopener noreferrer" variant="primary" size="sm">
        View Forecast on AccuWeather →
      </ButtonLink>
    </div>
  );
}
