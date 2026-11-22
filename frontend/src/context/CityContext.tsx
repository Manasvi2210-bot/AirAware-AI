import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { CityData, SmartAlert } from '../types/airQuality';
import { DEMO_CITIES } from '../data/mockData';
import { openMeteoService, SUPPORTED_CITIES } from '../services/openMeteoService';

interface SensitivityProfile {
  asthma: boolean;
  runner: boolean;
  children: boolean;
  elderly: boolean;
  heartCondition: boolean;
}

interface CityContextType {
  selectedCityId: string;
  setSelectedCityId: (id: string) => void;
  currentCity: CityData;
  allCities: CityData[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  refetchCityData: () => Promise<void>;
  isLiveAPIData: boolean;
  dataTimestamp: string;
  activeAlerts: SmartAlert[];
  dismissAlert: (alertId: string) => void;
  addCustomAlert: (alert: Omit<SmartAlert, 'id' | 'timestamp' | 'active'>) => void;
  triggerSimulatedSpike: () => void;
  isSimulatedSpikeActive: boolean;
  sensitivityProfile: SensitivityProfile;
  toggleSensitivitySetting: (key: keyof SensitivityProfile) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  thresholdPM25: number;
  setThresholdPM25: (val: number) => void;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export const CityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCityId, setSelectedCityId] = useState<string>('san-francisco');
  const [cityData, setCityData] = useState<CityData>(() => {
    return DEMO_CITIES.find(c => c.id === 'san-francisco') || DEMO_CITIES[0];
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLiveAPIData, setIsLiveAPIData] = useState<boolean>(false);
  const [dataTimestamp, setDataTimestamp] = useState<string>('Connecting to Open-Meteo...');

  const [isSimulatedSpikeActive, setIsSimulatedSpikeActive] = useState(false);
  const [dismissedAlertIds, setDismissedAlertIds] = useState<string[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [thresholdPM25, setThresholdPM25] = useState(35);
  const [userCreatedAlerts, setUserCreatedAlerts] = useState<SmartAlert[]>([]);

  const [sensitivityProfile, setSensitivityProfile] = useState<SensitivityProfile>({
    asthma: true,
    runner: true,
    children: false,
    elderly: false,
    heartCondition: false,
  });

  const toggleSensitivitySetting = (key: keyof SensitivityProfile) => {
    setSensitivityProfile(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Fetch real data from Open-Meteo for the selected city
  const fetchCityData = useCallback(async (cityId: string) => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage(null);

    const cityConfig = SUPPORTED_CITIES.find(c => c.id === cityId) || SUPPORTED_CITIES[0];

    try {
      const liveData = await openMeteoService.getLiveCityData(cityConfig);
      setCityData(liveData);
      setIsLiveAPIData(true);
      setDataTimestamp(liveData.dataTimestamp || new Date().toLocaleTimeString());
      setIsError(false);
    } catch (err: any) {
      console.warn('[CityContext] Open-Meteo fetch failed:', err);
      setIsError(true);
      setErrorMessage(
        err?.message || 'Could not connect to Open-Meteo API. Check internet connectivity.'
      );
      // Fallback to baseline demo data but mark as not live
      const fallback = DEMO_CITIES.find(c => c.id === cityId) || DEMO_CITIES[0];
      const cloned: CityData = JSON.parse(JSON.stringify(fallback));
      cloned.dataSource = 'demo-fallback';
      cloned.dataTimestamp = `Offline Baseline (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`;
      cloned.modelAttribution = 'Offline Fallback Cache (Live API Request Failed)';
      setCityData(cloned);
      setIsLiveAPIData(false);
      setDataTimestamp('Offline Cache');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Re-fetch when selected city changes
  useEffect(() => {
    fetchCityData(selectedCityId);
  }, [selectedCityId, fetchCityData]);

  const refetchCityData = useCallback(async () => {
    await fetchCityData(selectedCityId);
  }, [selectedCityId, fetchCityData]);

  // Handle simulated spike if active
  const currentCity = useMemo<CityData>(() => {
    if (!isSimulatedSpikeActive) {
      return cityData;
    }

    const cloned: CityData = JSON.parse(JSON.stringify(cityData));
    cloned.currentAQI = Math.min(350, cityData.currentAQI + 155);
    cloned.category = 'Hazardous';
    cloned.pollutants.pm25.value = Math.round((cloned.pollutants.pm25.value * 3.8) * 10) / 10;
    cloned.pollutants.pm25.status = 'Hazardous';
    cloned.aiInsight.riskLevel = 'Severe';
    cloned.aiInsight.summary = `[SIMULATION ACTIVE] Rapid surface thermal inversion triggered in ${cloned.name}. AQI spiked to ${cloned.currentAQI} with PM2.5 reaching ${cloned.pollutants.pm25.value} µg/m³.`;
    return cloned;
  }, [cityData, isSimulatedSpikeActive]);

  const activeAlerts = useMemo<SmartAlert[]>(() => {
    const list = [...userCreatedAlerts, ...currentCity.alerts];
    
    if (isSimulatedSpikeActive) {
      list.unshift({
        id: 'simulated-spike-alert',
        title: '⚠️ CRITICAL: Automated Air Toxicity Spike (Simulation)',
        severity: 'critical',
        category: 'Diagnostic Simulation',
        message: `Experimental sensor trigger: PM2.5 jumped to ${currentCity.pollutants.pm25.value} µg/m³ in ${currentCity.name}.`,
        timestamp: 'Just now',
        active: true,
        recommendation: 'Immediate indoor sheltering advised. N95 respirators required for outdoor transit.',
      });
    }

    return list.filter(alert => !dismissedAlertIds.includes(alert.id));
  }, [userCreatedAlerts, currentCity.alerts, isSimulatedSpikeActive, currentCity.name, currentCity.pollutants.pm25.value, dismissedAlertIds]);

  const dismissAlert = (alertId: string) => {
    setDismissedAlertIds(prev => [...prev, alertId]);
  };

  const addCustomAlert = (alertData: Omit<SmartAlert, 'id' | 'timestamp' | 'active'>) => {
    const newAlert: SmartAlert = {
      ...alertData,
      id: `custom-alert-${Date.now()}`,
      timestamp: 'Just now',
      active: true,
    };
    setUserCreatedAlerts(prev => [newAlert, ...prev]);
  };

  const triggerSimulatedSpike = () => {
    setIsSimulatedSpikeActive(prev => !prev);
  };

  return (
    <CityContext.Provider
      value={{
        selectedCityId,
        setSelectedCityId,
        currentCity,
        allCities: DEMO_CITIES,
        isLoading,
        isError,
        errorMessage,
        refetchCityData,
        isLiveAPIData,
        dataTimestamp,
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
      }}
    >
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
};
