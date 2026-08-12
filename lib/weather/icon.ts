/** AccuWeather's publicly documented icon CDN pattern — zero-padded 2-digit icon code. */
export function accuweatherIconUrl(icon?: string) {
  if (!icon) return undefined;
  return `https://developer.accuweather.com/sites/default/files/${icon}-s.png`;
}

const NIGHT_ICONS = new Set(["33", "34", "35", "36", "37", "38", "39", "40", "41", "42"]);
const STORM_ICONS = new Set(["15", "16", "17", "41", "42"]);
const RAIN_ICONS = new Set(["12", "13", "14", "18", "26", "39", "40"]);
const CLOUDY_ICONS = new Set(["6", "7", "8", "11", "36", "37", "38"]);

export type WeatherBackgroundMood = "clear" | "cloudy" | "rain" | "storm" | "night";

export function weatherBackgroundMood(icon?: string, isDayTime?: boolean): WeatherBackgroundMood {
  if (!icon) return isDayTime === false ? "night" : "clear";
  if (STORM_ICONS.has(icon)) return "storm";
  if (RAIN_ICONS.has(icon)) return "rain";
  if (isDayTime === false || NIGHT_ICONS.has(icon)) return "night";
  if (CLOUDY_ICONS.has(icon)) return "cloudy";
  return "clear";
}

export const weatherMoodClasses: Record<WeatherBackgroundMood, string> = {
  clear: "bg-gradient-to-br from-purple-600 via-purple-600 to-gold-700",
  cloudy: "bg-gradient-to-br from-purple-700 via-purple-600 to-purple-400",
  rain: "bg-gradient-to-br from-purple-900 via-purple-700 to-green-700",
  storm: "bg-gradient-to-br from-purple-900 via-charcoal to-purple-700",
  night: "bg-gradient-to-br from-purple-900 via-purple-700 to-purple-600",
};
