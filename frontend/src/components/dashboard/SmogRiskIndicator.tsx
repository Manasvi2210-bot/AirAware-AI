import React from 'react';
import { AlertOctagon, Flame } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';

interface SmogRiskIndicatorProps {
  score: number; // 0 to 100
  level: 'Low' | 'Moderate' | 'High' | 'Severe';
  factors: string;
}

export const SmogRiskIndicator: React.FC<SmogRiskIndicatorProps> = ({
  score,
  level,
  factors,
}) => {
  const getRiskColor = () => {
    if (score < 30) return { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', color: '#10b981' };
    if (score < 60) return { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', color: '#f59e0b' };
    if (score < 80) return { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', color: '#f97316' };
    return { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', color: '#f43f5e' };
  };

  const colors = getRiskColor();

  return (
    <GlassCard padding="md" className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <AlertOctagon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-white">
                Diagnostic Inversion Index
              </h4>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                Calculated
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Derived from Open-Meteo wind speed & relative humidity
            </p>
          </div>
        </div>

        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}
        >
          {level} Risk
        </span>
      </div>

      {/* Meter Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Thermal Trapping Coefficient</span>
          <span className={`font-mono font-bold text-sm ${colors.text}`}>
            {score} / 100
          </span>
        </div>

        <div className="w-full h-2.5 rounded-full bg-slate-900 border border-white/5 overflow-hidden flex">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${score}%`,
              backgroundColor: colors.color,
              boxShadow: `0 0 10px ${colors.color}`,
            }}
          />
        </div>

        <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
          <span>0 (High Dispersion)</span>
          <span>50 (Moderate)</span>
          <span>100 (Stagnant Cap)</span>
        </div>
      </div>

      {/* Factors Box */}
      <div className="p-3 rounded-xl bg-slate-950/50 border border-white/5 text-xs text-slate-300 space-y-1">
        <div className="flex items-center gap-1.5 font-semibold text-slate-200">
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span>Calculated Thermodynamic Factor:</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          {factors}
        </p>
      </div>
    </GlassCard>
  );
};
