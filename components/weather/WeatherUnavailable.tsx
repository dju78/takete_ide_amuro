import { CloudOff } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { env } from "@/lib/env";

export function WeatherUnavailable({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 rounded-2xl bg-purple-700 text-center text-white ${compact ? "p-6" : "p-12"}`}
    >
      <CloudOff className="h-8 w-8 text-white/60" aria-hidden="true" />
      <div>
        <p className="font-serif text-lg font-semibold">Weather temporarily unavailable</p>
        <p className="mt-1 text-sm text-white/70">
          Live conditions for Takete-Ide will return shortly.
        </p>
      </div>
      <ButtonLink href={env.accuweatherForecastUrl} target="_blank" rel="noopener noreferrer" variant="primary" size="sm">
        View the latest forecast on AccuWeather
      </ButtonLink>
    </div>
  );
}
