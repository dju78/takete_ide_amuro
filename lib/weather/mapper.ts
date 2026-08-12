import type { WeatherCurrent, WeatherDayForecast, WeatherForecast } from "@/types/weather";

const fahrenheitToCelsius = (f: number) => Math.round(((f - 32) * 5) / 9);

const kmh = (value: number, unit: string) => (unit.toLowerCase().startsWith("mi") ? Math.round(value * 1.60934) : Math.round(value));

const km = (value: number, unit: string) => (unit.toLowerCase().startsWith("mi") ? Math.round(value * 1.60934) : Math.round(value));

/** AccuWeather "Current Conditions" endpoint returns an array with one element. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapCurrentConditions(raw: any): WeatherCurrent {
  const c = Array.isArray(raw) ? raw[0] : raw;
  const tempMetric = c?.Temperature?.Metric?.Value;
  const tempImperial = c?.Temperature?.Imperial?.Value;
  const temperatureC = typeof tempMetric === "number" ? Math.round(tempMetric) : fahrenheitToCelsius(tempImperial);

  const feelsMetric = c?.RealFeelTemperature?.Metric?.Value;
  const feelsImperial = c?.RealFeelTemperature?.Imperial?.Value;
  const feelsLikeC =
    typeof feelsMetric === "number"
      ? Math.round(feelsMetric)
      : typeof feelsImperial === "number"
        ? fahrenheitToCelsius(feelsImperial)
        : undefined;

  return {
    temperatureC,
    feelsLikeC,
    condition: c?.WeatherText ?? "Unknown",
    icon: c?.WeatherIcon ? String(c.WeatherIcon).padStart(2, "0") : undefined,
    isDayTime: c?.IsDayTime,
    humidity: c?.RelativeHumidity,
    windSpeedKmh: c?.Wind?.Speed?.Metric?.Value
      ? kmh(c.Wind.Speed.Metric.Value, c.Wind.Speed.Metric.Unit ?? "km/h")
      : undefined,
    windDirection: c?.Wind?.Direction?.Localized,
    uvIndex: c?.UVIndex,
    visibilityKm: c?.Visibility?.Metric?.Value ? km(c.Visibility.Metric.Value, "km") : undefined,
    pressureMb: c?.Pressure?.Metric?.Value ? Math.round(c.Pressure.Metric.Value) : undefined,
    precipitationProbability: c?.PrecipitationProbability,
    observedAt: c?.LocalObservationDateTime ?? new Date().toISOString(),
  };
}

const dayLabelFor = (iso: string, index: number) => {
  if (index === 0) return "Today";
  return new Date(iso).toLocaleDateString("en-GB", { weekday: "short" }).toUpperCase();
};

/** AccuWeather "5 Day of Daily Forecasts" endpoint. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapForecast(raw: any): WeatherForecast {
  const days: WeatherDayForecast[] = (raw?.DailyForecasts ?? []).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (d: any, index: number): WeatherDayForecast => ({
      date: d.Date,
      dayLabel: dayLabelFor(d.Date, index),
      icon: d.Day?.Icon ? String(d.Day.Icon).padStart(2, "0") : undefined,
      condition: d.Day?.IconPhrase ?? "Unknown",
      // Fetched with metric=true, so these are already Celsius.
      highC: Math.round(d.Temperature?.Maximum?.Value),
      lowC: Math.round(d.Temperature?.Minimum?.Value),
      precipitationProbability: d.Day?.PrecipitationProbability,
    }),
  );

  const today = raw?.DailyForecasts?.[0];
  const todayParts = today
    ? [
        {
          period: "Morning" as const,
          condition: today.Day?.IconPhrase ?? "—",
          precipitationProbability: today.Day?.PrecipitationProbability,
        },
        {
          period: "Afternoon" as const,
          condition: today.Day?.IconPhrase ?? "—",
          precipitationProbability: today.Day?.PrecipitationProbability,
        },
        {
          period: "Evening" as const,
          condition: today.Night?.IconPhrase ?? "—",
          precipitationProbability: today.Night?.PrecipitationProbability,
        },
        {
          period: "Overnight" as const,
          condition: today.Night?.IconPhrase ?? "—",
          precipitationProbability: today.Night?.PrecipitationProbability,
        },
      ]
    : undefined;

  return {
    days,
    todayParts,
    sunrise: today?.Sun?.Rise,
    sunset: today?.Sun?.Set,
  };
}
