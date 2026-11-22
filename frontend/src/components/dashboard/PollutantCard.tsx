import React from 'react';
import type { PollutantDetail } from '../../types/airQuality';
import { Badge } from '../common/Badge';
import { Info } from 'lucide-react';
import { getAQIConfig } from '../../utils/aqiUtils';

interface PollutantCardProps {
  pollutant: PollutantDetail;
}

export const PollutantCard: React.FC<PollutantCardProps> = ({ pollutant }) => {
  // Calculate percentage against WHO limit
  const percentOfWho = Math.round((pollutant.value / pollutant.whoGuideline) * 100);
  const config = getAQIConfig(
    pollutant.status === 'Good' ? 30 :
    pollutant.status === 'Moderate' ? 75 :
    pollutant.status === 'Unhealthy for Sensitive Groups' ? 120 :
    pollutant.status === 'Unhealthy' ? 170 : 250
  );

  return (
    <div className="group relative p-4 sm:p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-white/10 hover:border-cyan-500/30 backdrop-blur-xl transition-all duration-200 shadow-lg flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white tracking-wide">
                {pollutant.chemicalFormula}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {pollutant.name}
              </span>
            </div>
          </div>
          <Badge category={pollutant.status} size="sm">
            {pollutant.status}
          </Badge>
        </div>

        {/* Current Metric Value */}
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {pollutant.value}
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {pollutant.unit}
          </span>
        </div>

        {/* WHO Guideline Benchmark Bar */}
        <div className="mt-3 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>WHO Limit ({pollutant.whoGuideline} {pollutant.unit})</span>
            <span
              className="font-mono font-semibold"
              style={{ color: config.color }}
            >
              {percentOfWho}%
            </span>
          </div>

          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(percentOfWho, 100)}%`,
                backgroundColor: config.color,
                boxShadow: `0 0 8px ${config.glowColor}`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Description / Health note footer */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-start justify-between gap-2 text-[10px] text-slate-400 leading-snug">
        <div className="flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
          <p className="line-clamp-2">{pollutant.healthRisk}</p>
        </div>
      </div>
    </div>
  );
};
