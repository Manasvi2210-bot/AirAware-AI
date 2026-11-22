import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Bell,
  MapPin,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  X,
  Sliders,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { useCity } from '../../context/CityContext';
import { getAQIConfig } from '../../utils/aqiUtils';
import { Link } from 'react-router-dom';

interface TopBarProps {
  onOpenMobileMenu: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenMobileMenu }) => {
  const {
    currentCity,
    allCities,
    selectedCityId,
    setSelectedCityId,
    isLoading,
    isLiveAPIData,
    dataTimestamp,
    refetchCityData,
    activeAlerts,
    dismissAlert,
    sensitivityProfile,
    toggleSensitivitySetting,
  } = useCity();

  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(event.target as Node)
      ) {
        setCityDropdownOpen(false);
      }
      if (
        notifDropdownRef.current &&
        !notifDropdownRef.current.contains(event.target as Node)
      ) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cityConfig = getAQIConfig(currentCity.currentAQI);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-18 px-4 sm:px-8 bg-[#070d1d]/80 backdrop-blur-xl border-b border-white/10">
      {/* Left: Mobile menu toggle & City Selector */}
      <div className="flex items-center gap-3 sm:gap-6">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Interactive City Selector */}
        <div className="relative" ref={cityDropdownRef}>
          <button
            onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
            className="flex items-center gap-2.5 px-3 sm:px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-white/10 hover:border-cyan-500/40 transition-all text-left group shadow-sm"
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-500/15 text-cyan-400 group-hover:scale-105 transition-transform">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-semibold text-white tracking-tight">
                  {currentCity.name}
                </span>
                <span className="text-xs">{currentCity.flag}</span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                {currentCity.country}
              </p>
            </div>
            <div className="ml-1 sm:ml-2 flex items-center gap-2">
              <span
                className="text-[11px] font-bold px-2 py-0.5 rounded-md"
                style={{
                  backgroundColor: cityConfig.bgColor,
                  color: cityConfig.color,
                }}
              >
                AQI {currentCity.currentAQI}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  cityDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
          </button>

          {/* Dropdown Menu */}
          {cityDropdownOpen && (
            <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-[#0b1328] border border-white/10 shadow-2xl backdrop-blur-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-white/5 flex items-center justify-between">
                <span>Select Target Region</span>
                <span className="text-[10px] text-cyan-400 font-mono">Live Sync</span>
              </div>
              <div className="mt-1 space-y-1 max-h-72 overflow-y-auto">
                {allCities.map((city) => {
                  const cfg = getAQIConfig(city.currentAQI);
                  const isSelected = city.id === selectedCityId;
                  return (
                    <button
                      key={city.id}
                      onClick={() => {
                        setSelectedCityId(city.id);
                        setCityDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs transition-all ${
                        isSelected
                          ? 'bg-cyan-500/15 border border-cyan-500/30 text-white'
                          : 'hover:bg-white/5 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{city.flag}</span>
                        <div>
                          <p className="font-semibold text-slate-100">
                            {city.name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {city.coordinates.lat.toFixed(2)}°, {city.coordinates.lng.toFixed(2)}°
                          </p>
                        </div>
                      </div>
                      <span
                        className="font-bold px-2 py-0.5 rounded-md text-[11px]"
                        style={{
                          backgroundColor: cfg.bgColor,
                          color: cfg.color,
                        }}
                      >
                        {city.currentAQI}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Live Refresh Button */}
        <button
          onClick={() => refetchCityData()}
          disabled={isLoading}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white text-xs transition-colors"
          title="Refresh Live Open-Meteo Data"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          <span className="text-[11px]">Refresh</span>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* API Status Pill */}
        <div
          className={`hidden md:flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-medium transition-colors ${
            isLiveAPIData
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-amber-950/40 border-amber-500/30 text-amber-300'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isLiveAPIData ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
            }`}
          />
          <span>
            {isLoading
              ? 'Syncing Open-Meteo API...'
              : isLiveAPIData
              ? 'LIVE OPEN-METEO • Model Grid'
              : 'DEMO / Fallback Mode'}
          </span>
          <span className="text-[10px] text-slate-400 font-mono border-l border-white/10 pl-2">
            {dataTimestamp}
          </span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifDropdownRef}>
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="relative p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-cyan-500/30 text-slate-300 hover:text-white transition-all shadow-sm"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {activeAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-md shadow-rose-950 animate-pulse">
                {activeAlerts.length}
              </span>
            )}
          </button>

          {notificationOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0b1328] border border-white/10 shadow-2xl backdrop-blur-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-semibold text-white">
                    Active Smart Alerts ({activeAlerts.length})
                  </span>
                </div>
                <Link
                  to="/alerts"
                  onClick={() => setNotificationOpen(false)}
                  className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                >
                  Configure <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              <div className="mt-3 space-y-2.5 max-h-80 overflow-y-auto">
                {activeAlerts.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                    No active hazard warnings in {currentCity.name}.
                  </div>
                ) : (
                  activeAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-3 rounded-xl bg-slate-900/90 border border-white/10 hover:border-cyan-500/30 text-xs transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                          <AlertTriangle
                            className={`w-3.5 h-3.5 shrink-0 ${
                              alert.severity === 'critical'
                                ? 'text-rose-400'
                                : alert.severity === 'high'
                                ? 'text-orange-400'
                                : 'text-amber-400'
                            }`}
                          />
                          <span>{alert.title}</span>
                        </div>
                        <button
                          onClick={() => dismissAlert(alert.id)}
                          className="text-slate-400 hover:text-white p-0.5 rounded"
                          title="Dismiss"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="mt-1 text-slate-300 text-[11px] leading-relaxed">
                        {alert.message}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-mono">{alert.timestamp}</span>
                        <span className="text-cyan-400 font-medium">
                          {alert.category}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Health Profile / Settings Button */}
        <button
          onClick={() => setProfileModalOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-cyan-500/30 text-slate-200 text-xs font-medium transition-all"
        >
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Health Profile</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
        </button>
      </div>

      {/* Health Profile Modal */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-[#0b1328] border border-white/10 p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">
                    Personal Sensitivity Profile
                  </h3>
                  <p className="text-xs text-slate-400">
                    Customizes AI health insights & alert thresholds
                  </p>
                </div>
              </div>
              <button
                onClick={() => setProfileModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              {[
                {
                  key: 'asthma' as const,
                  label: 'Asthma / Respiratory Sensitivity',
                  desc: 'Triggers earlier warnings for PM2.5 and Ozone spikes.',
                },
                {
                  key: 'runner' as const,
                  label: 'Outdoor Athlete / Endurance Runner',
                  desc: 'Calculates high-ventilation lung particulate dose.',
                },
                {
                  key: 'children' as const,
                  label: 'Children in Household',
                  desc: 'Applies stricter WHO air quality safety factors.',
                },
                {
                  key: 'elderly' as const,
                  label: 'Senior Family Members',
                  desc: 'Provides cardiac and pulmonary stress advisories.',
                },
                {
                  key: 'heartCondition' as const,
                  label: 'Cardiovascular Vulnerability',
                  desc: 'Alerts on elevated Carbon Monoxide and ultrafine soot.',
                },
              ].map((item) => (
                <div
                  key={item.key}
                  onClick={() => toggleSensitivitySetting(item.key)}
                  className={`flex items-start justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    sensitivityProfile[item.key]
                      ? 'bg-cyan-500/10 border-cyan-500/30'
                      : 'bg-slate-900/60 border-white/5 opacity-70'
                  }`}
                >
                  <div className="pr-3">
                    <p className="text-xs font-medium text-slate-200">
                      {item.label}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition-colors ${
                      sensitivityProfile[item.key]
                        ? 'bg-cyan-500 border-cyan-400 text-slate-950 font-bold'
                        : 'border-slate-600 bg-slate-800'
                    }`}
                  >
                    {sensitivityProfile[item.key] && '✓'}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setProfileModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors"
              >
                Save & Apply Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
