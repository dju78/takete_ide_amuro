import { Droplets, Wind, Sun } from "lucide-react";
import { getCurrentWeather, getForecast } from "@/lib/weather/service";
import { accuweatherIconUrl, weatherBackgroundMood, weatherMoodClasses } from "@/lib/weather/icon";
import { WeatherUnavailable } from "@/components/weather/WeatherUnavailable";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";

export async function WeatherHomeSection() {
  const [current, forecast] = await Promise.all([getCurrentWeather(), getForecast()]);
  const today = forecast?.days?.[0];

  return (
    <section className="bg-ivory-100 py-20">
      <Container>
        <SectionHeading
          eyebrow="Local Conditions"
          title="Weather in Takete-Ide"
          description="Current conditions and the outlook for our community."
        />
        <div className="mx-auto mt-10 max-w-xl">
          {current ? (
            <WeatherCard current={current} highC={today?.highC} lowC={today?.lowC} precipitation={today?.precipitationProbability} />
          ) : (
            <WeatherUnavailable />
          )}
        </div>
      </Container>
    </section>
  );
}

export function WeatherCard({
  current,
  highC,
  lowC,
  precipitation,
}: {
  current: NonNullable<Awaited<ReturnType<typeof getCurrentWeather>>>;
  highC?: number;
  lowC?: number;
  precipitation?: number;
}) {
  const mood = weatherBackgroundMood(current.icon, current.isDayTime);
  const iconUrl = accuweatherIconUrl(current.icon);

  return (
    <div className={`overflow-hidden rounded-3xl text-white shadow-xl ${weatherMoodClasses[mood]}`}>
      <div className="flex items-center justify-between px-6 pt-6 text-sm text-white/80">
        <span className="font-semibold uppercase tracking-wide">Weather in Takete-Ide</span>
        <span>Updated {new Date(current.observedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>
      </div>

      <div className="flex flex-col items-center px-6 py-6 text-center">
        {iconUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={iconUrl} alt="" aria-hidden="true" className="h-16 w-16" />
        )}
        <p className="mt-2 text-5xl font-bold">{current.temperatureC}°C</p>
        <p className="text-lg text-white/90">{current.condition}</p>
        {current.feelsLikeC !== undefined && (
          <p className="mt-1 text-sm text-white/70">Feels like {current.feelsLikeC}°C</p>
        )}
        {(highC !== undefined || lowC !== undefined) && (
          <div className="mt-4 flex gap-8 text-sm">
            {highC !== undefined && <span>High {highC}°C</span>}
            {lowC !== undefined && <span>Low {lowC}°C</span>}
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2 border-t border-white/15 px-4 py-4 text-center text-xs">
        <Metric icon={Droplets} label="Rain" value={precipitation !== undefined ? `${precipitation}%` : "—"} />
        <Metric icon={Droplets} label="Humidity" value={current.humidity !== undefined ? `${current.humidity}%` : "—"} />
        <Metric icon={Wind} label="Wind" value={current.windSpeedKmh !== undefined ? `${current.windSpeedKmh} km/h` : "—"} />
        <Metric icon={Sun} label="UV" value={current.uvIndex !== undefined ? String(current.uvIndex) : "—"} />
      </div>

      <div className="border-t border-white/15 px-6 py-4 text-center">
        <ButtonLink href="/weather" variant="primary" size="sm" className="w-full justify-center sm:w-auto">
          View Full Forecast
        </ButtonLink>
      </div>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <Icon className="h-4 w-4 text-white/70" aria-hidden="true" />
      <span className="font-semibold">{value}</span>
      <span className="text-white/60">{label}</span>
    </div>
  );
}
