
'use client';

import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { HistoricalWeatherData, HistoricalPeriod } from '@/lib/types';

interface HistoricalChartProps {
  data: HistoricalWeatherData;
  period: HistoricalPeriod;
  locationName: string;
}

export function HistoricalChart({ data, period, locationName }: HistoricalChartProps) {
  const chartData = useMemo(() => {
    if (!data?.daily) return [];

    return data.daily.time?.map((date, index) => ({
      date,
      maxTemp: Math.round(data.daily.temperature_2m_max?.[index] ?? 0),
      minTemp: Math.round(data.daily.temperature_2m_min?.[index] ?? 0),
      precipitation: Math.round((data.daily.precipitation_sum?.[index] ?? 0) * 10) / 10,
      formattedDate: new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        ...(period === '1year' ? { year: '2-digit' } : {})
      })
    })) ?? [];
  }, [data, period]);

  const getXAxisInterval = () => {
    const dataLength = chartData.length;
    if (dataLength <= 7) return 0;
    if (dataLength <= 30) return Math.ceil(dataLength / 7);
    if (dataLength <= 90) return Math.ceil(dataLength / 10);
    return Math.ceil(dataLength / 15);
  };

  if (!chartData.length) return null;

  return (
    <div className="space-y-6">
      {/* Temperature Chart */}
      <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-blue-500 rounded-full"></div>
          Temperature Trends
        </h4>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <XAxis 
                dataKey="formattedDate" 
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                tickLine={false}
                interval={getXAxisInterval()}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                tickLine={false}
                label={{ 
                  value: 'Temperature (°C)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fontSize: 11, fill: '#9CA3AF' }
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '11px'
                }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Legend 
                verticalAlign="top"
                wrapperStyle={{ fontSize: 11, color: '#9CA3AF' }}
              />
              <Line 
                type="monotone" 
                dataKey="maxTemp" 
                stroke="#EF4444" 
                strokeWidth={2}
                name="Max Temperature"
                dot={false}
                activeDot={{ r: 4, stroke: '#EF4444', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="minTemp" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Min Temperature"
                dot={false}
                activeDot={{ r: 4, stroke: '#3B82F6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Precipitation Chart */}
      <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          Precipitation
        </h4>
        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <XAxis 
                dataKey="formattedDate" 
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                tickLine={false}
                interval={getXAxisInterval()}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                tickLine={false}
                label={{ 
                  value: 'Precipitation (mm)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fontSize: 11, fill: '#9CA3AF' }
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '11px'
                }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Bar 
                dataKey="precipitation" 
                fill="#60A5FA" 
                radius={[2, 2, 0, 0]}
                name="Precipitation (mm)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
