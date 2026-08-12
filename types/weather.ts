export interface WeatherCurrent {
  temperatureC: number;
  feelsLikeC?: number;
  condition: string;
  icon?: string;
  isDayTime?: boolean;
  humidity?: number;
  windSpeedKmh?: number;
  windDirection?: string;
  precipitationProbability?: number;
  uvIndex?: number;
  visibilityKm?: number;
  pressureMb?: number;
  todayHighC?: number;
  todayLowC?: number;
  observedAt: string;
}

export interface WeatherDayForecast {
  date: string;
  dayLabel: string;
  icon?: string;
  condition: string;
  highC: number;
  lowC: number;
  precipitationProbability?: number;
}

export interface WeatherDayPart {
  period: "Morning" | "Afternoon" | "Evening" | "Overnight";
  temperatureC?: number;
  condition: string;
  precipitationProbability?: number;
}

export interface WeatherForecast {
  days: WeatherDayForecast[];
  todayParts?: WeatherDayPart[];
  sunrise?: string;
  sunset?: string;
}

export interface WeatherProvider {
  getCurrentWeather(): Promise<WeatherCurrent>;
  getForecast(): Promise<WeatherForecast>;
}

export class WeatherUnavailableError extends Error {
  constructor(message = "Weather data is currently unavailable.") {
    super(message);
    this.name = "WeatherUnavailableError";
  }
}
