
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, BarChart3, Download } from 'lucide-react';
import { WeatherAPI } from '@/lib/weather-api';
import { HistoricalWeatherData, HistoricalPeriod, HISTORICAL_PERIODS } from '@/lib/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { HistoricalChart } from './historical-chart';

interface HistoricalWeatherProps {
  latitude: number;
  longitude: number;
  locationName: string;
}

export function HistoricalWeather({ latitude, longitude, locationName }: HistoricalWeatherProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<HistoricalPeriod>('7days');
  const [historicalData, setHistoricalData] = useState<HistoricalWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (latitude && longitude) {
      fetchHistoricalData();
    }
  }, [latitude, longitude, selectedPeriod]);

  const fetchHistoricalData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const period = HISTORICAL_PERIODS[selectedPeriod];
      const { startDate, endDate } = WeatherAPI.getHistoricalDateRange(period.days);
      
      const data = await WeatherAPI.getHistoricalWeather(latitude, longitude, startDate, endDate);
      
      if (!data) {
        throw new Error('Failed to fetch historical data');
      }
      
      setHistoricalData(data);
    } catch (error) {
      console.error('Error fetching historical data:', error);
      setError('Failed to load historical weather data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getAverageStats = () => {
    if (!historicalData?.daily) return null;

    const temps = historicalData.daily.temperature_2m_max ?? [];
    const minTemps = historicalData.daily.temperature_2m_min ?? [];
    const precipitation = historicalData.daily.precipitation_sum ?? [];

    const avgMaxTemp = temps.length > 0 ? temps.reduce((sum, temp) => sum + (temp ?? 0), 0) / temps.length : 0;
    const avgMinTemp = minTemps.length > 0 ? minTemps.reduce((sum, temp) => sum + (temp ?? 0), 0) / minTemps.length : 0;
    const totalPrecipitation = precipitation.reduce((sum, precip) => sum + (precip ?? 0), 0);
    const maxTemp = Math.max(...temps.filter(t => t != null));
    const minTemp = Math.min(...minTemps.filter(t => t != null));

    return {
      avgMaxTemp,
      avgMinTemp,
      totalPrecipitation,
      maxTemp,
      minTemp,
      daysWithRain: precipitation.filter(p => (p ?? 0) > 0.1).length
    };
  };

  const stats = getAverageStats();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-700/50"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
          <Calendar className="w-6 h-6 text-purple-400" />
          Historical Weather
        </h3>
        <button className="text-gray-400 hover:text-white transition-colors duration-200">
          <Download className="w-5 h-5" />
        </button>
      </div>

      {/* Period Selection */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(HISTORICAL_PERIODS).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setSelectedPeriod(key as HistoricalPeriod)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedPeriod === key
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-700/50'
            }`}
          >
            {config.label}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-center py-12">
          <div className="text-red-400 mb-2">{error}</div>
          <button
            onClick={fetchHistoricalData}
            className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
          >
            Try again
          </button>
        </div>
      )}

      {/* Data Display */}
      {historicalData && !isLoading && !error && (
        <div className="space-y-6">
          {/* Summary Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-red-400" />
                  <span className="text-xs text-gray-400">Avg High</span>
                </div>
                <div className="text-white font-semibold">
                  {WeatherAPI.formatTemperature(stats.avgMaxTemp)}
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-blue-400 rotate-180" />
                  <span className="text-xs text-gray-400">Avg Low</span>
                </div>
                <div className="text-white font-semibold">
                  {WeatherAPI.formatTemperature(stats.avgMinTemp)}
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-gray-400">Max Temp</span>
                </div>
                <div className="text-white font-semibold">
                  {WeatherAPI.formatTemperature(stats.maxTemp)}
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-gray-400">Min Temp</span>
                </div>
                <div className="text-white font-semibold">
                  {WeatherAPI.formatTemperature(stats.minTemp)}
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-gray-400">Total Rain</span>
                </div>
                <div className="text-white font-semibold">
                  {Math.round(stats.totalPrecipitation)} mm
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-gray-400">Rainy Days</span>
                </div>
                <div className="text-white font-semibold">
                  {stats.daysWithRain}
                </div>
              </div>
            </div>
          )}

          {/* Chart */}
          <HistoricalChart 
            data={historicalData} 
            period={selectedPeriod}
            locationName={locationName}
          />
        </div>
      )}
    </motion.div>
  );
}
