
'use client';

import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudDrizzle, 
  Zap,
  CloudFog,
  Snowflake
} from 'lucide-react';
import { WEATHER_CODES } from '@/lib/types';

interface WeatherIconProps {
  weatherCode: number;
  className?: string;
  animate?: boolean;
}

export function WeatherIcon({ weatherCode, className = "w-6 h-6", animate = false }: WeatherIconProps) {
  const weatherInfo = WEATHER_CODES[weatherCode] ?? WEATHER_CODES[0];
  
  const getIcon = () => {
    switch (weatherInfo.icon) {
      case 'sun':
        return Sun;
      case 'cloud-sun':
      case 'cloud':
        return Cloud;
      case 'cloud-rain':
        return CloudRain;
      case 'cloud-snow':
        return CloudSnow;
      case 'cloud-drizzle':
        return CloudDrizzle;
      case 'zap':
        return Zap;
      case 'cloud-fog':
        return CloudFog;
      case 'snowflake':
        return Snowflake;
      default:
        return Sun;
    }
  };

  const IconComponent = getIcon();
  
  const animationClass = animate ? 'animate-pulse' : '';

  return (
    <IconComponent 
      className={`${className} ${animationClass}`}
      aria-label={weatherInfo.description}
    />
  );
}
