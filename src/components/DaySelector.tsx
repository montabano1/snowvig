import React from 'react';
import { Box, Card, CardContent, Typography, styled } from '@mui/material';
import { format } from 'date-fns';

interface DaySelectorProps {
  dates: Date[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

const DayCard = styled(Card)<{ selected?: boolean }>(({ theme, selected }) => ({
  cursor: 'pointer',
  minWidth: '100px',
  backgroundColor: selected ? theme.palette.primary.main : theme.palette.background.paper,
  color: selected ? theme.palette.primary.contrastText : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: selected ? theme.palette.primary.dark : theme.palette.action.hover,
  },
  transition: 'background-color 0.2s',
}));

export const DaySelector: React.FC<DaySelectorProps> = ({
  dates,
  selectedDate,
  onSelectDate,
}) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 1,
      overflowX: 'auto',
      pb: 2,
      '&::-webkit-scrollbar': {
        height: '8px',
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: '4px',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: '4px',
      },
    }}>
      {dates.map((date) => (
        <DayCard
          key={date.toISOString()}
          selected={format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')}
          onClick={() => onSelectDate(date)}
        >
          <CardContent sx={{ 
            p: 1.5, 
            '&:last-child': { pb: 1.5 },
            textAlign: 'center',
          }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {format(date, 'EEE')}
            </Typography>
            <Typography variant="body2">
              {format(date, 'MMM d')}
            </Typography>
          </CardContent>
        </DayCard>
      ))}
    </Box>
  );
};
