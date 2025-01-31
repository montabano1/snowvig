export interface Location {
  name: string;
  lat: number;
  lng: number;
}

export interface WeatherData {
  temperature: number;
  precipitationProbability: number;
  windSpeed: number;
  uvIndex: number;
  time: string;
}

export interface EventScore {
  score: number;
  conditions: string[];
  recommendations: Array<{
    icon: JSX.Element;
    title: string;
    description: string;
  }>;
}
