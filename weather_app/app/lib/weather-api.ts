
import { WeatherData, HistoricalWeatherData, LocationData } from './types';

const BASE_URL = 'https://api.open-meteo.com/v1';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1';

export class WeatherAPI {
  
  // Search for cities by name
  static async searchCities(query: string): Promise<LocationData[]> {
    if (!query?.trim()) return [];
    
    try {
      const response = await fetch(
        `${GEOCODING_URL}/search?name=${encodeURIComponent(query.trim())}&count=10&language=en&format=json`
      );
      
      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data?.results ?? [];
    } catch (error) {
      console.error('Error searching cities:', error);
      return [];
    }
  }

  // Get current weather and forecast
  static async getCurrentWeather(latitude: number, longitude: number): Promise<WeatherData | null> {
    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        current: [
          'temperature_2m',
          'relative_humidity_2m',
          'apparent_temperature',
          'precipitation',
          'weather_code',
          'surface_pressure',
          'wind_speed_10m',
          'wind_direction_10m',
          'wind_gusts_10m',
          'visibility',
          'uv_index'
        ].join(','),
        daily: [
          'temperature_2m_max',
          'temperature_2m_min',
          'weather_code',
          'precipitation_sum',
          'wind_speed_10m_max',
          'wind_direction_10m_dominant',
          'uv_index_max'
        ].join(','),
        hourly: [
          'temperature_2m',
          'relative_humidity_2m',
          'precipitation',
          'weather_code',
          'wind_speed_10m'
        ].join(','),
        timezone: 'auto',
        forecast_days: '7'
      });

      const response = await fetch(`${BASE_URL}/forecast?${params}`);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching current weather:', error);
      return null;
    }
  }

  // Get historical weather data
  static async getHistoricalWeather(
    latitude: number, 
    longitude: number, 
    startDate: string, 
    endDate: string
  ): Promise<HistoricalWeatherData | null> {
    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        start_date: startDate,
        end_date: endDate,
        hourly: [
          'temperature_2m',
          'relative_humidity_2m',
          'precipitation',
          'weather_code',
          'wind_speed_10m',
          'surface_pressure'
        ].join(','),
        daily: [
          'temperature_2m_max',
          'temperature_2m_min',
          'precipitation_sum',
          'weather_code'
        ].join(','),
        timezone: 'auto'
      });

      const response = await fetch(`${BASE_URL}/historical-weather?${params}`);
      
      if (!response.ok) {
        throw new Error(`Historical Weather API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching historical weather:', error);
      return null;
    }
  }

  // Helper to get date strings for historical data
  static getHistoricalDateRange(daysBack: number): { startDate: string; endDate: string } {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 1); // Yesterday (to avoid incomplete data)
    
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - daysBack);
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  }

  // Helper to format temperature
  static formatTemperature(temp: number, unit: string = '°C'): string {
    return `${Math.round(temp ?? 0)}${unit}`;
  }

  // Helper to format wind direction
  static formatWindDirection(degrees: number): string {
    if (degrees == null) return 'N/A';
    
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index] ?? 'N';
  }

  // Helper to format wind speed
  static formatWindSpeed(speed: number, unit: string = 'km/h'): string {
    return `${Math.round(speed ?? 0)} ${unit}`;
  }

  // Helper to format humidity
  static formatHumidity(humidity: number): string {
    return `${Math.round(humidity ?? 0)}%`;
  }

  // Helper to format pressure
  static formatPressure(pressure: number, unit: string = 'hPa'): string {
    return `${Math.round(pressure ?? 0)} ${unit}`;
  }

  // Helper to format visibility
  static formatVisibility(visibility: number, unit: string = 'km'): string {
    return `${Math.round(visibility ?? 0)} ${unit}`;
  }
}
