import { EventScore, WeatherData } from '../types';
import { 
  WbSunny as SunIcon,
  Umbrella as UmbrellaIcon,
  AcUnit as SnowIcon,
  Whatshot as HeatIcon,
  Air as WindIcon,
} from '@mui/icons-material';
import React from 'react';

export const calculateEventScore = (weather: WeatherData): EventScore => {
  console.log('Calculating event score for weather:', weather);

  // Initialize score at 100 and deduct based on conditions
  let score = 100;
  const conditions: string[] = [];
  const recommendations: Array<{ icon: JSX.Element; title: string; description: string }> = [];

  // Temperature checks
  if (weather.temperature < 32) {
    score -= 30;
    conditions.push('Very cold temperatures');
    recommendations.push({
      icon: React.createElement(SnowIcon),
      title: 'Bundle Up',
      description: 'Wear warm, layered clothing and bring hand warmers.',
    });
  } else if (weather.temperature < 50) {
    score -= 15;
    conditions.push('Cool temperatures');
    recommendations.push({
      icon: React.createElement(SnowIcon),
      title: 'Dress Warmly',
      description: 'Bring a jacket and consider layering.',
    });
  } else if (weather.temperature > 85) {
    score -= 20;
    conditions.push('Hot temperatures');
    recommendations.push({
      icon: React.createElement(HeatIcon),
      title: 'Stay Cool',
      description: 'Bring water and plan for shade breaks.',
    });
  }

  // Precipitation checks
  if (weather.precipitationProbability > 70) {
    score -= 40;
    conditions.push('High chance of precipitation');
    recommendations.push({
      icon: React.createElement(UmbrellaIcon),
      title: 'Rain Protection',
      description: 'Bring umbrellas and waterproof gear.',
    });
  } else if (weather.precipitationProbability > 30) {
    score -= 20;
    conditions.push('Moderate chance of precipitation');
    recommendations.push({
      icon: React.createElement(UmbrellaIcon),
      title: 'Rain Possible',
      description: 'Consider bringing rain gear just in case.',
    });
  }

  // Wind checks
  if (weather.windSpeed > 20) {
    score -= 25;
    conditions.push('High winds');
    recommendations.push({
      icon: React.createElement(WindIcon),
      title: 'Wind Protection',
      description: 'Secure loose items and consider wind protection.',
    });
  } else if (weather.windSpeed > 10) {
    score -= 10;
    conditions.push('Moderate winds');
    recommendations.push({
      icon: React.createElement(WindIcon),
      title: 'Light Wind',
      description: 'Be aware of light wind conditions.',
    });
  }

  // UV Index checks
  if (weather.uvIndex > 7) {
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

  console.log('Calculated score:', {
    score,
    conditions,
    recommendations
  });

  return {
    score,
    conditions,
    recommendations
  };
};
