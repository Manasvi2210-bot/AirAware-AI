import React from 'react';
import { motion } from 'framer-motion';
import { useCity } from '../context/CityContext';
import { AQIGauge } from '../components/dashboard/AQIGauge';
import { PollutantCard } from '../components/dashboard/PollutantCard';
import { WeatherWidget } from '../components/dashboard/WeatherWidget';
import { TrendChart } from '../components/dashboard/TrendChart';
import { SmogRiskIndicator } from '../components/dashboard/SmogRiskIndicator';
import { AIInsightCard } from '../components/dashboard/AIInsightCard';
import { RecentAlertsCard } from '../components/dashboard/RecentAlertsCard';
import { UpcomingForecastPreview } from '../components/dashboard/UpcomingForecastPreview';
import { SectionHeader } from '../components/common/SectionHeader';
import {
  Activity,
  ShieldAlert,
  Clock,
  RefreshCw,
  AlertCircle,
  Database,
  MapPin,
} from 'lucide-react';

export const OverviewPage: React.FC = () => {
  const {
    currentCity,
    activeAlerts,
    dismissAlert,
    isSimulatedSpikeActive,
    isLoading,
    isError,
    errorMessage,
    refetchCityData,
    isLiveAPIData,
    dataTimestamp,
  } = useCity();

  // Full page skeleton loading state for first load
  if (isLoading && !currentCity) {
    return (
      <div className="space-y-6 sm:space-y-8 animate-pulse">
        <div className="h-48 rounded-3xl bg-slate-900/60 border border-white/5" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 rounded-2xl bg-slate-900/60 border border-white/5" />
          ))}
        </div>
        <div className="h-44 rounded-2xl bg-slate-900/60 border border-white/5" />
        <div className="h-72 rounded-2xl bg-slate-900/60 border border-white/5" />
      </div>
    );
  }

  // Empty data fallback state
  if (!currentCity || !currentCity.pollutants) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-400" />
        <h3 className="text-lg font-bold text-white">No Telemetry Available</h3>
        <p className="text-xs text-slate-400 max-w-md">
          Unable to parse atmospheric data for the selected region. Please try refreshing.
        </p>
        <button
          onClick={() => refetchCityData()}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
        >
          Retry Open-Meteo Sync
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6 sm:space-y-8"
    >
      {/* API Error & Retry Banner */}
      {isError && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-amber-200">
                Live Open-Meteo Connection Error
              </p>
              <p className="text-amber-300">
                {errorMessage || 'Unable to connect to Open-Meteo APIs. Showing cached fallback data.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => refetchCityData()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Sync</span>
          </button>
        </div>
      )}

      {/* Simulated spike warning banner if active */}
      {isSimulatedSpikeActive && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/50 flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500 text-slate-950">
              <ShieldAlert className="w-5 h-5 font-bold" />
            </div>
            <div>
              <p className="text-sm font-bold text-rose-200">
                SIMULATION ACTIVE: Hazardous Air Episode In Progress
              </p>
              <p className="text-xs text-rose-300">
                Sensors are simulating an inversion trapping event with elevated PM2.5. Disable in Smart Alerts.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Atmospheric Chemistry Model Metadata Strip */}
      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3 text-slate-300">
          <span className="flex items-center gap-1.5 font-semibold text-cyan-300">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            {isLiveAPIData ? 'Open-Meteo CAMS Atmospheric Chemistry Model' : 'Cached Model Data'}
          </span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="flex items-center gap-1 text-slate-400 font-mono">
            <MapPin className="w-3 h-3 text-slate-400" />
            {currentCity.coordinates.lat.toFixed(4)}°N, {currentCity.coordinates.lng.toFixed(4)}°E
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1 font-mono">
            <Clock className="w-3 h-3 text-cyan-400" />
            Model Timestamp: <strong className="text-slate-200">{dataTimestamp}</strong>
          </span>
          {isLoading && (
            <span className="flex items-center gap-1 text-cyan-400 animate-pulse">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Syncing...
            </span>
          )}
        </div>
      </div>

      {/* Hero AQI Gauge Section */}
      <AQIGauge
        aqi={currentCity.currentAQI}
        category={currentCity.category}
        dominantPollutant={currentCity.dominantPollutant}
        cityName={currentCity.name}
        europeanAQI={currentCity.europeanAQI}
        isLive={isLiveAPIData}
      />

      {/* 4 Major Pollutant Cards (PM2.5, PM10, NO2, O3) + Secondary SO2 & CO */}
      <section>
        <SectionHeader
          title="Monitored Atmospheric Pollutants"
          subtitle="Model-derived multi-gas spectrometry benchmarked against WHO air quality guidelines"
          icon={<Activity className="w-4 h-4" />}
          action={
            <span className="text-[11px] text-slate-400 font-mono bg-slate-900/80 px-2.5 py-1 rounded-lg border border-white/5">
              Unit: µg/m³
            </span>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <PollutantCard pollutant={currentCity.pollutants.pm25} />
          <PollutantCard pollutant={currentCity.pollutants.pm10} />
          <PollutantCard pollutant={currentCity.pollutants.no2} />
          <PollutantCard pollutant={currentCity.pollutants.o3} />
        </div>

        {/* Secondary pollutants SO2 & CO row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <PollutantCard pollutant={currentCity.pollutants.so2} />
          <PollutantCard pollutant={currentCity.pollutants.co} />
        </div>
      </section>

      {/* Meteorological Summary */}
      <section>
        <WeatherWidget weather={currentCity.weather} />
      </section>

      {/* 24-Hour Trend Chart */}
      <section>
        <TrendChart data={currentCity.hourlyTrend} cityName={currentCity.name} />
      </section>

      {/* Two Column Grid: AI Brain & Upcoming Forecast vs Alerts & Smog Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Insights + 7-Day Preview */}
        <div className="lg:col-span-2 space-y-6">
          <AIInsightCard insight={currentCity.aiInsight} cityName={currentCity.name} />
          <UpcomingForecastPreview forecast={currentCity.forecast7Day} cityName={currentCity.name} />
        </div>

        {/* Right 1 Col: Smog Risk + Recent Alerts */}
        <div className="space-y-6">
          <SmogRiskIndicator
            score={currentCity.aiInsight.inversionRisk.score}
            level={currentCity.aiInsight.inversionRisk.level}
            factors={currentCity.aiInsight.inversionRisk.factors}
          />
          <RecentAlertsCard
            alerts={activeAlerts}
            onDismiss={dismissAlert}
            cityName={currentCity.name}
          />
        </div>
      </div>
    </motion.div>
  );
};
