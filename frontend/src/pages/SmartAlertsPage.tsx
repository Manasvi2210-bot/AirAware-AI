import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCity } from '../context/CityContext';
import { SectionHeader } from '../components/common/SectionHeader';
import { GlassCard } from '../components/common/GlassCard';
import {
  BellRing,
  AlertTriangle,
  Sliders,
  Radio,
  Flame,
  CheckCircle2,
  X,
  Plus,
  Smartphone,
  Mail,
  MessageSquare,
  Globe,
  ShieldAlert,
  Clock,
  HeartPulse,
} from 'lucide-react';

export const SmartAlertsPage: React.FC = () => {
  const {
    currentCity,
    activeAlerts,
    dismissAlert,
    addCustomAlert,
    triggerSimulatedSpike,
    isSimulatedSpikeActive,
    sensitivityProfile,
    toggleSensitivitySetting,
    notificationsEnabled,
    setNotificationsEnabled,
    thresholdPM25,
    setThresholdPM25,
  } = useCity();

  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'moderate'>('all');
  const [newRuleMetric, setNewRuleMetric] = useState<'PM2.5' | 'AQI' | 'Ozone' | 'NO2'>('PM2.5');
  const [ruleCreatedSuccess, setRuleCreatedSuccess] = useState(false);

  const [channels, setChannels] = useState({
    push: true,
    email: true,
    sms: false,
    webhook: false,
  });

  const toggleChannel = (key: keyof typeof channels) => {
    setChannels((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomAlert({
      title: `Custom Rule: ${newRuleMetric} > ${thresholdPM25}`,
      severity: thresholdPM25 > 80 ? 'critical' : 'moderate',
      category: 'User Rule',
      message: `Triggered when ambient ${newRuleMetric} exceeds threshold of ${thresholdPM25} in ${currentCity.name}.`,
      recommendation: 'Check indoor filters and activate automated HVAC damper.',
    });
    setRuleCreatedSuccess(true);
    setTimeout(() => setRuleCreatedSuccess(false), 3000);
  };

  const filteredAlerts = activeAlerts.filter((alert) => {
    if (filterSeverity === 'critical') return alert.severity === 'critical' || alert.severity === 'high';
    if (filterSeverity === 'moderate') return alert.severity === 'moderate' || alert.severity === 'low';
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6 sm:space-y-8"
    >
      <SectionHeader
        title="Smart Environmental Alerts & Automation"
        subtitle={`Threshold triggers, notification rules, and early hazard detection for ${currentCity.name}`}
        icon={<BellRing className="w-5 h-5 text-rose-400" />}
        action={
          <button
            onClick={triggerSimulatedSpike}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg ${
              isSimulatedSpikeActive
                ? 'bg-rose-600 text-white shadow-rose-900/50 animate-pulse'
                : 'bg-slate-900 hover:bg-rose-950/40 text-rose-400 border border-rose-500/40'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>{isSimulatedSpikeActive ? 'Disable Spike Simulation' : 'Simulate Sensor Spike'}</span>
          </button>
        }
      />

      {/* Simulation status banner */}
      {isSimulatedSpikeActive && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-rose-200">
                SENSOR HAZARD SPIKE SIMULATION RUNNING
              </p>
              <p className="text-rose-300">
                AQI has surged to {currentCity.currentAQI}. Critical alert dispatched across virtual channels.
              </p>
            </div>
          </div>
          <button
            onClick={triggerSimulatedSpike}
            className="px-3 py-1.5 rounded-lg bg-rose-500 text-slate-950 font-bold text-xs"
          >
            Reset Baseline
          </button>
        </div>
      )}

      {/* Grid: Active Alerts Feed (Left) + Rule Builder & Channels (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Alerts Feed */}
        <div className="lg:col-span-2 space-y-4">
          <GlassCard padding="lg" className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Active Alert Feed ({filteredAlerts.length})
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time events currently affecting {currentCity.name}
                </p>
              </div>

              {/* Severity filter pills */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-white/5 text-xs">
                <button
                  onClick={() => setFilterSeverity('all')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    filterSeverity === 'all'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterSeverity('critical')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    filterSeverity === 'critical'
                      ? 'bg-rose-500 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Critical / High
                </button>
                <button
                  onClick={() => setFilterSeverity('moderate')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    filterSeverity === 'moderate'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Moderate
                </button>
              </div>
            </div>

            {/* List of active alerts */}
            <div className="space-y-3">
              {filteredAlerts.length === 0 ? (
                <div className="py-12 text-center rounded-2xl bg-slate-950/40 border border-white/5 space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto opacity-80" />
                  <p className="text-sm font-semibold text-slate-200">
                    No active alerts matching your filter
                  </p>
                  <p className="text-xs text-slate-500">
                    All telemetry is currently operating within user-defined bounds.
                  </p>
                </div>
              ) : (
                filteredAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-2xl border transition-all text-xs space-y-2 ${
                      alert.severity === 'critical'
                        ? 'bg-rose-950/20 border-rose-500/40 shadow-lg shadow-rose-950/30'
                        : alert.severity === 'high'
                        ? 'bg-orange-950/20 border-orange-500/30'
                        : 'bg-slate-950/50 border-white/10'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                            alert.severity === 'critical'
                              ? 'bg-rose-400 animate-ping'
                              : alert.severity === 'high'
                              ? 'bg-orange-400'
                              : 'bg-amber-400'
                          }`}
                        />
                        <h4 className="text-sm font-bold text-white">
                          {alert.title}
                        </h4>
                      </div>
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10"
                        title="Dismiss alert"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-slate-300 leading-relaxed text-xs">
                      {alert.message}
                    </p>

                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-center gap-2 text-slate-300">
                      <strong className="text-cyan-400 shrink-0">Action:</strong>
                      <span>{alert.recommendation}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                      <span className="font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        {alert.timestamp}
                      </span>
                      <span className="text-cyan-400 font-semibold">{alert.category}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>

          {/* Historical Dispatch Audit Log */}
          <GlassCard padding="md" className="space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" /> Recent Alert Trigger History
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 text-[11px]">
                    <th className="pb-2">Timestamp</th>
                    <th className="pb-2">Trigger Event</th>
                    <th className="pb-2">Severity</th>
                    <th className="pb-2">Dispatch Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                  <tr>
                    <td className="py-2.5 text-slate-400">Today 07:14</td>
                    <td className="py-2.5 font-sans font-medium text-white">Morning Rush NO₂ Threshold</td>
                    <td className="py-2.5 text-amber-400 font-sans">Moderate</td>
                    <td className="py-2.5 text-emerald-400">Delivered (Push/Email)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-slate-400">Yesterday 18:30</td>
                    <td className="py-2.5 font-sans font-medium text-white">Inversion Cap Warning</td>
                    <td className="py-2.5 text-orange-400 font-sans">High Risk</td>
                    <td className="py-2.5 text-emerald-400">Delivered (Webhook)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-slate-400">Nov 20 14:05</td>
                    <td className="py-2.5 font-sans font-medium text-white">Ozone Clean Window Notice</td>
                    <td className="py-2.5 text-emerald-400 font-sans">Advisory</td>
                    <td className="py-2.5 text-slate-400">Archived</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Right 1 Col: Rule Builder & Notification Channels */}
        <div className="space-y-6">
          {/* Custom Alert Rule Builder */}
          <GlassCard padding="md" className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-bold text-white">
                New Custom Rule
              </h4>
            </div>

            <form onSubmit={handleCreateRule} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Target Pollutant
                </label>
                <select
                  value={newRuleMetric}
                  onChange={(e) => setNewRuleMetric(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="PM2.5">PM2.5 (Fine Particles)</option>
                  <option value="AQI">Overall AQI</option>
                  <option value="Ozone">Ozone (O₃)</option>
                  <option value="NO2">Nitrogen Dioxide (NO₂)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span>Threshold Limit</span>
                  <span className="font-mono font-bold text-white">
                    &gt; {thresholdPM25} {newRuleMetric === 'AQI' ? 'AQI' : 'µg/m³'}
                  </span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="250"
                  value={thresholdPM25}
                  onChange={(e) => setThresholdPM25(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Save Alert Rule</span>
              </button>

              {ruleCreatedSuccess && (
                <p className="text-center text-xs text-emerald-400 font-medium">
                  Rule activated successfully!
                </p>
              )}
            </form>
          </GlassCard>

          {/* Delivery Channels Toggle */}
          <GlassCard padding="md" className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400" /> Dispatch Channels
              </h4>
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  notificationsEnabled ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 bg-slate-800'
                }`}
              >
                {notificationsEnabled ? 'ENABLED' : 'PAUSED'}
              </button>
            </div>

            <div className="space-y-2.5">
              {[
                { key: 'push' as const, label: 'Browser Push Notifications', icon: Smartphone, active: channels.push },
                { key: 'email' as const, label: 'Email Digest & Warnings', icon: Mail, active: channels.email },
                { key: 'sms' as const, label: 'Emergency SMS Dispatches', icon: MessageSquare, active: channels.sms },
                { key: 'webhook' as const, label: 'IoT Smart Home Webhook', icon: Globe, active: channels.webhook },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.key}
                    onClick={() => toggleChannel(item.key)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/50 border border-white/5 hover:border-cyan-500/30 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-2.5 text-xs text-slate-200">
                      <Icon className="w-4 h-4 text-cyan-400" />
                      <span>{item.label}</span>
                    </div>
                    <div
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                        item.active ? 'bg-cyan-500' : 'bg-slate-800'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                          item.active ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Health Profile Sensitivity Card */}
          <GlassCard padding="md" className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-400" /> Sensitivity Triggers
              </h4>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { key: 'asthma' as const, label: 'Asthma / Bronchial' },
                { key: 'runner' as const, label: 'High-Ventilation Runner' },
                { key: 'children' as const, label: 'Children Protection' },
                { key: 'elderly' as const, label: 'Elderly Cardiac Care' },
              ].map((s) => (
                <div
                  key={s.key}
                  onClick={() => toggleSensitivitySetting(s.key)}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40 border border-white/5 cursor-pointer hover:border-cyan-500/20"
                >
                  <span className="text-slate-300">{s.label}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      sensitivityProfile[s.key]
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {sensitivityProfile[s.key] ? 'ACTIVE' : 'OFF'}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
};
