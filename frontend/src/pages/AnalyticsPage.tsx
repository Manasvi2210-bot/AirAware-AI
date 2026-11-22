import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCity } from '../context/CityContext';
import { SectionHeader } from '../components/common/SectionHeader';
import { GlassCard } from '../components/common/GlassCard';
import {
  BarChart3,
  Download,
} from 'lucide-react';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const { currentCity } = useCity();
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Multi-pollutant radar comparison against WHO Safety Guideline (indexed to 100 max)
  const radarData = [
    {
      subject: 'PM2.5',
      current: Math.min(Math.round((currentCity.pollutants.pm25.value / currentCity.pollutants.pm25.whoGuideline) * 30), 100),
      whoLimit: 30,
      fullMark: 100,
    },
    {
      subject: 'PM10',
      current: Math.min(Math.round((currentCity.pollutants.pm10.value / currentCity.pollutants.pm10.whoGuideline) * 30), 100),
      whoLimit: 30,
      fullMark: 100,
    },
    {
      subject: 'NO₂',
      current: Math.min(Math.round((currentCity.pollutants.no2.value / currentCity.pollutants.no2.whoGuideline) * 30), 100),
      whoLimit: 30,
      fullMark: 100,
    },
    {
      subject: 'O₃',
      current: Math.min(Math.round((currentCity.pollutants.o3.value / currentCity.pollutants.o3.whoGuideline) * 30), 100),
      whoLimit: 30,
      fullMark: 100,
    },
    {
      subject: 'SO₂',
      current: Math.min(Math.round((currentCity.pollutants.so2.value / currentCity.pollutants.so2.whoGuideline) * 30), 100),
      whoLimit: 30,
      fullMark: 100,
    },
    {
      subject: 'CO',
      current: Math.min(Math.round((currentCity.pollutants.co.value / currentCity.pollutants.co.whoGuideline) * 30), 100),
      whoLimit: 30,
      fullMark: 100,
    },
  ];

  // Monthly breakdown dataset
  const monthlyData = [
    { month: 'Jun', good: 22, moderate: 7, unhealthy: 1 },
    { month: 'Jul', good: 24, moderate: 6, unhealthy: 1 },
    { month: 'Aug', good: 21, moderate: 8, unhealthy: 2 },
    { month: 'Sep', good: 19, moderate: 9, unhealthy: 2 },
    { month: 'Oct', good: 16, moderate: 11, unhealthy: 4 },
    { month: 'Nov', good: 14, moderate: 12, unhealthy: 4 },
  ];

  // Source attribution shares
  const emissionSources = [
    { name: 'Vehicular Exhaust & Freight', percent: 42, color: '#06b6d4' },
    { name: 'Industrial & Power Generation', percent: 28, color: '#ec4899' },
    { name: 'Biomass & Residential Heating', percent: 18, color: '#f59e0b' },
    { name: 'Natural Mineral Dust & Pollen', percent: 12, color: '#10b981' },
  ];

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Timestamp,City,AQI,Category,PM2.5(ug/m3),PM10(ug/m3),NO2(ppb),O3(ppb)\n';

    currentCity.hourlyTrend.forEach((row) => {
      csvContent += `${row.time},${currentCity.name},${row.aqi},${row.category},${row.pm25},${row.pm10},${row.no2},${row.o3}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `airaware_${currentCity.id}_telemetry_demo.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6 sm:space-y-8"
    >
      <SectionHeader
        title="Atmospheric Analytics & Research Hub"
        subtitle={`Multi-pollutant correlation, source attribution, and epidemiological analysis for ${currentCity.name}`}
        icon={<BarChart3 className="w-5 h-5 text-cyan-400" />}
        action={
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-cyan-500/20"
          >
            <Download className="w-4 h-4" />
            <span>{downloadSuccess ? 'Downloaded!' : 'Export DEMO Data (CSV)'}</span>
          </button>
        }
      />

      {/* Two Column Grid: Radar Safety Comparison vs Emission Source Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <GlassCard padding="lg" className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="text-base font-bold text-white">
                Multi-Gas Exposure Index vs WHO Guidelines
              </h3>
              <p className="text-xs text-slate-400">
                Radar perimeter indexed to WHO maximum 24h allowable levels
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="flex items-center gap-1 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Current
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> WHO Safe
              </span>
            </div>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={10} />
                <Radar
                  name="Current City Reading"
                  dataKey="current"
                  stroke="#06b6d4"
                  fill="#06b6d4"
                  fillOpacity={0.45}
                />
                <Radar
                  name="WHO Limit Threshold"
                  dataKey="whoLimit"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.15}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-slate-400 text-center">
            Values scaled relative to WHO annual particulate benchmarks. Lower values represent cleaner ambient conditions.
          </p>
        </GlassCard>

        {/* Source Attribution Breakdown */}
        <GlassCard padding="lg" className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Estimated Emission Source Attribution</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Experimental / Demo
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Receptor modeling & chemical mass balance estimates (Simulated demonstration)
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400">2026 Model</span>
          </div>

          {/* Visual Bar Shares */}
          <div className="space-y-4 pt-2">
            {emissionSources.map((source, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-200">{source.name}</span>
                  <span className="font-mono font-bold" style={{ color: source.color }}>
                    {source.percent}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 border border-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${source.percent}%`,
                      backgroundColor: source.color,
                      boxShadow: `0 0 10px ${source.color}`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 text-xs text-slate-300 mt-4 leading-relaxed">
            <strong className="text-cyan-300">Analytical Takeaway: </strong>
            Transport and internal combustion engines represent the predominant source of ultrafine aerosol particulates in {currentCity.name}.
          </div>
        </GlassCard>
      </div>

      {/* Historical Monthly AQI Distribution Bar Chart */}
      <GlassCard padding="lg" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>6-Month Air Quality Category Distribution</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-white/5">
                Historical Archive
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Monthly breakdown of clean days vs moderate and unhealthy episodes (Climatological Baseline)
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Good (0-50)
            </span>
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Moderate
            </span>
            <span className="flex items-center gap-1.5 text-rose-400 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Unhealthy
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="p-3 rounded-xl bg-slate-900 border border-white/10 text-xs space-y-1">
                        <p className="font-bold text-white">{label} Distribution</p>
                        <p className="text-emerald-400">Good Days: {payload[0].value}</p>
                        <p className="text-amber-400">Moderate Days: {payload[1].value}</p>
                        <p className="text-rose-400">Unhealthy Days: {payload[2].value}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="good" fill="#10b981" stackId="a" radius={[0, 0, 4, 4]} />
              <Bar dataKey="moderate" fill="#f59e0b" stackId="a" />
              <Bar dataKey="unhealthy" fill="#f43f5e" stackId="a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </motion.div>
  );
};
