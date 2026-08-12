import Link from "next/link";
import { CloudSun } from "lucide-react";
import { getForecast } from "@/lib/weather/service";
import { accuweatherIconUrl } from "@/lib/weather/icon";

/** For Takete-Ide Day and other event pages. Only shows real forecast data within the provider's window. */
export async function EventWeather({ eventDateIso }: { eventDateIso: string | null }) {
  if (!eventDateIso) return null;

  const forecast = await getForecast();
  const day = forecast?.days.find((d) => d.date.slice(0, 10) === eventDateIso.slice(0, 10));

  return (
    <div className="rounded-2xl border border-purple-600/10 bg-purple-50/60 p-6">
      <h3 className="flex items-center gap-2 font-serif text-lg font-semibold text-purple-600">
        <CloudSun className="h-5 w-5" aria-hidden="true" />
        Weather for Takete-Ide Day
      </h3>
      {day ? (
        <div className="mt-3 flex items-center gap-4">
          {accuweatherIconUrl(day.icon) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={accuweatherIconUrl(day.icon)} alt="" aria-hidden="true" className="h-12 w-12" />
          )}
          <div className="text-sm text-charcoal/80">
            <p className="font-medium">{day.condition}</p>
            <p>
              High {day.highC}°C · Low {day.lowC}°C
              {day.precipitationProbability !== undefined && ` · Rain ${day.precipitationProbability}%`}
            </p>
          </div>
        </div>
      ) : (
        <p className="mt-2 text-sm text-charcoal/70">
          A weather forecast will appear closer to the event date.
        </p>
      )}
      <Link href="/weather" className="mt-3 inline-block text-sm font-semibold text-purple-600 hover:underline">
        View full Takete-Ide weather →
      </Link>
    </div>
  );
}
