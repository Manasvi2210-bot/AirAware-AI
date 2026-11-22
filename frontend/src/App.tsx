import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CityProvider } from './context/CityContext';
import { AppLayout } from './components/layout/AppLayout';
import { OverviewPage } from './pages/OverviewPage';
import { ForecastPage } from './pages/ForecastPage';
import { PollutionMapPage } from './pages/PollutionMapPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { SmartAlertsPage } from './pages/SmartAlertsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { Wind, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-4">
    <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
      <Wind className="w-8 h-8" />
    </div>
    <h2 className="text-2xl font-bold text-white">Atmospheric Node Not Found</h2>
    <p className="text-sm text-slate-400 max-w-sm">
      The intelligence view you requested does not exist or has been relocated in the sensor mesh.
    </p>
    <Link
      to="/"
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>Return to Overview</span>
    </Link>
  </div>
);

export function App() {
  return (
    <CityProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<OverviewPage />} />
            <Route path="overview" element={<Navigate to="/" replace />} />
            <Route path="forecast" element={<ForecastPage />} />
            <Route path="map" element={<PollutionMapPage />} />
            <Route path="assistant" element={<AIAssistantPage />} />
            <Route path="alerts" element={<SmartAlertsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CityProvider>
  );
}

export default App;
