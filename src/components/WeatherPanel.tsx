import React from 'react';
import { Box, Typography } from '@mui/material';
import { WeatherCardLayout } from './WeatherCardLayout';
import { WeatherGraph } from './WeatherGraph';
import { EventScoreCard } from './EventScoreCard';
import { WeatherSkeleton } from './WeatherSkeleton';
import { WeatherData, EventScore } from '../types';
import { format } from 'date-fns';

interface WeatherPanelProps {
  date: Date;
  isCurrent: boolean;
  isLoading: boolean;
  weatherData: WeatherData[];
  score: EventScore | null;
  location: string;
}

export const WeatherPanel: React.FC<WeatherPanelProps> = ({
  date,
  isCurrent,
  isLoading,
  weatherData,
  score,
  location,
}) => {
  const dayOfWeek = format(date, 'EEEE');
  const timePrefix = isCurrent ? 'This' : 'Next';
  const title = `${timePrefix} ${dayOfWeek}`;

  const timeLabels = Array.from({ length: 24 }, (_, i) => 
    format(new Date().setHours(i), 'ha')
  );

  if (isLoading) {
    return <WeatherSkeleton day={title} />;
  }

  if (!weatherData || weatherData.length === 0) {
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
      graph={<WeatherGraph weatherData={weatherData} timeLabels={timeLabels} />}
      score={<EventScoreCard score={score} />}
    />
  );
};
