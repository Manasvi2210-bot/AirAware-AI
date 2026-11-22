export type AQICategory = 
  | 'Good'
  | 'Moderate'
  | 'Unhealthy for Sensitive Groups'
  | 'Unhealthy'
  | 'Very Unhealthy'
  | 'Hazardous';

export interface PollutantDetail {
  code: 'pm25' | 'pm10' | 'no2' | 'o3' | 'so2' | 'co';
  name: string;
  chemicalFormula: string;
  value: number;
  unit: string;
  whoGuideline: number;
  epaBreakpoint: number;
  status: AQICategory;
  description: string;
  healthRisk: string;
}

export interface WeatherData {
  temperature: number; // Celsius
  condition: string;
  humidity: number; // %
  windSpeed: number; // km/h
  windDirection: string;
  uvIndex: number;
  pressure: number; // hPa
  dewPoint: number; // Celsius
  visibility: number; // km
}

export interface HourlyAQIPoint {
  time: string;
  hour: number;
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  category: AQICategory;
}

export interface DailyForecast {
  date: string;
  dayName: string;
  aqi: number;
  category: AQICategory;
  primaryPollutant: string;
  minTemp: number;
  maxTemp: number;
  condition: string;
  confidence: number; // percentage
  recommendation: string;
}

export interface MonitoringStation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  aqi: number;
  category: AQICategory;
  dominantPollutant: string;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  lastUpdated: string;
  status: 'online' | 'maintenance' | 'offline';
}

export interface SmartAlert {
  id: string;
  title: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  message: string;
  timestamp: string;
  category: string;
  pollutant?: string;
  active: boolean;
  recommendation: string;
}

export interface AIInsight {
  summary: string;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  keyDrivers: string[];
  recommendationGeneral: string;
  recommendationSensitive: string;
  activityAdvise: {
    jogging: 'Ideal' | 'Moderate' | 'Avoid';
    cycling: 'Ideal' | 'Moderate' | 'Avoid';
    childrenOutdoor: 'Safe' | 'Caution' | 'Stay Indoors';
    windowsOpen: 'Recommended' | 'Keep Closed' | 'Purifier On';
  };
  inversionRisk: {
    score: number; // 0-100
    level: 'Low' | 'Moderate' | 'High' | 'Severe';
    factors: string;
  };
}

export interface CityData {
  id: string;
  name: string;
  country: string;
  flag: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  currentAQI: number;
  category: AQICategory;
  dominantPollutant: string;
  pollutants: {
    pm25: PollutantDetail;
    pm10: PollutantDetail;
    no2: PollutantDetail;
    o3: PollutantDetail;
    so2: PollutantDetail;
    co: PollutantDetail;
  };
  weather: WeatherData;
  hourlyTrend: HourlyAQIPoint[];
  forecast7Day: DailyForecast[];
  stations: MonitoringStation[];
  alerts: SmartAlert[];
  aiInsight: AIInsight;
  dataSource?: 'open-meteo-live' | 'demo-fallback';
  dataTimestamp?: string;
  europeanAQI?: number;
  usAQI?: number;
  modelAttribution?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  suggestions?: string[];
  metricsContext?: {
    city: string;
    aqi: number;
    category: string;
  };
}
