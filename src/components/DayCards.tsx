import React, { useEffect, useRef, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { format, addDays, isFriday, nextFriday, differenceInDays, isSameDay } from 'date-fns';

interface DayCardsProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  panelType: 'current' | 'next';
}

export const DayCards: React.FC<DayCardsProps> = ({ selectedDate, onDateSelect, panelType }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const today = new Date();

  // Memoize dates array to prevent recalculation
  const dates = useMemo(() => {
    const nextFridayDate = nextFriday(addDays(today, 7));
    const endDate = addDays(nextFridayDate, 9);
    const datesArray: Date[] = [];
    let currentDate = today;
    while (currentDate <= endDate) {
      datesArray.push(new Date(currentDate));
      currentDate = addDays(currentDate, 1);
    }
    return datesArray;
  }, [today]);

  // Set initial date selection
  useEffect(() => {
    const isInitialDate = selectedDate.toDateString() === today.toDateString();
    console.log('Initial date check', {
      panelType,
      isInitialDate,
      selectedDate: selectedDate.toDateString(),
      today: today.toDateString()
    });
    
    if (!isInitialDate) return;

    if (panelType === 'next') {
      // Get this Friday first
      const thisFriday = nextFriday(today);
      // Then add 7 days to get next Friday
      const nextFridayDate = addDays(thisFriday, 7);
      
      console.log('Next panel date calculation', {
        panelType,
        today: today.toDateString(),
        thisFriday: thisFriday.toDateString(),
        nextFridayDate: nextFridayDate.toDateString(),
        isTodayFriday: isFriday(today)
      });
      
      onDateSelect(nextFridayDate);
    } else {
      const upcomingFriday = nextFriday(today);
      console.log('Current panel date calculation', {
        panelType,
        today: today.toDateString(),
        upcomingFriday: upcomingFriday.toDateString(),
        isTodayFriday: isFriday(today)
      });
      onDateSelect(upcomingFriday);
    }
  }, [onDateSelect, panelType, selectedDate, today]);

  // Log renders
  console.log('DayCards render', {
    panelType,
    selectedDate: selectedDate.toDateString(),
    renderCount: Math.random() // To track unique renders
  });

  // Update scroll position when selected date changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const CARD_WIDTH = 80;
      const GAP = 8;
      
      const daysFromToday = differenceInDays(selectedDate, today);
      const scrollPosition = Math.max(0, (daysFromToday) * (CARD_WIDTH + GAP));

      // Use smooth scrolling only for user interactions
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [selectedDate, today]);

  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        overflow: 'auto',
        width: '100%'
      }}
    >
      <Box
        ref={scrollContainerRef}
        sx={{
          display: 'flex',
          gap: 1,
          overflowX: 'auto',
          pb: 2,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }}
      >
        {dates.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          return (
            <Box
              key={day.toISOString()}
              onClick={() => onDateSelect(day)}
              sx={{
                minWidth: 80,
                p: 1,
                borderRadius: 1,
                cursor: 'pointer',
                bgcolor: isSelected ? 'primary.main' : 'background.paper',
                color: isSelected ? 'primary.contrastText' : 'text.primary',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  bgcolor: isSelected ? 'primary.dark' : 'action.hover'
                }
              }}
            >
              <Typography variant="subtitle2" align="center">
                {format(day, 'EEE')}
              </Typography>
              <Typography variant="h6" align="center">
                {format(day, 'd')}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
