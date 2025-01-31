import React from 'react';
import { Box, Paper, Typography, styled } from '@mui/material';
import { format } from 'date-fns';
import { EventScore, WeatherData } from '../types';

const getScoreColor = (score: number): string => {
  if (score >= 80) return '#4CAF50'; // Green
  if (score >= 60) return '#FFC107'; // Yellow
  return '#F44336'; // Red
};

interface DayCardProps {
  date: Date;
  score: EventScore | null;
  selected: boolean;
  onClick: () => void;
  weatherData: WeatherData[];
}

const StyledCard = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'borderColor' && prop !== 'isSelected'
})<{ borderColor: string; isSelected: boolean }>(({ theme, borderColor, isSelected }) => ({
  padding: theme.spacing(1.5),
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  border: `2px solid ${borderColor}`,
  backgroundColor: isSelected ? `${borderColor}15` : 'transparent',
  minWidth: '80px',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 4px 8px ${borderColor}40`,
  },
}));

const DayCard: React.FC<DayCardProps> = ({ date, score, selected, onClick, weatherData }) => {
  // Calculate average temperature
  const avgTemp = weatherData && weatherData.length > 0
    ? Math.round(weatherData.reduce((sum, data) => sum + (data.temperature || 0), 0) / weatherData.length)
    : null;

  const borderColor = score ? getScoreColor(score.score) : '#e0e0e0';
  
  const dayOfWeek = format(date, 'EEE');
  const dayAndMonth = format(date, 'MMM d');

  return (
    <StyledCard
      borderColor={borderColor}
      isSelected={selected}
      onClick={onClick}
      elevation={selected ? 4 : 1}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {dayOfWeek}
        </Typography>
        <Typography variant="body2">
          {dayAndMonth}
        </Typography>
        {avgTemp !== null && (
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 'bold',
              mt: 0.5,
              color: '#2196F3' // Light blue for temperature
            }}
          >
            {avgTemp}°F
          </Typography>
        )}
      </Box>
    </StyledCard>
  );
};

interface DayCardsProps {
  dates: Date[];
  selectedDate: Date;
  scores: { [key: string]: EventScore };
  weatherData: { [key: string]: WeatherData[] };
  onDateSelect: (date: Date) => void;
}

const DayCards: React.FC<DayCardsProps> = ({
  dates,
  selectedDate,
  scores,
  weatherData,
  onDateSelect,
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
          display: 'none'
        },
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          p: 2,
          width: 'fit-content',
        }}
      >
        {dates.map((date) => {
          const dateStr = format(date, 'yyyy-MM-dd');
          const dayWeatherData = weatherData[dateStr] || [];
          return (
            <DayCard
              key={dateStr}
              date={date}
              score={scores[dateStr] || null}
              weatherData={dayWeatherData}
              selected={date.toDateString() === selectedDate.toDateString()}
              onClick={() => onDateSelect(date)}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default DayCards;
