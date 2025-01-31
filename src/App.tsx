import { useState, useEffect, useCallback } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, useMediaQuery } from '@mui/material';
import { WeatherPanel } from './components/WeatherPanel';
import { DaySelector } from './components/DaySelector';
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
  const [selectedCurrentDate, setSelectedCurrentDate] = useState<Date>(new Date());
  const [selectedNextDate, setSelectedNextDate] = useState<Date>(nextFriday(new Date()));
  const [isLoadingCurrentWeek, setIsLoadingCurrentWeek] = useState(false);
  const [isLoadingNextWeek, setIsLoadingNextWeek] = useState(false);

  const theme = createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
    },
  });

  const fetchData = useCallback(async () => {
    if (!location?.lat || !location?.lng) return;

    setIsLoadingCurrentWeek(true);
    setIsLoadingNextWeek(true);

    try {
      const today = new Date();
      const startDate = format(today, 'yyyy-MM-dd');
      
      // Find next Friday
      let nextFridayDate = nextFriday(today);
      if (isFriday(today)) {
        nextFridayDate = nextFriday(addDays(today, 1)); // Get the following Friday
      }
      
      // Add 2 days to get to Sunday after next Friday
      const endDate = format(addDays(nextFridayDate, 2), 'yyyy-MM-dd');

      console.log('Date range:', {
        startDate,
        nextFridayDate: format(nextFridayDate, 'yyyy-MM-dd'),
        endDate
      });

      // Fetch weather data for the entire range
      const data = await getWeatherForecast(location, startDate, endDate);
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received');
      }

      // Organize data by date
      const organizedData: { [key: string]: WeatherData[] } = {};
      data.forEach(item => {
        if (item?.time) {
          const [date] = item.time.split('T');
          if (date) {
            if (!organizedData[date]) {
              organizedData[date] = [];
            }
            organizedData[date].push(item);
          }
        }
      });

      console.log('Organized Data:', organizedData);
      setWeatherData(organizedData);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeatherData({});
    } finally {
      setTimeout(() => {
        setIsLoadingCurrentWeek(false);
        setIsLoadingNextWeek(false);
      }, 1000);
    }
  }, [location?.lat, location?.lng]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calculate date ranges
  const today = new Date();
  const nextFridayDate = nextFriday(today);
  const endDate = addDays(nextFridayDate, 2);

  // If today is Friday, get the next Friday for the second panel
  const secondPanelFriday = isFriday(today) ? nextFriday(addDays(today, 1)) : nextFridayDate;

  const currentWeekDates = eachDayOfInterval({
    start: today,
    end: isFriday(today) ? addDays(today, 2) : nextFridayDate,
  });

  const nextWeekDates = eachDayOfInterval({
    start: secondPanelFriday,
    end: addDays(secondPanelFriday, 2),
  });

  const getScoreForDate = (date: Date): EventScore | null => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayData = weatherData[dateStr];
    if (dayData && dayData.length > 0) {
      return calculateEventScore(dayData);
    }
    return null;
  };

  // Get weather data for a specific date
  const getWeatherForDate = (date: Date): WeatherData[] => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return weatherData[dateStr] || [];
  };

  // Get current panel data
  const currentPanelData = getWeatherForDate(selectedCurrentDate);
  const currentPanelScore = getScoreForDate(selectedCurrentDate);

  // Get next panel data
  const nextPanelData = getWeatherForDate(selectedNextDate);
  const nextPanelScore = getScoreForDate(selectedNextDate);

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
            }}
          >
            <Box>
              <DaySelector
                dates={currentWeekDates}
                selectedDate={selectedCurrentDate}
                onSelectDate={setSelectedCurrentDate}
              />
              <WeatherPanel
                date={selectedCurrentDate}
                isCurrent={true}
                isLoading={isLoadingCurrentWeek}
                weatherData={currentPanelData}
                score={currentPanelScore}
                location={location.name}
              />
            </Box>
            <Box>
              <DaySelector
                dates={nextWeekDates}
                selectedDate={selectedNextDate}
                onSelectDate={setSelectedNextDate}
              />
              <WeatherPanel
                date={selectedNextDate}
                isCurrent={false}
                isLoading={isLoadingNextWeek}
                weatherData={nextPanelData}
                score={nextPanelScore}
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
