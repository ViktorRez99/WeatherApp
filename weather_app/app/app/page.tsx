
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cloud, MapPin, TrendingUp } from 'lucide-react';
import { CitySearch } from '@/components/weather/city-search';
import { CurrentWeather } from '@/components/weather/current-weather';
import { WeatherForecast } from '@/components/weather/weather-forecast';
import { HistoricalWeather } from '@/components/weather/historical-weather';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { WeatherAPI } from '@/lib/weather-api';
import { LocationData, WeatherData } from '@/lib/types';

export default function HomePage() {
  const [selectedCity, setSelectedCity] = useState<LocationData | null>(null);
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCitySelect = async (city: LocationData) => {
    setSelectedCity(city);
    setIsLoading(true);
    setError(null);
    
    try {
      const weatherData = await WeatherAPI.getCurrentWeather(city.latitude, city.longitude);
      
      if (!weatherData) {
        throw new Error('Failed to fetch weather data');
      }
      
      setCurrentWeather(weatherData);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setError('Failed to load weather data. Please try again.');
      setCurrentWeather(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getCityDisplayName = (city: LocationData) => {
    const parts = [city?.name];
    if (city?.admin1) parts.push(city.admin1);
    if (city?.country) parts.push(city.country);
    return parts.filter(Boolean).join(', ');
  };

  return (
    <div className="min-h-screen animated-bg">
      {/* Background particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900/20 backdrop-blur-md border-b border-gray-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <Cloud className="w-8 h-8 text-blue-400" />
              <h1 className="text-2xl font-bold text-gradient">
                WeatherApp
              </h1>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="hidden md:flex items-center gap-2 text-gray-300">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Real-time weather data</span>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        {!selectedCity && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 lg:py-24"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              Comprehensive Weather Insights
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto"
            >
              Get detailed current weather, accurate forecasts, and historical climate data 
              for any city worldwide. Make informed decisions with reliable weather intelligence.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center"
            >
              <CitySearch onCitySelect={handleCitySelect} />
            </motion.div>
          </motion.section>
        )}

        {/* Weather Search Bar (when city is selected) */}
        {selectedCity && (
          <motion.section
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">
                  {getCityDisplayName(selectedCity)}
                </h2>
              </div>
              <CitySearch onCitySelect={handleCitySelect} className="max-w-sm" />
            </div>
          </motion.section>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <LoadingSpinner size="lg" className="mb-4" />
              <p className="text-gray-400">Loading weather data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto bg-red-900/20 border border-red-500/30 rounded-xl p-6">
              <p className="text-red-300 mb-4">{error}</p>
              <button
                onClick={() => selectedCity && handleCitySelect(selectedCity)}
                className="btn-secondary"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}

        {/* Weather Data */}
        {currentWeather && selectedCity && !isLoading && !error && (
          <div className="space-y-8">
            {/* Current Weather */}
            <CurrentWeather 
              data={currentWeather} 
              locationName={getCityDisplayName(selectedCity)}
            />

            {/* Weather Forecast */}
            <WeatherForecast data={currentWeather} />

            {/* Historical Weather */}
            <HistoricalWeather
              latitude={selectedCity.latitude}
              longitude={selectedCity.longitude}
              locationName={getCityDisplayName(selectedCity)}
            />
          </div>
        )}

        {/* Features Section (when no city selected) */}
        {!selectedCity && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="py-16"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-white mb-4">
                Everything You Need to Know About Weather
              </h3>
              <p className="text-gray-400 max-w-2xl mx-auto">
                From real-time conditions to long-term climate patterns, 
                our comprehensive weather platform has you covered.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Cloud,
                  title: 'Current Conditions',
                  description: 'Real-time weather data including temperature, humidity, wind speed, pressure, and visibility for precise current conditions.',
                  color: 'text-blue-400'
                },
                {
                  icon: TrendingUp,
                  title: '7-Day Forecast',
                  description: 'Detailed weather predictions with daily highs and lows, precipitation chances, and weather patterns.',
                  color: 'text-green-400'
                },
                {
                  icon: MapPin,
                  title: 'Historical Data',
                  description: 'Access comprehensive historical weather records to analyze climate trends and seasonal patterns.',
                  color: 'text-purple-400'
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 card-hover"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                    <h4 className="text-xl font-semibold text-white">{feature.title}</h4>
                  </div>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-700/30 bg-gray-900/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-blue-400" />
              <span className="text-gray-400">© 2025 WeatherApp</span>
            </div>
            <div className="text-gray-400 text-sm">
              Reliable weather data for informed decisions
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
