
// Weather API Types
export interface WeatherData {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    weather_code: number;
    surface_pressure: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
    visibility: number;
    uv_index: number;
  };
  current_units: {
    temperature_2m: string;
    relative_humidity_2m: string;
    apparent_temperature: string;
    precipitation: string;
    surface_pressure: string;
    wind_speed_10m: string;
    wind_direction_10m: string;
    wind_gusts_10m: string;
    visibility: string;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
    precipitation_sum: number[];
    wind_speed_10m_max: number[];
    wind_direction_10m_dominant: number[];
    uv_index_max: number[];
  };
  daily_units: {
    temperature_2m_max: string;
    temperature_2m_min: string;
    precipitation_sum: string;
    wind_speed_10m_max: string;
    wind_direction_10m_dominant: string;
  };
  hourly?: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    precipitation: number[];
    weather_code: number[];
    wind_speed_10m: number[];
  };
}

export interface HistoricalWeatherData {
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    precipitation: number[];
    weather_code: number[];
    wind_speed_10m: number[];
    surface_pressure: number[];
  };
  hourly_units: {
    temperature_2m: string;
    relative_humidity_2m: string;
    precipitation: string;
    wind_speed_10m: string;
    surface_pressure: string;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    weather_code: number[];
  };
  daily_units: {
    temperature_2m_max: string;
    temperature_2m_min: string;
    precipitation_sum: string;
  };
}

export interface LocationData {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code: string;
  admin1?: string;
  admin2?: string;
  admin3?: string;
  admin4?: string;
  timezone?: string;
  population?: number;
  country_id: number;
  country: string;
  admin1_id?: number;
}

export interface City {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

// Weather condition codes mapping
export const WEATHER_CODES: Record<number, { description: string; icon: string }> = {
  0: { description: 'Clear sky', icon: 'sun' },
  1: { description: 'Mainly clear', icon: 'sun' },
  2: { description: 'Partly cloudy', icon: 'cloud-sun' },
  3: { description: 'Overcast', icon: 'cloud' },
  45: { description: 'Fog', icon: 'cloud-fog' },
  48: { description: 'Depositing rime fog', icon: 'cloud-fog' },
  51: { description: 'Drizzle: Light', icon: 'cloud-drizzle' },
  53: { description: 'Drizzle: Moderate', icon: 'cloud-drizzle' },
  55: { description: 'Drizzle: Dense', icon: 'cloud-drizzle' },
  56: { description: 'Freezing Drizzle: Light', icon: 'cloud-snow' },
  57: { description: 'Freezing Drizzle: Dense', icon: 'cloud-snow' },
  61: { description: 'Rain: Slight', icon: 'cloud-rain' },
  63: { description: 'Rain: Moderate', icon: 'cloud-rain' },
  65: { description: 'Rain: Heavy', icon: 'cloud-rain' },
  66: { description: 'Freezing Rain: Light', icon: 'cloud-snow' },
  67: { description: 'Freezing Rain: Heavy', icon: 'cloud-snow' },
  71: { description: 'Snow fall: Slight', icon: 'snowflake' },
  73: { description: 'Snow fall: Moderate', icon: 'snowflake' },
  75: { description: 'Snow fall: Heavy', icon: 'snowflake' },
  77: { description: 'Snow grains', icon: 'snowflake' },
  80: { description: 'Rain showers: Slight', icon: 'cloud-rain' },
  81: { description: 'Rain showers: Moderate', icon: 'cloud-rain' },
  82: { description: 'Rain showers: Violent', icon: 'cloud-rain' },
  85: { description: 'Snow showers: Slight', icon: 'cloud-snow' },
  86: { description: 'Snow showers: Heavy', icon: 'cloud-snow' },
  95: { description: 'Thunderstorm: Slight or moderate', icon: 'zap' },
  96: { description: 'Thunderstorm with slight hail', icon: 'zap' },
  99: { description: 'Thunderstorm with heavy hail', icon: 'zap' },
};

// Historical period types
export type HistoricalPeriod = '7days' | '1month' | '3months' | '1year';

export interface HistoricalPeriodConfig {
  label: string;
  days: number;
  description: string;
}

export const HISTORICAL_PERIODS: Record<HistoricalPeriod, HistoricalPeriodConfig> = {
  '7days': {
    label: 'Past 7 Days',
    days: 7,
    description: 'Last week weather data'
  },
  '1month': {
    label: 'Past Month',
    days: 30,
    description: 'Last 30 days weather data'
  },
  '3months': {
    label: 'Past 3 Months',
    days: 90,
    description: 'Last 90 days weather data'
  },
  '1year': {
    label: 'Past Year',
    days: 365,
    description: 'Last 365 days weather data'
  }
};
