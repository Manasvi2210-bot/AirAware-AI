import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  MapPin,
  Bot,
  BellRing,
  BarChart3,
  Wind,
  ShieldCheck,
  Radio,
  X,
  Sparkles,
} from 'lucide-react';
import { useCity } from '../../context/CityContext';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { activeAlerts } = useCity();

  const navItems = [
    { name: 'Overview', to: '/', icon: LayoutDashboard },
    { name: 'Forecast', to: '/forecast', icon: CalendarDays },
    { name: 'Pollution Map', to: '/map', icon: MapPin },
    { name: 'AI Assistant', to: '/assistant', icon: Bot, badge: 'AI' },
    {
      name: 'Smart Alerts',
      to: '/alerts',
      icon: BellRing,
      count: activeAlerts.length > 0 ? activeAlerts.length : undefined,
    },
    { name: 'Analytics', to: '/analytics', icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 flex flex-col bg-[#070d1d]/90 backdrop-blur-2xl border-r border-white/10 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-500 shadow-lg shadow-cyan-500/25">
              <Wind className="w-6 h-6 text-slate-950 stroke-[2.2]" />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-300 border-2 border-slate-900 animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                  AirAware
                </span>
                <span className="text-xs font-black px-1.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  AI
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 tracking-wide mt-0.5">
                Breathe Smarter. Live Healthier.
              </p>
            </div>
          </div>

          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Intelligence Suite
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `relative flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/15 via-teal-500/10 to-transparent text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-950/50'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-5 h-5 transition-colors ${
                          isActive
                            ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]'
                            : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          {item.badge}
                        </span>
                      )}
                      {item.count !== undefined && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                          {item.count}
                        </span>
                      )}
                    </div>

                    {/* Active vertical accent pill on the left */}
                    {isActive && (
                      <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-cyan-400 shadow-[0_0_10px_#06b6d4]" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Live Network & Model Label Footer */}
        <div className="p-4 m-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Atmospheric Model
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
              <Radio className="w-3 h-3 animate-pulse" />
              Open-Meteo API
            </span>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950/60 border border-white/5">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="text-[11px] leading-tight">
              <p className="font-semibold text-slate-200">NUMERICAL CHEMISTRY</p>
              <p className="text-slate-400 text-[10px] mt-0.5">CAMS / Copernicus Model Grid</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
