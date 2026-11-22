import React from 'react';
import {
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Gauge,
  Eye,
  Compass,
} from 'lucide-react';
import type { WeatherData } from '../../types/airQuality';
import { GlassCard } from '../common/GlassCard';

interface WeatherWidgetProps {
  weather: WeatherData;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather }) => {
  const metrics = [
    {
      label: 'Temperature',
      value: `${weather.temperature}°C`,
      sub: `Dew Point: ${weather.dewPoint}°C`,
      icon: Thermometer,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      label: 'Humidity',
      value: `${weather.humidity}%`,
      sub: 'Relative ambient',
      icon: Droplets,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
    },
    {
      label: 'Wind Vector',
      value: `${weather.windSpeed} km/h`,
      sub: weather.windDirection,
      icon: Wind,
      color: 'text-teal-400',
      bg: 'bg-teal-500/10',
    },
    {
      label: 'UV Radiation',
      value: `Index ${weather.uvIndex}`,
      sub: weather.uvIndex <= 2 ? 'Low Risk' : weather.uvIndex <= 5 ? 'Moderate' : 'High Risk',
      icon: Sun,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
    },
    {
      label: 'Pressure',
      value: `${weather.pressure} hPa`,
      sub: 'Surface barometric',
      icon: Gauge,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
    },
    {
      label: 'Visibility',
      value: `${weather.visibility} km`,
      sub: 'Horizontal visual range',
      icon: Eye,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
  ];

  return (
    <GlassCard padding="md" className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">
              Atmospheric & Meteorological Context
            </h4>
            <p className="text-[11px] text-slate-400">
              Open-Meteo Weather Model • Parameters governing dispersion & stagnation
            </p>
          </div>
        </div>

        <span className="text-xs font-medium text-slate-300 px-2.5 py-1 rounded-full bg-slate-800/80 border border-white/10">
          {weather.condition}
        </span>
      </div>

      {/* Grid of weather metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-950/40 border border-white/5 hover:border-cyan-500/20 transition-all space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  {m.label}
                </span>
                <div className={`p-1.5 rounded-lg ${m.bg} ${m.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="text-base sm:text-lg font-bold text-white tracking-tight">
                {m.value}
              </div>

              <p className="text-[10px] text-slate-400 truncate">
                {m.sub}
              </p>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};
