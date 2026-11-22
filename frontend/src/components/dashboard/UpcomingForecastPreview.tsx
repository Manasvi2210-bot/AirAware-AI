import React from 'react';
import { CalendarDays, ArrowRight, CloudSun, Sun, CloudRain, Cloud } from 'lucide-react';
import type { DailyForecast } from '../../types/airQuality';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { Link } from 'react-router-dom';

interface UpcomingForecastPreviewProps {
  forecast: DailyForecast[];
  cityName: string;
}

export const UpcomingForecastPreview: React.FC<UpcomingForecastPreviewProps> = ({
  forecast,
  cityName,
}) => {
  const getWeatherIcon = (cond: string) => {
    const c = cond.toLowerCase();
    if (c.includes('rain') || c.includes('shower')) {
      return <CloudRain className="w-5 h-5 text-cyan-400" />;
    }
    if (c.includes('clear') || c.includes('sunny')) {
      return <Sun className="w-5 h-5 text-amber-400" />;
    }
    if (c.includes('partly') || c.includes('haze')) {
      return <CloudSun className="w-5 h-5 text-yellow-300" />;
    }
    return <Cloud className="w-5 h-5 text-slate-300" />;
  };

  return (
    <GlassCard padding="lg" className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <CalendarDays className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-white">
              7-Day Air Quality Outlook
            </h4>
            <p className="text-xs text-slate-400">
              Open-Meteo Deterministic Weather & Chemistry Forecast for {cityName}
            </p>
          </div>
        </div>

        <Link
          to="/forecast"
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group"
        >
          <span>Detailed Outlook</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Responsive Horizontal / Grid Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {forecast.map((item, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
              idx === 0
                ? 'bg-cyan-950/30 border-cyan-500/40 shadow-md shadow-cyan-950/40'
                : 'bg-slate-950/40 border-white/5 hover:border-cyan-500/30'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span>{item.dayName}</span>
                <span className="text-[10px] text-slate-400">{item.date}</span>
              </div>

              <div className="my-2.5 flex items-center justify-center">
                {getWeatherIcon(item.condition)}
              </div>

              <div className="text-center">
                <Badge category={item.category} size="sm">
                  AQI {item.aqi}
                </Badge>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 text-center space-y-0.5">
              <div className="text-xs font-bold text-slate-200">
                {item.maxTemp}° / <span className="text-slate-400">{item.minTemp}°</span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                {item.condition}
              </p>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
