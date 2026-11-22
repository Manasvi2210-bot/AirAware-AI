import React from 'react';
import { AlertTriangle, Bell, ArrowRight, X, CheckCircle2 } from 'lucide-react';
import type { SmartAlert } from '../../types/airQuality';
import { GlassCard } from '../common/GlassCard';
import { Link } from 'react-router-dom';

interface RecentAlertsCardProps {
  alerts: SmartAlert[];
  onDismiss: (id: string) => void;
  cityName: string;
}

export const RecentAlertsCard: React.FC<RecentAlertsCardProps> = ({
  alerts,
  onDismiss,
  cityName,
}) => {
  return (
    <GlassCard padding="md" className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-white">
                Active Smart Alerts
              </h4>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {alerts.length}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Live hazard notifications for {cityName}
            </p>
          </div>
        </div>

        <Link
          to="/alerts"
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group"
        >
          <span>All Rules</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Alert list */}
      <div className="space-y-2.5">
        {alerts.length === 0 ? (
          <div className="p-6 text-center rounded-xl bg-slate-950/40 border border-white/5 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-xs font-medium text-slate-300">
              All Clear in {cityName}
            </p>
            <p className="text-[11px] text-slate-500">
              No critical pollution spikes or inversion anomalies detected.
            </p>
          </div>
        ) : (
          alerts.slice(0, 3).map((alert) => {
            const isCritical = alert.severity === 'critical';
            return (
              <div
                key={alert.id}
                className={`p-3.5 rounded-xl border transition-all text-xs space-y-1.5 ${
                  isCritical
                    ? 'bg-rose-950/20 border-rose-500/30 shadow-md shadow-rose-950/30'
                    : 'bg-slate-950/50 border-white/10'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      className={`w-4 h-4 shrink-0 ${
                        isCritical ? 'text-rose-400' : 'text-amber-400'
                      }`}
                    />
                    <span className="font-semibold text-white">
                      {alert.title}
                    </span>
                  </div>

                  <button
                    onClick={() => onDismiss(alert.id)}
                    className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10"
                    title="Dismiss alert"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {alert.message}
                </p>

                <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-white/5">
                  <span className="font-mono">{alert.timestamp}</span>
                  <span className="text-cyan-400 font-semibold">{alert.category}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </GlassCard>
  );
};
