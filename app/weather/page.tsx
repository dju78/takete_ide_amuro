import type { Metadata } from "next";
import { Sunrise, Sunset, Droplets, Wind, Gauge, Eye, CloudRain, Sprout } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getCurrentWeather, getForecast } from "@/lib/weather/service";
import { accuweatherIconUrl } from "@/lib/weather/icon";
import { WeatherCard } from "@/components/weather/WeatherCard";
import { WeatherUnavailable } from "@/components/weather/WeatherUnavailable";
import { AccuWeatherAttribution } from "@/components/weather/AccuWeatherAttribution";

export const metadata: Metadata = {
  title: "Takete-Ide Weather",
  description:
    "View current conditions and weather forecasts for Takete-Ide Amuro in Mopamuro Local Government Area, Kogi State, Nigeria.",
};

export const revalidate = 1800;

export default async function WeatherPage() {
  const [current, forecast] = await Promise.all([getCurrentWeather(), getForecast()]);
  const today = forecast?.days?.[0];

  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "Weather" }]} />
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Takete-Ide Weather</h1>
          <p className="mt-3 max-w-2xl text-white/80">
            Local weather conditions and forecasts for Takete-Ide, Amuro, Kogi State, Nigeria.
          </p>
        </Container>
      </div>

      <Container className="grid gap-12 py-16 lg:grid-cols-[1fr_1.3fr]">
        <div>
          {current ? (
            <WeatherCard current={current} highC={today?.highC} lowC={today?.lowC} precipitation={today?.precipitationProbability} />
          ) : (
            <WeatherUnavailable />
          )}

          {current && (
            <div className="mt-6 grid grid-cols-2 gap-4">
              <DetailTile icon={Droplets} label="Humidity" value={current.humidity !== undefined ? `${current.humidity}%` : undefined} />
              <DetailTile icon={Wind} label="Wind" value={current.windSpeedKmh !== undefined ? `${current.windSpeedKmh} km/h ${current.windDirection ?? ""}`.trim() : undefined} />
              <DetailTile icon={Gauge} label="Pressure" value={current.pressureMb !== undefined ? `${current.pressureMb} mb` : undefined} />
              <DetailTile icon={Eye} label="Visibility" value={current.visibilityKm !== undefined ? `${current.visibilityKm} km` : undefined} />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-12">
          {forecast?.todayParts && (
            <section>
              <h2 className="font-serif text-2xl font-bold text-purple-600">Today&rsquo;s Forecast</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {forecast.todayParts.map((part) => (
                  <div key={part.period} className="rounded-xl border border-purple-600/10 bg-white p-4 text-center">
                    <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/50">{part.period}</p>
                    <p className="mt-2 text-sm font-medium text-charcoal">{part.condition}</p>
                    {part.precipitationProbability !== undefined && (
                      <p className="mt-1 text-xs text-purple-600">Rain {part.precipitationProbability}%</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {forecast?.days && forecast.days.length > 0 && (
            <section>
              <h2 className="font-serif text-2xl font-bold text-purple-600">Five-Day Forecast</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
                {forecast.days.map((day) => (
                  <div key={day.date} className="rounded-xl border border-purple-600/10 bg-white p-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-wide text-purple-600">{day.dayLabel}</p>
                    {accuweatherIconUrl(day.icon) && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={accuweatherIconUrl(day.icon)} alt="" aria-hidden="true" className="mx-auto my-2 h-10 w-10" />
                    )}
                    <p className="text-xs text-charcoal/70">{day.condition}</p>
                    <p className="mt-1 text-sm font-semibold">
                      {day.highC}° <span className="font-normal text-charcoal/50">{day.lowC}°</span>
                    </p>
                    {day.precipitationProbability !== undefined && (
                      <p className="mt-1 text-xs text-purple-600">Rain {day.precipitationProbability}%</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {(forecast?.sunrise || forecast?.sunset) && (
            <section className="grid grid-cols-2 gap-4">
              <DetailTile icon={Sunrise} label="Sunrise" value={forecast.sunrise ? formatTime(forecast.sunrise) : undefined} />
              <DetailTile icon={Sunset} label="Sunset" value={forecast.sunset ? formatTime(forecast.sunset) : undefined} />
            </section>
          )}

          {today?.precipitationProbability !== undefined && (
            <section className="rounded-2xl border border-purple-600/10 bg-white p-6">
              <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-purple-600">
                <CloudRain className="h-5 w-5" aria-hidden="true" />
                Rain Outlook
              </h2>
              <p className="mt-2 text-sm text-charcoal/80">
                There is a {today.precipitationProbability}% chance of precipitation today in Takete-Ide.
                {today.precipitationProbability >= 60 && " Rain is likely for at least part of the day."}
              </p>
            </section>
          )}

          <section className="rounded-2xl bg-purple-50/70 p-6">
            <h2 className="font-serif text-xl font-bold text-purple-600">Planning Your Day in Takete-Ide</h2>
            <p className="mt-2 text-sm text-charcoal/80">{planningContext(current?.temperatureC, today?.precipitationProbability)}</p>
          </section>

          <section className="rounded-2xl border border-community-green/20 bg-green-600/5 p-6">
            <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-green-700">
              <Sprout className="h-5 w-5" aria-hidden="true" />
              Farming Weather
            </h2>
            <p className="mt-2 text-sm text-charcoal/80">
              Takete-Ide has a strong agrarian heritage. This section will grow into a dedicated farming
              weather view — rainfall, temperature and humidity relevant to planting and harvest — as
              agricultural data sources are integrated. For now, use the rainfall and temperature figures
              above to plan farm activity.
            </p>
          </section>
        </div>
      </Container>

      <Container className="pb-16">
        <AccuWeatherAttribution />
      </Container>
    </div>
  );
}

function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function planningContext(tempC?: number, rainChance?: number) {
  if (tempC === undefined) {
    return "Weather details will appear here once conditions are available.";
  }
  const notes: string[] = [];
  if (rainChance !== undefined && rainChance >= 50) {
    notes.push("Rain is possible today. Consider checking conditions before travelling or planning outdoor activities.");
  }
  if (tempC >= 32) {
    notes.push("Warm conditions are expected today. Plan outdoor activities appropriately.");
  }
  if (notes.length === 0) {
    notes.push("Conditions look settled today, but always check the latest update before travelling.");
  }
  return notes.join(" ");
}

function DetailTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string;
}) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 rounded-xl border border-purple-600/10 bg-white p-4">
      <Icon className="h-5 w-5 text-purple-600" aria-hidden="true" />
      <div>
        <p className="text-xs text-charcoal/50">{label}</p>
        <p className="text-sm font-semibold text-charcoal">{value}</p>
      </div>
    </div>
  );
}
