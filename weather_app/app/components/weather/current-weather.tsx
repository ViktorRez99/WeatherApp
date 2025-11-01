
'use client';

import { motion } from 'framer-motion';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Gauge,
  Sun,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { WeatherData, WEATHER_CODES } from '@/lib/types';
import { WeatherAPI } from '@/lib/weather-api';
import { WeatherIcon } from './weather-icon';

interface CurrentWeatherProps {
  data: WeatherData;
  locationName: string;
}

export function CurrentWeather({ data, locationName }: CurrentWeatherProps) {
  const current = data?.current;
  const daily = data?.daily;
  
  if (!current) return null;

  const weatherInfo = WEATHER_CODES[current.weather_code] ?? WEATHER_CODES[0];
  const todayMax = daily?.temperature_2m_max?.[0];
  const todayMin = daily?.temperature_2m_min?.[0];

  const stats = [
    {
      icon: Thermometer,
      label: 'Feels like',
      value: WeatherAPI.formatTemperature(current.apparent_temperature),
      color: 'text-orange-400'
    },
    {
      icon: Droplets,
      label: 'Humidity',
      value: WeatherAPI.formatHumidity(current.relative_humidity_2m),
      color: 'text-blue-400'
    },
    {
      icon: Wind,
      label: 'Wind',
      value: `${WeatherAPI.formatWindSpeed(current.wind_speed_10m)} ${WeatherAPI.formatWindDirection(current.wind_direction_10m)}`,
      color: 'text-green-400'
    },
    {
      icon: Eye,
      label: 'Visibility',
      value: WeatherAPI.formatVisibility(current.visibility),
      color: 'text-purple-400'
    },
    {
      icon: Gauge,
      label: 'Pressure',
      value: WeatherAPI.formatPressure(current.surface_pressure),
      color: 'text-yellow-400'
    },
    {
      icon: Sun,
      label: 'UV Index',
      value: Math.round(current.uv_index ?? 0).toString(),
      color: 'text-red-400'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700/50"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">{locationName}</h2>
        <p className="text-gray-400">
          {new Date(current.time).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      {/* Main Weather Display */}
      <div className="flex items-center justify-center mb-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <WeatherIcon 
              weatherCode={current.weather_code} 
              className="w-24 h-24 text-blue-400"
            />
          </div>
          <div className="text-6xl font-bold text-white mb-2">
            {WeatherAPI.formatTemperature(current.temperature_2m)}
          </div>
          <div className="text-xl text-gray-300 mb-4">
            {weatherInfo.description}
          </div>
          
          {/* Min/Max Temperature */}
          {todayMax != null && todayMin != null && (
            <div className="flex items-center justify-center gap-6 text-lg">
              <div className="flex items-center gap-2 text-red-400">
                <ArrowUp className="w-4 h-4" />
                <span>{WeatherAPI.formatTemperature(todayMax)}</span>
              </div>
              <div className="flex items-center gap-2 text-blue-400">
                <ArrowDown className="w-4 h-4" />
                <span>{WeatherAPI.formatTemperature(todayMin)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Weather Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 hover:bg-gray-700/50 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <div>
                <div className="text-sm text-gray-400">{stat.label}</div>
                <div className="text-white font-semibold">{stat.value}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Additional Info */}
      {current.wind_gusts_10m > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-4 p-4 bg-yellow-900/30 border border-yellow-600/30 rounded-xl"
        >
          <div className="flex items-center gap-2 text-yellow-400">
            <Wind className="w-4 h-4" />
            <span className="text-sm">
              Wind gusts up to {WeatherAPI.formatWindSpeed(current.wind_gusts_10m)}
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
