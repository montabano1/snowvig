import { useState, useEffect, useCallback, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, useMediaQuery } from '@mui/material';
import { WeatherPanel } from './components/WeatherPanel';
import { EventControls } from './components/EventControls';
import { getWeatherForecast } from './services/weatherService';
import { calculateEventScore } from './services/eventScoreService';
import { WeatherData, Location, EventScore } from './types';
import { format, addDays, nextFriday, isFriday, eachDayOfInterval } from 'date-fns';

const defaultLocation: Location = {
  name: "New York, New York",
  lat: 40.7127281,
  lng: -74.0060152
};

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [location, setLocation] = useState<Location>(defaultLocation);
  const [weatherData, setWeatherData] = useState<{ [key: string]: WeatherData[] }>({});
  const [eventScores, setEventScores] = useState<{ [key: string]: EventScore }>({});
  const [selectedCurrentDate, setSelectedCurrentDate] = useState<Date>(new Date());
  const [selectedNextDate, setSelectedNextDate] = useState<Date>(nextFriday(new Date()));
  const [isLoadingCurrentWeek, setIsLoadingCurrentWeek] = useState(false);
  const [isLoadingNextWeek, setIsLoadingNextWeek] = useState(false);

  const [theme, setTheme] = useState(() => 
    createTheme({
      palette: {
        mode: prefersDarkMode ? 'dark' : 'light',
      },
    })
  );

  // Update theme when dark mode preference changes
  useEffect(() => {
    setTheme(createTheme({
      palette: {
        mode: prefersDarkMode ? 'dark' : 'light',
      },
    }));
  }, [prefersDarkMode]);

  // Generate dates for the available forecast period (typically 14 days)
  const availableDates = useMemo(() => {
    const dates: Date[] = [];
    const today = new Date();
    // Most weather APIs provide up to 14 days of forecast
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, []);

  // Function to fetch data for a specific date range
  const fetchDateRangeData = useCallback(async (startDate: Date, endDate: Date) => {
    if (!location?.lat || !location?.lng) return;

    try {
      const startDateStr = format(startDate, 'yyyy-MM-dd');
      const endDateStr = format(endDate, 'yyyy-MM-dd');

      console.log('Fetching additional weather data from', startDateStr, 'to', endDateStr);
      const data = await getWeatherForecast(location, startDateStr, endDateStr);

      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received');
      }

      // Organize new data
      const newData: { [key: string]: WeatherData[] } = {};
      data.forEach(item => {
        if (item?.time) {
          const [date] = item.time.split('T');
          if (date) {
            if (!newData[date]) {
              newData[date] = [];
            }
            newData[date].push(item);
          }
        }
      });

      // Merge with existing data
      setWeatherData(prev => ({...prev, ...newData}));

      // Calculate and merge new scores
      const newScores: { [key: string]: EventScore } = {};
      Object.keys(newData).forEach(date => {
        newScores[date] = calculateEventScore(newData[date]);
      });
      setEventScores(prev => ({...prev, ...newScores}));
    } catch (error) {
      console.error('Error fetching additional weather data:', error);
    }
  }, [location]);

  // Handle date selection and fetch data if needed
  const handleDateSelect = useCallback(async (date: Date, setDate: (date: Date) => void) => {
    setDate(date);
    
    const dateStr = format(date, 'yyyy-MM-dd');
    if (!weatherData[dateStr]) {
      // If we don't have data for this date, fetch a week of data around it
      const startDate = new Date(date);
      startDate.setDate(date.getDate() - 3);
      const endDate = new Date(date);
      endDate.setDate(date.getDate() + 3);
      await fetchDateRangeData(startDate, endDate);
    }
  }, [weatherData, fetchDateRangeData]);

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoadingCurrentWeek(true);
      setIsLoadingNextWeek(true);

      try {
        const today = new Date();
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + 13); // Fetch all 14 days at once

        await fetchDateRangeData(today, endDate);
      } finally {
        setIsLoadingCurrentWeek(false);
        setIsLoadingNextWeek(false);
      }
    };

    fetchInitialData();
  }, [fetchDateRangeData]);

  const getScoreForDate = (date: Date): EventScore | null => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return eventScores[dateStr] || null;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        width: '100vw', 
        minHeight: '100vh', 
        bgcolor: 'background.default',
        display: 'flex',
        justifyContent: 'center',
      }}>
        <Box sx={{ 
          p: { xs: 2, sm: 3 }, 
          width: '100%',
          maxWidth: '2000px',
        }}>
          <Box sx={{ mb: 3 }}>
            <EventControls
              onLocationChange={setLocation}
            />
          </Box>
          <Box
            sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 3,
              '& > *': {
                width: '100%',
                minWidth: 0,
              }
            }}
          >
            <Box>
              <WeatherPanel
                date={selectedCurrentDate}
                dates={availableDates}
                onDateSelect={(date) => handleDateSelect(date, setSelectedCurrentDate)}
                isCurrent={true}
                isLoading={isLoadingCurrentWeek}
                weatherData={weatherData[format(selectedCurrentDate, 'yyyy-MM-dd')] || []}
                score={getScoreForDate(selectedCurrentDate)}
                location={location.name}
              />
            </Box>
            <Box>
              <WeatherPanel
                date={selectedNextDate}
                dates={availableDates}
                onDateSelect={(date) => handleDateSelect(date, setSelectedNextDate)}
                isCurrent={false}
                isLoading={isLoadingNextWeek}
                weatherData={weatherData[format(selectedNextDate, 'yyyy-MM-dd')] || []}
                score={getScoreForDate(selectedNextDate)}
                location={location.name}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
