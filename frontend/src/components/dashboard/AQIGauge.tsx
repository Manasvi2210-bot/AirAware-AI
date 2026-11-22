import React from 'react';
import { Shield, Sparkles, Activity, Layers } from 'lucide-react';
import type { AQICategory } from '../../types/airQuality';
import { getAQIConfig } from '../../utils/aqiUtils';
import { Badge } from '../common/Badge';

interface AQIGaugeProps {
  aqi: number;
  category: AQICategory;
  dominantPollutant: string;
  cityName: string;
  europeanAQI?: number;
  isLive?: boolean;
}

export const AQIGauge: React.FC<AQIGaugeProps> = ({
  aqi,
  category,
  dominantPollutant,
  cityName,
  europeanAQI,
  isLive = true,
}) => {
  const config = getAQIConfig(aqi);

  // SVG circular arc gauge calculations
  // Angle from -135deg to +135deg (total 270 degrees)
  const radius = 80;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * (270 / 360);
  
  // Normalize AQI (0 to 400 capped)
  const normalizedValue = Math.min(Math.max(aqi, 0), 400);
  const strokeDashoffset = arcLength - (normalizedValue / 400) * arcLength;

  return (
    <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0c162d]/90 via-[#0e1a38]/80 to-[#091124]/90 border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
      {/* Background radial glow matching current AQI status */}
      <div
        className="absolute -top-24 -left-24 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-20 transition-all duration-700"
        style={{ backgroundColor: config.color }}
      />

      {/* Left: Metric & Arc Gauge */}
      <div className="flex flex-col items-center sm:flex-row gap-6 relative z-10">
        <div className="relative flex items-center justify-center w-48 h-48">
          <svg className="w-48 h-48 -rotate-90 transform" viewBox="0 0 200 200">
            {/* Background Arc Track */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={arcLength}
              strokeDashoffset={0}
              strokeLinecap="round"
              transform="rotate(45 100 100)"
            />
            {/* Animated Active Arc */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke={config.color}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={arcLength}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(45 100 100)"
              className="transition-all duration-1000 ease-out"
              style={{
                filter: `drop-shadow(0 0 10px ${config.glowColor})`,
              }}
            />
          </svg>

          {/* Center Inner Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              US EPA AQI
            </span>
            <div
              className="text-5xl font-black tracking-tight leading-none my-1"
              style={{ color: config.color }}
            >
              {aqi}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
              <span className="text-slate-500">Scale</span> 0–500
            </div>
          </div>
        </div>

        {/* Text descriptions */}
        <div className="space-y-2 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <Badge category={category} size="lg" dot>
              {category}
            </Badge>

            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-white/5">
              Dominant: <strong className="text-cyan-400 font-semibold">{dominantPollutant}</strong>
            </span>

            {europeanAQI !== undefined && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20">
                European EAQI: <strong>{europeanAQI}</strong>
              </span>
            )}
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {cityName} Air Quality
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed">
            {config.description}
          </p>

          <div className="pt-2 flex items-center justify-center sm:justify-start gap-2 text-xs font-medium text-slate-300">
            <Activity className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{config.healthImplications}</span>
          </div>
        </div>
      </div>

      {/* Right: Key Advisory Box */}
      <div className="w-full md:w-72 p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2.5 relative z-10 shrink-0">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Shield className="w-4 h-4" /> Action Advisory
          </span>
          <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
            <Layers className="w-3 h-3" />
            {isLive ? 'Open-Meteo Model' : 'Cached Model'}
          </span>
        </div>

        <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
          {config.cautionaryStatement}
        </p>

        <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
          <span>Standard: <strong>EPA / WHO 2024</strong></span>
          <span className="text-cyan-400 flex items-center gap-1 text-[10px] font-mono">
            <Sparkles className="w-3 h-3" /> CAMS Grid
          </span>
        </div>
      </div>
    </div>
  );
};
