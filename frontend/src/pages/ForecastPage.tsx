import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCity } from '../context/CityContext';
import { SectionHeader } from '../components/common/SectionHeader';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import {
  CalendarDays,
  CloudSun,
  ShieldCheck,
  Activity,
  Wind,
  Clock,
  Sparkles,
  Sun,
  CloudRain,
  Cloud,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

export const ForecastPage: React.FC = () => {
  const { currentCity } = useCity();
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'hourly' | 'weekly'>('hourly');

  const selectedDay = currentCity.forecast7Day[selectedDayIndex] || currentCity.forecast7Day[0];

  const getWeatherIcon = (cond: string) => {
    const c = cond.toLowerCase();
    if (c.includes('rain') || c.includes('shower')) return <CloudRain className="w-5 h-5 text-cyan-400" />;
    if (c.includes('clear') || c.includes('sunny')) return <Sun className="w-5 h-5 text-amber-400" />;
    if (c.includes('partly') || c.includes('haze')) return <CloudSun className="w-5 h-5 text-yellow-300" />;
    return <Cloud className="w-5 h-5 text-slate-300" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6 sm:space-y-8"
    >
      <SectionHeader
        title="Predictive Environmental Forecast"
        subtitle={`Neural network atmospheric modeling & multi-day outlook for ${currentCity.name}`}
        icon={<CalendarDays className="w-5 h-5" />}
        action={
          <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-900 border border-white/10">
            <button
              onClick={() => setActiveTab('hourly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'hourly'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              24-Hour Curve
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'weekly'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              7-Day Horizon
            </button>
          </div>
        }
      />

      {/* 7-Day Day Selector Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {currentCity.forecast7Day.map((day, idx) => {
          const isSelected = selectedDayIndex === idx;
          return (
            <button
              key={idx}
              onClick={() => setSelectedDayIndex(idx)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-cyan-500/15 border-cyan-500 shadow-lg shadow-cyan-950/40 scale-[1.02]'
                  : 'bg-slate-900/60 border-white/10 hover:border-cyan-500/30 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span>{day.dayName}</span>
                <span className="text-[10px] text-slate-400">{day.date}</span>
              </div>

              <div className="my-2.5 flex items-center justify-between">
                {getWeatherIcon(day.condition)}
                <span className="text-xs font-bold text-white">
                  {day.maxTemp}° / {day.minTemp}°
                </span>
              </div>

              <div className="flex items-center justify-between gap-1 pt-1 border-t border-white/5">
                <Badge category={day.category} size="sm">
                  AQI {day.aqi}
                </Badge>
                <span className="text-[10px] font-mono text-cyan-400">
                  Model Grid
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Focused Card */}
      <GlassCard padding="lg" glow="cyan" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <Badge category={selectedDay.category} size="lg" dot>
                {selectedDay.category} (AQI {selectedDay.aqi})
              </Badge>
              <span className="text-xs text-slate-400 font-medium">
                Primary Factor: <strong className="text-cyan-400">{selectedDay.primaryPollutant}</strong>
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-2">
              Forecast for {selectedDay.dayName} ({selectedDay.date}) in {currentCity.name}
            </h3>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-950/60 border border-white/10">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <div className="text-xs">
              <p className="text-slate-400 text-[10px]">Data Source</p>
              <p className="font-bold text-white">Open-Meteo Deterministic Model</p>
            </div>
          </div>
        </div>

        {/* Neural Advisory */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 text-xs sm:text-sm text-slate-200 flex items-start gap-3">
          <Activity className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-cyan-300">Health Recommendation: </strong>
            {selectedDay.recommendation}
          </p>
        </div>

        {/* 24-Hour Diurnal Progression Chart */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> Hourly Diurnal AQI Trajectory
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Morning commute & evening inversion spikes
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentCity.hourlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="forecastAqiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs">
                          <p className="text-slate-400 font-mono">{label}</p>
                          <p className="text-base font-bold text-white mt-1">
                            AQI {payload[0].value}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine y={100} stroke="#f59e0b" strokeDasharray="3 3" />
                <Area
                  type="monotone"
                  dataKey="aqi"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  fill="url(#forecastAqiGrad)"
                  dot={{ fill: '#06b6d4', r: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </GlassCard>

      {/* Meteorological Drivers & Outdoor Safety Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard padding="md" className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Wind className="w-4 h-4 text-cyan-400" />
            <span>Ventilation Forecast</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Surface winds estimated at {currentCity.weather.windSpeed} km/h from {currentCity.weather.windDirection}. Favorable for gradual particulate dispersal during daylight hours.
          </p>
        </GlassCard>

        <GlassCard padding="md" className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Best Outdoor Hours</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Optimal clean air window is projected between <strong>12:00 PM and 3:30 PM</strong>, when solar thermal lifting dissipates surface aerosols.
          </p>
        </GlassCard>

        <GlassCard padding="md" className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <ShieldCheck className="w-4 h-4 text-yellow-400" />
            <span>Evening Advisory</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Radiative surface cooling after sunset may trap vehicular NOx. Asthmatic individuals are advised to run evening HEPA air cleaners.
          </p>
        </GlassCard>
      </div>
    </motion.div>
  );
};
