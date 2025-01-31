import { useState, useEffect, useCallback } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, useMediaQuery } from '@mui/material';
import { WeatherGraph } from './components/WeatherGraph';
import { EventScoreCard } from './components/EventScoreCard';
import { EventControls } from './components/EventControls';
import { WeatherSkeleton } from './components/WeatherSkeleton';
import { WeatherCardLayout } from './components/WeatherCardLayout';
import { getWeatherForecast } from './services/weatherService';
import { calculateEventScore } from './services/eventScoreService';
import { WeatherData, Location, EventScore } from './types';
import { format, addWeeks } from 'date-fns';

const defaultLocation: Location = {
  name: "New York, New York",
  lat: 40.7127281,
  lng: -74.0060152
};

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [location, setLocation] = useState<Location>(defaultLocation);
  const [selectedDay, setSelectedDay] = useState<string>('Friday');
  const [currentWeek, setCurrentWeek] = useState<WeatherData[]>([]);
  const [nextWeek, setNextWeek] = useState<WeatherData[]>([]);
  const [currentScore, setCurrentScore] = useState<EventScore | null>(null);
  const [nextScore, setNextScore] = useState<EventScore | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);

  const theme = createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
    },
  });

  const fetchData = useCallback(async () => {
    if (!location?.lat || !location?.lng) return;

    setIsLoading(true);
    setShowSkeleton(true);

    try {
      const thisWeekDate = format(new Date(), 'yyyy-MM-dd');
      const nextWeekDate = format(addWeeks(new Date(), 1), 'yyyy-MM-dd');

      const [thisWeekData, nextWeekData] = await Promise.all([
        getWeatherForecast(location, thisWeekDate, thisWeekDate),
        getWeatherForecast(location, nextWeekDate, nextWeekDate)
      ]);

      setCurrentWeek(thisWeekData);
      setNextWeek(nextWeekData);

      if (thisWeekData.length > 0) {
        const currentScoreData = calculateEventScore(thisWeekData[0]);
        setCurrentScore(currentScoreData);
      }

      if (nextWeekData.length > 0) {
        const nextScoreData = calculateEventScore(nextWeekData[0]);
        setNextScore(nextScoreData);
      }
    } catch (error) {
      setCurrentWeek([]);
      setNextWeek([]);
      setCurrentScore(null);
      setNextScore(null);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setShowSkeleton(false);
      }, 1000);
    }
  }, [location?.lat, location?.lng]);

  useEffect(() => {
    fetchData();
  }, [fetchData, selectedDay]);

  const timeLabels = Array.from({ length: 24 }, (_, i) => 
    format(new Date().setHours(i), 'ha')
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ width: '100vw', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Box sx={{ 
          p: { xs: 2, sm: 3 }, 
          width: '100%',
          maxWidth: '2000px', 
          mx: 'auto', 
        }}>
          <Box sx={{ mb: 3 }}>
            <EventControls
              onLocationChange={setLocation}
              onDayChange={setSelectedDay}
              selectedDay={selectedDay}
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
              {showSkeleton ? (
                <WeatherSkeleton day={`This ${selectedDay}`} />
              ) : (
                currentWeek.length > 0 && currentScore && (
                  <WeatherCardLayout
                    title={`This ${selectedDay}`}
                    location={location.name}
                    graph={<WeatherGraph weatherData={currentWeek} timeLabels={timeLabels} />}
                    score={<EventScoreCard score={currentScore} />}
                  />
                )
              )}
            </Box>

            <Box>
              {showSkeleton ? (
                <WeatherSkeleton day={`Next ${selectedDay}`} />
              ) : (
                nextWeek.length > 0 && nextScore && (
                  <WeatherCardLayout
                    title={`Next ${selectedDay}`}
                    location={location.name}
                    graph={<WeatherGraph weatherData={nextWeek} timeLabels={timeLabels} />}
                    score={<EventScoreCard score={nextScore} />}
                  />
                )
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
