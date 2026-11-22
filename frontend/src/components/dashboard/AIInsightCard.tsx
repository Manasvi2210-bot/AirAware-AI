import React from 'react';
import { Bot, Sparkles, ArrowRight, CheckCircle2, AlertCircle, Ban } from 'lucide-react';
import type { AIInsight } from '../../types/airQuality';
import { GlassCard } from '../common/GlassCard';
import { Link } from 'react-router-dom';

interface AIInsightCardProps {
  insight: AIInsight;
  cityName: string;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({ insight, cityName }) => {
  const getAdviseBadge = (val: string) => {
    if (val === 'Ideal' || val === 'Safe' || val === 'Recommended') {
      return (
        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md">
          <CheckCircle2 className="w-3 h-3" /> {val}
        </span>
      );
    }
    if (val === 'Moderate' || val === 'Caution' || val === 'Keep Closed') {
      return (
        <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-md">
          <AlertCircle className="w-3 h-3" /> {val}
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded-md">
        <Ban className="w-3 h-3" /> {val}
      </span>
    );
  };

  return (
    <GlassCard glow="cyan" padding="lg" className="space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20">
            <Bot className="w-5 h-5" />
            <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-cyan-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                AirAware Brain • AI Intelligence
              </h3>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Live Copilot
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Natural language environmental synthesis for {cityName}
            </p>
          </div>
        </div>

        <Link
          to="/assistant"
          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors group"
        >
          <span>Ask Copilot</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Main Natural Language Summary */}
      <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-slate-200 text-xs sm:text-sm leading-relaxed">
        <p className="font-medium">{insight.summary}</p>
      </div>

      {/* Grid of Activity Recommendations */}
      <div className="space-y-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Personalized Activity Guidance
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-xl bg-slate-950/40 border border-white/5 flex flex-col justify-between gap-2">
            <span className="text-xs text-slate-300 font-medium">Jogging & Cardio</span>
            {getAdviseBadge(insight.activityAdvise.jogging)}
          </div>
          <div className="p-3 rounded-xl bg-slate-950/40 border border-white/5 flex flex-col justify-between gap-2">
            <span className="text-xs text-slate-300 font-medium">Road Cycling</span>
            {getAdviseBadge(insight.activityAdvise.cycling)}
          </div>
          <div className="p-3 rounded-xl bg-slate-950/40 border border-white/5 flex flex-col justify-between gap-2">
            <span className="text-xs text-slate-300 font-medium">Children Outdoors</span>
            {getAdviseBadge(insight.activityAdvise.childrenOutdoor)}
          </div>
          <div className="p-3 rounded-xl bg-slate-950/40 border border-white/5 flex flex-col justify-between gap-2">
            <span className="text-xs text-slate-300 font-medium">Open Windows</span>
            {getAdviseBadge(insight.activityAdvise.windowsOpen)}
          </div>
        </div>
      </div>

      {/* Key Meteorological & Emission Drivers */}
      <div className="space-y-2 pt-2 border-t border-white/10">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Primary Environmental Drivers Identified
        </span>
        <div className="flex flex-wrap gap-2">
          {insight.keyDrivers.map((driver, idx) => (
            <span
              key={idx}
              className="text-xs px-3 py-1 rounded-lg bg-slate-900/90 text-slate-300 border border-white/10 flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              {driver}
            </span>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};
