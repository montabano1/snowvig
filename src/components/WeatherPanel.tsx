import React from 'react';
import { Box, Typography } from '@mui/material';
import { WeatherGraph } from './WeatherGraph';
import { WeatherCardLayout } from './WeatherCardLayout';
import { EventScoreCard } from './EventScoreCard';
import { WeatherSkeleton } from './WeatherSkeleton';
import { WeatherData, EventScore } from '../types';
import { format } from 'date-fns';
import DayCards from './DayCards';

interface WeatherPanelProps {
  date: Date;
  dates: Date[];
  onDateSelect: (date: Date) => void;
  isLoading: boolean;
  weatherData: { [key: string]: WeatherData[] };
  score: EventScore | null;
  location: string;
  eventScores: { [key: string]: EventScore };
}

export const WeatherPanel: React.FC<WeatherPanelProps> = ({
  date,
  dates,
  onDateSelect,
  isLoading,
  weatherData,
  score,
  location,
  eventScores,
}) => {
  const dayOfWeek = format(date, 'EEEE');
  const monthAndDay = format(date, 'MMMM d');
  const title = `${dayOfWeek}, ${monthAndDay}`;

  const timeLabels = Array.from({ length: 24 }, (_, i) => 
    format(new Date().setHours(i), 'ha')
  );

  if (isLoading) {
    return <WeatherSkeleton day={title} />;
  }

  const dateStr = format(date, 'yyyy-MM-dd');
  const currentDayWeather = weatherData[dateStr] || [];

  if (!weatherData || Object.keys(weatherData).length === 0) {
    return (
      <Box sx={{ 
        p: 3, 
        bgcolor: 'background.paper', 
        borderRadius: 1,
        textAlign: 'center',
        minHeight: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography variant="body1" color="text.secondary">
          No weather data available for {title}
        </Typography>
      </Box>
    );
  }

  if (!score) {
    return (
      <Box sx={{ 
        p: 3, 
        bgcolor: 'background.paper', 
        borderRadius: 1,
        textAlign: 'center',
        minHeight: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography variant="body1" color="text.secondary">
          Unable to calculate score for {title}
        </Typography>
      </Box>
    );
  }

  return (
    <WeatherCardLayout
      title={title}
      location={location}
      dateSelector={
        <DayCards
          dates={dates}
          selectedDate={date}
          scores={eventScores}
          weatherData={weatherData}
          onDateSelect={onDateSelect}
        />
      }
      graph={<WeatherGraph weatherData={currentDayWeather} timeLabels={timeLabels} />}
      score={<EventScoreCard score={score} />}
    />
  );
};
