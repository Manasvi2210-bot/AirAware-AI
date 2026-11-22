import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useCity } from '../context/CityContext';
import { SectionHeader } from '../components/common/SectionHeader';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { getAQIConfig } from '../utils/aqiUtils';
import type { MonitoringStation } from '../types/airQuality';
import {
  MapPin,
  Radio,
  Navigation,
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export const PollutionMapPage: React.FC = () => {
  const { currentCity } = useCity();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersGroupRef = useRef<any[]>([]);

  const [selectedStation, setSelectedStation] = useState<MonitoringStation | null>(
    currentCity.stations[0] || null
  );
  const [filterLayer, setFilterLayer] = useState<'all' | 'high-risk' | 'pm25'>('all');

  // Initialize or update Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Center map on current city coordinates
    const { lat, lng } = currentCity.coordinates;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 12,
        zoomControl: false,
        attributionControl: true,
      });

      // Add dark tile layer (CartoDB Dark Matter without API key)
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>',
          maxZoom: 19,
          subdomains: 'abcd',
        }
      ).addTo(map);

      mapInstanceRef.current = map;

      // Invalidate size on initial mount
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    } else {
      mapInstanceRef.current.setView([lat, lng], 12);
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 50);
    }

    const map = mapInstanceRef.current;

    // Clear previous markers
    markersGroupRef.current.forEach((layer) => {
      if (map) layer.remove();
    });
    markersGroupRef.current = [];

    // Filter stations
    const stationsToDisplay = currentCity.stations.filter((st) => {
      if (filterLayer === 'high-risk') return st.aqi > 100;
      return true;
    });

    // Add marker for each monitoring station
    stationsToDisplay.forEach((st) => {
      const config = getAQIConfig(st.aqi);

      // Create custom pulsing div icon
      const customIcon = L.divIcon({
        className: 'custom-station-pin',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px;">
            <div style="position: absolute; width: 32px; height: 32px; border-radius: 9999px; background-color: ${config.color}; opacity: 0.3;" class="beacon-ring"></div>
            <div style="width: 26px; height: 26px; border-radius: 9999px; background-color: #0b1328; border: 2.5px solid ${config.color}; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 12px ${config.color};">
              <span style="font-size: 10px; font-weight: 800; color: #fff;">${st.aqi}</span>
            </div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const marker = L.marker([st.lat, st.lng], { icon: customIcon }).addTo(map);

      const popupHtml = `
        <div style="font-family: inherit; min-width: 170px;">
          <div style="font-size: 12px; font-weight: 700; color: #f8fafc;">${st.name}</div>
          <div style="font-size: 10px; color: #38bdf8; margin-top: 2px;">Station Node (Simulated Overlay)</div>
          <div style="margin-top: 8px; display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 11px; color: #cbd5e1;">AQI: <strong style="color: ${config.color}; font-size: 13px;">${st.aqi}</strong></span>
            <span style="font-size: 10px; padding: 2px 6px; border-radius: 4px; background: rgba(255,255,255,0.08); color: #fff;">${st.category}</span>
          </div>
          <div style="margin-top: 6px; font-size: 10px; color: #94a3b8;">PM2.5: <strong style="color:#fff;">${st.pm25} µg/m³</strong> • ${st.lastUpdated}</div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        setSelectedStation(st);
      });

      markersGroupRef.current.push(marker);
    });

    return () => {
      // Keep map reference across re-renders
    };
  }, [currentCity, filterLayer]);

  // Clean up map instance when navigating away
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleSelectStation = (st: MonitoringStation) => {
    setSelectedStation(st);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([st.lat, st.lng], 13);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <SectionHeader
        title="Spatial Atmospheric Grid"
        subtitle={`Live Open-Meteo model coordinate (${currentCity.coordinates.lat.toFixed(2)}°, ${currentCity.coordinates.lng.toFixed(2)}°) with simulated ground validation nodes`}
        icon={<MapPin className="w-5 h-5" />}
        action={
          <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-900 border border-white/10">
            <button
              onClick={() => setFilterLayer('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterLayer === 'all'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Stations
            </button>
            <button
              onClick={() => setFilterLayer('high-risk')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterLayer === 'high-risk'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Elevated (&gt;100 AQI)
            </button>
          </div>
        }
      />

      {/* Map Layout: Left Map + Right Station Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Canvas Card */}
        <div className="lg:col-span-2 rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative bg-[#070d1a] h-[540px]">
          {/* Leaflet DOM container */}
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Map Top Floating Overlay Info */}
          <div className="absolute top-4 left-4 z-20 pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0b1328]/90 border border-white/10 backdrop-blur-md shadow-lg">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-white">
                Live Sensor Mesh • {currentCity.name}
              </span>
            </div>
          </div>

          {/* Bottom Floating Legend */}
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto z-20 pointer-events-none">
            <div className="p-3 rounded-2xl bg-[#0b1328]/95 border border-white/10 backdrop-blur-md shadow-xl text-xs space-y-1.5 pointer-events-auto">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                EPA AQI Color Classification
              </span>
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  0-50 Good
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  51-100 Mod
                </span>
                <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  101-150 USG
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  151+ Unhealthy
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Station Inspector Panel */}
        <div className="space-y-4">
          <GlassCard padding="md" className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Navigation className="w-4 h-4 text-cyan-400" /> Station Telemetry
              </h4>
              <span className="text-[11px] text-slate-400 font-mono">
                {currentCity.stations.length} Online
              </span>
            </div>

            {selectedStation ? (
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-white">
                      {selectedStation.name}
                    </h5>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Coordinates: {selectedStation.lat.toFixed(4)}, {selectedStation.lng.toFixed(4)}
                    </p>
                  </div>
                  <Badge category={selectedStation.category} size="sm">
                    AQI {selectedStation.aqi}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-xs">
                  <div className="p-2 rounded-xl bg-slate-900 border border-white/5">
                    <span className="text-[10px] text-slate-400">PM2.5 Sensor</span>
                    <p className="font-bold text-white mt-0.5">{selectedStation.pm25} µg/m³</p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-white/5">
                    <span className="text-[10px] text-slate-400">PM10 Sensor</span>
                    <p className="font-bold text-white mt-0.5">{selectedStation.pm10} µg/m³</p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-white/5">
                    <span className="text-[10px] text-slate-400">NO₂ Sensor</span>
                    <p className="font-bold text-white mt-0.5">{selectedStation.no2} ppb</p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-white/5">
                    <span className="text-[10px] text-slate-400">O₃ Sensor</span>
                    <p className="font-bold text-white mt-0.5">{selectedStation.o3} ppb</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Status: <strong className="text-emerald-400">Calibrated</strong></span>
                  <span>Updated: {selectedStation.lastUpdated}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Select a station marker to inspect.</p>
            )}
          </GlassCard>

          {/* Quick Station Selector List */}
          <GlassCard padding="md" className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Neighborhood Stations
            </span>
            <div className="space-y-1.5 max-h-56 overflow-y-auto">
              {currentCity.stations.map((st) => {
                const isSelected = selectedStation?.id === st.id;
                const config = getAQIConfig(st.aqi);
                return (
                  <button
                    key={st.id}
                    onClick={() => handleSelectStation(st)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all ${
                      isSelected
                        ? 'bg-cyan-500/15 border border-cyan-500/40 text-white'
                        : 'bg-slate-950/40 hover:bg-slate-800/60 border border-white/5 text-slate-300'
                    }`}
                  >
                    <div>
                      <p className="font-semibold">{st.name}</p>
                      <p className="text-[10px] text-slate-400">Dominant: {st.dominantPollutant}</p>
                    </div>
                    <span
                      className="font-bold px-2 py-0.5 rounded text-[11px]"
                      style={{
                        backgroundColor: config.bgColor,
                        color: config.color,
                      }}
                    >
                      {st.aqi}
                    </span>
                  </button>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
};
