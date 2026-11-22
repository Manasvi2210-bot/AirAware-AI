import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { HourlyAQIPoint } from '../../types/airQuality';
import { GlassCard } from '../common/GlassCard';
import { TrendingUp, Clock, Database } from 'lucide-react';

interface TrendChartProps {
  data: HourlyAQIPoint[];
  cityName: string;
}

type MetricKey = 'aqi' | 'pm25' | 'pm10' | 'no2' | 'o3';

interface MetricConfig {
  label: string;
  unit: string;
  color: string;
  threshold: number;
  thresholdLabel: string;
}

const METRIC_CONFIGS: Record<MetricKey, MetricConfig> = {
  aqi: {
    label: 'AQI Index',
    unit: 'EPA',
    color: '#06b6d4', // cyan-500
    threshold: 100,
    thresholdLabel: 'Moderate Limit (100)',
  },
  pm25: {
    label: 'PM2.5',
    unit: 'µg/m³',
    color: '#ec4899', // pink-500
    threshold: 35,
    thresholdLabel: 'EPA Standard (35 µg/m³)',
  },
  pm10: {
    label: 'PM10',
    unit: 'µg/m³',
    color: '#f59e0b', // amber-500
    threshold: 54,
    thresholdLabel: 'EPA Standard (54 µg/m³)',
  },
  no2: {
    label: 'NO₂',
    unit: 'µg/m³',
    color: '#8b5cf6', // purple-500
    threshold: 40,
    thresholdLabel: 'Threshold (40 µg/m³)',
  },
  o3: {
    label: 'O₃',
    unit: 'µg/m³',
    color: '#10b981', // emerald-500
    threshold: 100,
    thresholdLabel: 'WHO Guideline (100 µg/m³)',
  },
};

export const TrendChart: React.FC<TrendChartProps> = ({ data, cityName }) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('aqi');
  const metric = METRIC_CONFIGS[selectedMetric];

  return (
    <GlassCard padding="lg" className="space-y-5">
      {/* Top Header & Metric Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              24-Hour Atmospheric Trajectory
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Open-Meteo Hourly Chemistry Grid for {cityName}
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-950/60 border border-white/5">
          {(Object.keys(METRIC_CONFIGS) as MetricKey[]).map((key) => {
            const isSelected = selectedMetric === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedMetric(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {METRIC_CONFIGS[key].label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart Visual Container */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${selectedMetric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={metric.color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={metric.color} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="time"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
              domain={[0, 'auto']}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const dataPoint = payload[0].payload as HourlyAQIPoint;
                  return (
                    <div className="p-3 rounded-xl bg-slate-900/95 border border-cyan-500/30 shadow-2xl backdrop-blur-xl text-xs space-y-1.5">
                      <div className="flex items-center gap-2 text-slate-400 font-mono">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        <span>{label}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-white">
                          {payload[0].value}
                        </span>
                        <span className="text-[11px] text-cyan-400 font-medium">
                          {metric.unit}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 pt-1 border-t border-white/10">
                        Category: <strong className="text-slate-200">{dataPoint.category}</strong>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Threshold Guideline Line */}
            <ReferenceLine
              y={metric.threshold}
              stroke="#f43f5e"
              strokeDasharray="4 4"
              strokeOpacity={0.6}
              label={{
                value: metric.thresholdLabel,
                fill: '#f43f5e',
                fontSize: 10,
                position: 'insideTopRight',
              }}
            />

            <Area
              type="monotone"
              dataKey={selectedMetric}
              stroke={metric.color}
              strokeWidth={2.5}
              fillOpacity={1}
              fill={`url(#gradient-${selectedMetric})`}
              dot={{ fill: metric.color, r: 3, strokeWidth: 1, stroke: '#fff' }}
              activeDot={{ r: 6, fill: metric.color, stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer insight */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-[11px] text-slate-400 border-t border-white/5">
        <span className="flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          Values synthesized from Open-Meteo numerical atmospheric chemistry model grid.
        </span>
        <span className="font-mono text-slate-500">Hourly Resolution</span>
      </div>
    </GlassCard>
  );
};
