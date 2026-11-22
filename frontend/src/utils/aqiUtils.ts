import type { AQICategory } from '../types/airQuality';

export interface AQILevelConfig {
  label: AQICategory;
  range: [number, number];
  color: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  glowColor: string;
  description: string;
  healthImplications: string;
  cautionaryStatement: string;
}

export const AQI_LEVELS: Record<AQICategory, AQILevelConfig> = {
  'Good': {
    label: 'Good',
    range: [0, 50],
    color: '#10b981', // emerald-500
    textColor: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    description: 'Air quality is considered satisfactory, and air pollution poses little or no risk.',
    healthImplications: 'Air quality is ideal for all individuals. Perfect day for outdoor sports and activities.',
    cautionaryStatement: 'None required. Enjoy fresh outdoor air.',
  },
  'Moderate': {
    label: 'Moderate',
    range: [51, 100],
    color: '#f59e0b', // amber-500
    textColor: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    description: 'Air quality is acceptable; however, some pollutants may be a moderate health concern for a very small number of unusually sensitive individuals.',
    healthImplications: 'Acceptable for most people. Sensitive individuals may experience mild respiratory symptoms.',
    cautionaryStatement: 'Unusually sensitive people should consider reducing prolonged or heavy outdoor exertion.',
  },
  'Unhealthy for Sensitive Groups': {
    label: 'Unhealthy for Sensitive Groups',
    range: [101, 150],
    color: '#f97316', // orange-500
    textColor: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    glowColor: 'rgba(249, 115, 22, 0.4)',
    description: 'Members of sensitive groups may experience health effects. The general public is not likely to be affected.',
    healthImplications: 'Increased likelihood of respiratory symptoms in people with lung disease, asthma, older adults, and children.',
    cautionaryStatement: 'People with lung disease, older adults, and children should reduce prolonged or heavy outdoor exertion.',
  },
  'Unhealthy': {
    label: 'Unhealthy',
    range: [151, 200],
    color: '#ef4444', // red-500
    textColor: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    description: 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.',
    healthImplications: 'Everyone may experience irritation. Active children and adults with respiratory diseases should avoid outdoor activity.',
    cautionaryStatement: 'Wear an N95 mask outdoors, keep windows closed, and run indoor HEPA air purifiers.',
  },
  'Very Unhealthy': {
    label: 'Very Unhealthy',
    range: [201, 300],
    color: '#a855f7', // purple-500
    textColor: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    description: 'Health alert: everyone may experience more serious health effects.',
    healthImplications: 'Significant increase in respiratory and cardiovascular symptoms across the entire population.',
    cautionaryStatement: 'Avoid all outdoor physical activity. Keep indoor air sealed with air cleaners on maximum speed.',
  },
  'Hazardous': {
    label: 'Hazardous',
    range: [301, 500],
    color: '#e11d48', // rose-600
    textColor: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30',
    glowColor: 'rgba(225, 29, 72, 0.4)',
    description: 'Health warning of emergency conditions. The entire population is more likely to be affected.',
    healthImplications: 'Severe health hazard. Emergency protective measures needed.',
    cautionaryStatement: 'Remain indoors with filtered air. Do not open windows or exercise outside.',
  },
};

export function getAQICategory(aqi: number): AQICategory {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

export function getAQIConfig(aqi: number): AQILevelConfig {
  return AQI_LEVELS[getAQICategory(aqi)];
}

export function formatAQI(value: number): string {
  return Math.round(value).toString();
}
