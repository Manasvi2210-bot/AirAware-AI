import type { CityData, MonitoringStation } from '../types/airQuality';
import { DEMO_CITIES } from '../data/mockData';
import { openMeteoService, SUPPORTED_CITIES } from './openMeteoService';

/**
 * AirAware AI Data Service Layer
 * 
 * Bridges Open-Meteo live API integration and mock fallback layers.
 * Provides live numerical atmospheric chemistry and weather data.
 */

export const airQualityService = {
  /**
   * Get all supported cities with coordinates
   */
  async getCities(): Promise<CityData[]> {
    return [...DEMO_CITIES];
  },

  /**
   * Get complete live air quality and weather profile for a specific city from Open-Meteo
   */
  async getCityById(cityId: string, forceLive = true): Promise<CityData> {
    const cityConfig = SUPPORTED_CITIES.find(c => c.id === cityId) || SUPPORTED_CITIES[0];

    if (forceLive) {
      try {
        return await openMeteoService.getLiveCityData(cityConfig);
      } catch (err) {
        console.warn(`[AirAware Service] Live Open-Meteo fetch failed for ${cityId}:`, err);
        // Fall back to baseline demo data with clear labeling
        const fallback = DEMO_CITIES.find(c => c.id === cityId) || DEMO_CITIES[0];
        const cloned: CityData = JSON.parse(JSON.stringify(fallback));
        cloned.dataSource = 'demo-fallback';
        cloned.dataTimestamp = `Offline Baseline (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`;
        cloned.modelAttribution = 'Offline Fallback (Live API Unreachable)';
        return cloned;
      }
    }

    const city = DEMO_CITIES.find(c => c.id === cityId) || DEMO_CITIES[0];
    return JSON.parse(JSON.stringify(city));
  },

  /**
   * Get monitoring stations for a city
   */
  async getStationsByCity(cityId: string): Promise<MonitoringStation[]> {
    const city = DEMO_CITIES.find(c => c.id === cityId);
    return city ? [...city.stations] : [];
  },

  /**
   * Simulated AI assistant responses (offline prototype mode without API keys)
   */
  async queryAIAssistant(
    userQuery: string,
    city: CityData,
    userProfile: { asthma: boolean; runner: boolean; children: boolean }
  ): Promise<string> {
    // Artificial response delay for realistic UI feeling
    await new Promise(resolve => setTimeout(resolve, 450));

    const queryLower = userQuery.toLowerCase();
    const aqi = city.currentAQI;
    const cat = city.category;
    const cityName = city.name;
    const pm25 = city.pollutants.pm25.value;
    const isLive = city.dataSource === 'open-meteo-live';
    const sourceLabel = isLive ? 'Live Open-Meteo Atmospheric Chemistry Model' : 'DEMO baseline';

    if (queryLower.includes('run') || queryLower.includes('jog') || queryLower.includes('exercise') || queryLower.includes('outdoor')) {
      if (aqi <= 50) {
        return `🌿 **Workout Assessment for ${cityName} (${sourceLabel}):**\n\nThe current model AQI is **${aqi} (${cat})** with PM2.5 at **${pm25} µg/m³**. Outdoor aerobic exercise is safe and encouraged. Atmospheric dispersion is healthy, meaning minimal airway stress.`;
      } else if (aqi <= 100) {
        return `⚠️ **Moderate Workout Advisory for ${cityName}:**\n\nCurrent model AQI is **${aqi} (${cat})**. For general runners, light to moderate workouts are fine. ${userProfile.asthma || userProfile.runner ? 'Because you indicated respiratory sensitivity / intense cardio, consider keeping workouts under 45 minutes or running earlier in the morning when vehicular NO₂ is lower.' : 'Keep hydration high and avoid sprint intervals along main traffic arteries.'}`;
      } else {
        return `🛑 **Exercise Warning for ${cityName}:**\n\nOutdoor exercise is **not recommended** right now. The model AQI is **${aqi} (${cat})** with PM2.5 at **${pm25} µg/m³**. Heavy breathing during running significantly multiplies particulate deposition into deep alveoli. We recommend treadmill or indoor cross-training with indoor HEPA air filtration active.`;
      }
    }

    if (queryLower.includes('pm2.5') || queryLower.includes('pm10') || queryLower.includes('difference') || queryLower.includes('pollutant')) {
      return `🔬 **Particulate Matter Breakdown (Open-Meteo Model):**\n\n- **PM2.5** (< 2.5 micrometers): Ultra-fine particles from combustion, smoke, and industrial aerosols. They penetrate directly into pulmonary alveoli.\n- **PM10** (< 10 micrometers): Coarser dust, pollen, and pulverized road soot caught in the upper respiratory tract.\n\nIn **${cityName}** right now, **PM2.5 is ${pm25} µg/m³** (WHO guideline benchmark is 5 µg/m³).`;
    }

    if (queryLower.includes('window') || queryLower.includes('ventilate') || queryLower.includes('purifier') || queryLower.includes('inside')) {
      if (aqi <= 50) {
        return `🪟 **Ventilation Advised for ${cityName}:**\n\nOptimal time to open windows! The outdoor AQI is **${aqi} (Good)** with comfortable humidity (${city.weather.humidity}%). Natural ventilation will lower indoor CO₂ and refresh indoor air.`;
      } else {
        return `🛡️ **Keep Windows Sealed in ${cityName}:**\n\nWith an AQI of **${aqi} (${cat})**, opening windows will rapidly elevate indoor particulate contamination. Keep windows closed and run your HEPA air purifier on medium/high speed.`;
      }
    }

    if (queryLower.includes('mask') || queryLower.includes('n95') || queryLower.includes('protection')) {
      if (aqi <= 100) {
        return `🎭 Standard cloth or surgical masks are not strictly necessary today in **${cityName}** (AQI ${aqi}), though sensitive individuals experiencing mild irritation near dusty traffic roads may benefit from standard particulate protection.`;
      } else {
        return `😷 **Respirator Advisory for ${cityName}:**\n\nBecause the model AQI is **${aqi} (${cat})**, standard surgical masks provide inadequate filtration against sub-micron PM2.5. We strongly suggest wearing a well-fitted **N95, KN95, or FFP2 respirator** if you spend extended time outdoors.`;
      }
    }

    return `📊 **Atmospheric Intelligence Summary for ${cityName} (${sourceLabel}):**\n\n- **Model AQI:** **${aqi} (${cat})**\n- **Dominant Pollutant:** ${city.dominantPollutant} (${pm25} µg/m³)\n- **Atmospheric Conditions:** ${city.weather.condition}, Temperature ${city.weather.temperature}°C, Wind ${city.weather.windSpeed} km/h ${city.weather.windDirection}\n- **Inversion Risk Score:** ${city.aiInsight.inversionRisk.score}/100 (${city.aiInsight.inversionRisk.level})\n\n*Health Guidance:* ${city.aiInsight.summary}\n\n*(Note: AI Copilot is running in offline prototype mode without external API keys).*`;
  },
};
