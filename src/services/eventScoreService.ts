import { EventScore, WeatherData } from '../types';
import { 
  WbSunny as SunIcon,
  Umbrella as UmbrellaIcon,
  AcUnit as SnowIcon,
  Whatshot as HeatIcon,
  Air as WindIcon,
} from '@mui/icons-material';
import React from 'react';

const calculateDayStats = (weatherData: WeatherData[]) => {
  const dayHours = weatherData.filter(data => {
    const hour = parseInt(data.time.split('T')[1].split(':')[0]);
    return hour >= 6 && hour <= 20; // Only consider 6 AM to 8 PM
  });

  if (dayHours.length === 0) return null;

  return {
    avgTemp: dayHours.reduce((sum, data) => sum + data.temperature, 0) / dayHours.length,
    maxTemp: Math.max(...dayHours.map(data => data.temperature)),
    minTemp: Math.min(...dayHours.map(data => data.temperature)),
    maxPrecipProb: Math.max(...dayHours.map(data => data.precipitationProbability)),
    avgWindSpeed: dayHours.reduce((sum, data) => sum + data.windSpeed, 0) / dayHours.length,
    maxWindSpeed: Math.max(...dayHours.map(data => data.windSpeed)),
    maxUV: Math.max(...dayHours.map(data => data.uvIndex)),
  };
};

export const calculateEventScore = (weatherData: WeatherData[]): EventScore => {
  const stats = calculateDayStats(weatherData);
  if (!stats) return { score: 0, conditions: ['No daytime data available'], recommendations: [] };

  console.log('Calculating event score for day stats:', stats);

  // Initialize score at 100 and deduct based on conditions
  let score = 100;
  const conditions: string[] = [];
  const recommendations: Array<{ icon: JSX.Element; title: string; description: string }> = [];

  // Temperature checks
  if (stats.minTemp < 32) {
    score -= 30;
    conditions.push('Very cold temperatures');
    recommendations.push({
      icon: React.createElement(SnowIcon),
      title: 'Bundle Up',
      description: 'Wear warm, layered clothing and bring hand warmers.',
    });
  } else if (stats.avgTemp < 50) {
    score -= 15;
    conditions.push('Cool temperatures');
    recommendations.push({
      icon: React.createElement(SnowIcon),
      title: 'Dress Warmly',
      description: 'Bring a jacket and consider layering.',
    });
  } else if (stats.maxTemp > 85) {
    score -= 20;
    conditions.push('Hot temperatures');
    recommendations.push({
      icon: React.createElement(HeatIcon),
      title: 'Stay Cool',
      description: 'Bring water and plan for shade breaks.',
    });
  }

  // Precipitation checks
  if (stats.maxPrecipProb > 70) {
    score -= 40;
    conditions.push('High chance of precipitation');
    recommendations.push({
      icon: React.createElement(UmbrellaIcon),
      title: 'Rain Protection',
      description: 'Bring umbrellas and waterproof gear.',
    });
  } else if (stats.maxPrecipProb > 30) {
    score -= 20;
    conditions.push('Moderate chance of precipitation');
    recommendations.push({
      icon: React.createElement(UmbrellaIcon),
      title: 'Rain Possible',
      description: 'Consider bringing rain gear just in case.',
    });
  }

  // Wind checks
  if (stats.maxWindSpeed > 20) {
    score -= 25;
    conditions.push('High winds');
    recommendations.push({
      icon: React.createElement(WindIcon),
      title: 'Wind Protection',
      description: 'Secure loose items and consider wind protection.',
    });
  } else if (stats.avgWindSpeed > 10) {
    score -= 10;
    conditions.push('Moderate winds');
    recommendations.push({
      icon: React.createElement(WindIcon),
      title: 'Light Wind',
      description: 'Be aware of light wind conditions.',
    });
  }

  // UV Index checks
  if (stats.maxUV > 7) {
    score -= 15;
    conditions.push('High UV index');
    recommendations.push({
      icon: React.createElement(SunIcon),
      title: 'Sun Protection',
      description: 'Wear sunscreen and bring sun protection.',
    });
  }

  // Ensure score doesn't go below 0
  score = Math.max(0, score);

  return {
    score,
    conditions,
    recommendations,
  };
};
