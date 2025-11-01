
'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { WeatherAPI } from '@/lib/weather-api';
import { LocationData } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CitySearchProps {
  onCitySelect: (city: LocationData) => void;
  className?: string;
}

export function CitySearch({ onCitySelect, className }: CitySearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!query?.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const searchCities = async () => {
      setIsLoading(true);
      try {
        const searchResults = await WeatherAPI.searchCities(query);
        setResults(searchResults ?? []);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchCities, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleCitySelect = (city: LocationData) => {
    setQuery('');
    setShowResults(false);
    setResults([]);
    onCitySelect(city);
  };

  const formatCityName = (city: LocationData) => {
    const parts = [city?.name];
    if (city?.admin1) parts.push(city.admin1);
    if (city?.country) parts.push(city.country);
    return parts.filter(Boolean).join(', ');
  };

  return (
    <div className={cn('relative w-full max-w-md', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city..."
          className="w-full rounded-xl bg-gray-800/50 pl-11 pr-4 py-3 text-white placeholder-gray-400 border border-gray-700/50 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 backdrop-blur-sm transition-all duration-200"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-400 animate-spin" />
        )}
      </div>

      {showResults && results?.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 max-h-60 overflow-y-auto rounded-xl bg-gray-800/95 backdrop-blur-sm border border-gray-700/50 shadow-2xl">
          {results.map((city) => (
            <button
              key={`${city?.id}-${city?.name}-${city?.country_code}`}
              onClick={() => handleCitySelect(city)}
              className="w-full px-4 py-3 text-left hover:bg-blue-600/20 transition-colors duration-150 border-b border-gray-700/30 last:border-b-0 group"
            >
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors duration-150" />
                <div>
                  <div className="text-white font-medium">{city?.name}</div>
                  <div className="text-sm text-gray-400">
                    {formatCityName(city)}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {showResults && results?.length === 0 && !isLoading && query?.trim() && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 rounded-xl bg-gray-800/95 backdrop-blur-sm border border-gray-700/50 shadow-2xl p-4">
          <div className="text-gray-400 text-center">
            No cities found for "{query}"
          </div>
        </div>
      )}
    </div>
  );
}
