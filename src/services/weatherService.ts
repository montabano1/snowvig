import axios from 'axios';
import { Location, WeatherData } from '../types';

const API_KEY = import.meta.env.VITE_VISUAL_CROSSING_API_KEY;
const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

export const getWeatherForecast = async (
  location: Location,
  startDate: string,
  endDate: string
): Promise<WeatherData[]> => {
  try {
    console.log('Fetching weather for:', { location, startDate, endDate });
    
    const url = `${BASE_URL}/${location.lat},${location.lng}/${startDate}/${endDate}`;
    const response = await axios.get(url, {
      params: {
        key: API_KEY,
        unitGroup: 'us',
        include: 'hours',
        contentType: 'json',
      },
    });

    if (!response.data?.days?.[0]?.hours) {
      console.warn('Unexpected API response format:', response.data);
      return [];
    }

    const hourlyData = response.data.days[0].hours;
    console.log('Received hourly data:', hourlyData);

    return hourlyData.map((hour: any) => ({
      temperature: hour.temp,
      feelsLike: hour.feelslike,
      humidity: hour.humidity,
      windSpeed: hour.windspeed,
      conditions: hour.conditions,
      precipitationProbability: hour.precipprob,
      uvIndex: hour.uvindex,
    }));
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};
