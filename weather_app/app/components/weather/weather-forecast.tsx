
'use client';

import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, CloudRain, Wind } from 'lucide-react';
import { WeatherData, WEATHER_CODES } from '@/lib/types';
import { WeatherAPI } from '@/lib/weather-api';
import { WeatherIcon } from './weather-icon';

interface WeatherForecastProps {
  data: WeatherData;
}

export function WeatherForecast({ data }: WeatherForecastProps) {
  const daily = data?.daily;
  
  if (!daily) return null;

  const forecastDays = daily.time?.slice(0, 7) ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-700/50"
    >
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <CloudRain className="w-6 h-6 text-blue-400" />
        7-Day Forecast
      </h3>

      <div className="space-y-3">
        {forecastDays.map((date, index) => {
          const weatherCode = daily.weather_code?.[index] ?? 0;
          const maxTemp = daily.temperature_2m_max?.[index];
          const minTemp = daily.temperature_2m_min?.[index];
          const precipitation = daily.precipitation_sum?.[index];
          const windSpeed = daily.wind_speed_10m_max?.[index];
          const windDirection = daily.wind_direction_10m_dominant?.[index];
          
          const weatherInfo = WEATHER_CODES[weatherCode] ?? WEATHER_CODES[0];
          const dateObj = new Date(date);
          const isToday = index === 0;
          const dayName = isToday 
            ? 'Today' 
            : dateObj.toLocaleDateString('en-US', { weekday: 'short' });

          return (
            <motion.div
              key={date}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 hover:bg-gray-700/50 ${
                isToday 
                  ? 'bg-blue-900/30 border border-blue-600/30' 
                  : 'bg-gray-800/50 border border-gray-700/30'
              }`}
            >
              {/* Day and Weather */}
              <div className="flex items-center gap-4 flex-1">
                <div className="text-white font-medium w-20">
                  {dayName}
                </div>
                <div className="flex items-center gap-3">
                  <WeatherIcon 
                    weatherCode={weatherCode} 
                    className="w-8 h-8 text-blue-400"
                  />
                  <div>
                    <div className="text-white text-sm font-medium">
                      {weatherInfo.description}
                    </div>
                    {precipitation > 0 && (
                      <div className="text-blue-400 text-xs">
                        {Math.round(precipitation)} mm
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Wind */}
              <div className="flex items-center gap-2 min-w-0 mx-4">
                <Wind className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-sm">
                  {WeatherAPI.formatWindSpeed(windSpeed)} {WeatherAPI.formatWindDirection(windDirection)}
                </span>
              </div>

              {/* Temperature */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-red-400">
                  <ArrowUp className="w-4 h-4" />
                  <span className="font-semibold">
                    {WeatherAPI.formatTemperature(maxTemp)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-blue-400">
                  <ArrowDown className="w-4 h-4" />
                  <span className="font-semibold">
                    {WeatherAPI.formatTemperature(minTemp)}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
