import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Grid, Paper, useMediaQuery, Box } from '@mui/material';
import { WeatherGraph } from './components/WeatherGraph';
import { EventScoreCard } from './components/EventScoreCard';
import { EventControls } from './components/EventControls';
import { WeatherSkeleton } from './components/WeatherSkeleton';
import { WeatherCardLayout } from './components/WeatherCardLayout';
import { getWeatherForecast } from './services/weatherService';
import { calculateEventScore } from './services/eventScoreService';
import { WeatherData, Location, EventScore, TimeSlot } from './types';
import { format, addWeeks, parse } from 'date-fns';

const defaultLocation: Location = {
  name: "New York, NY, United States",
  lat: 40.7128,
  lng: -74.0060
};

const defaultTimeSlot: TimeSlot = {
  day: "Friday",
  period: "afternoon",
  startTime: "14:00",
  endTime: "17:00"
};

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [location, setLocation] = useState<Location>(defaultLocation);
  const [selectedDay, setSelectedDay] = useState<string>('Friday');
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeSlot>({
    day: 'Friday',
    period: 'morning',
    startTime: '09:00',
    endTime: '12:00'
  });
  const [currentWeek, setCurrentWeek] = useState<WeatherData[]>([]);
  const [nextWeek, setNextWeek] = useState<WeatherData[]>([]);
  const [currentScore, setCurrentScore] = useState<EventScore | null>(null);
  const [nextScore, setNextScore] = useState<EventScore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);

  const theme = createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!location) {
        console.log('No location set, skipping fetch');
        return;
      }

      setIsLoading(true);
      setShowSkeleton(true);
      console.log('Fetching weather data for:', {
        location,
        selectedDay,
        selectedTimeRange
      });

      try {
        // Get dates for this week and next week
        const thisWeekDate = format(new Date(), 'yyyy-MM-dd');
        const nextWeekDate = format(addWeeks(new Date(), 1), 'yyyy-MM-dd');
        
        console.log('Fetching for dates:', { thisWeekDate, nextWeekDate });

        const [thisWeekData, nextWeekData] = await Promise.all([
          getWeatherForecast(location, thisWeekDate, thisWeekDate),
          getWeatherForecast(location, nextWeekDate, nextWeekDate)
        ]);

        console.log('Received weather data:', {
          thisWeekData,
          nextWeekData
        });

        setCurrentWeek(thisWeekData);
        setNextWeek(nextWeekData);

        // Calculate scores
        if (thisWeekData.length > 0) {
          const currentScoreData = calculateEventScore(thisWeekData[0]);
          console.log('Calculated current week score:', currentScoreData);
          setCurrentScore(currentScoreData);
        } else {
          console.warn('No data available for current week');
        }

        if (nextWeekData.length > 0) {
          const nextScoreData = calculateEventScore(nextWeekData[0]);
          console.log('Calculated next week score:', nextScoreData);
          setNextScore(nextScoreData);
        } else {
          console.warn('No data available for next week');
        }

      } catch (error) {
        console.error('Error fetching weather data:', error);
      } finally {
        setIsLoading(false);
        // Keep skeleton for minimum time
        setTimeout(() => {
          setShowSkeleton(false);
        }, 1000);
      }
    };

    fetchData();
  }, [location, selectedDay, selectedTimeRange]);

  console.log('Render state:', {
    isLoading,
    currentWeek: currentWeek.length,
    nextWeek: nextWeek.length,
    currentScore,
    nextScore,
    location
  });

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
              selectedTimeRange={selectedTimeRange}
              onTimeRangeChange={setSelectedTimeRange}
            />
          </Box>
          
          <Grid 
            container 
            spacing={3} 
            sx={{ 
              width: '100%',
              mx: 'auto',
              '& .MuiGrid-item': {
                padding: 0,
                paddingTop: '24px !important',
              },
            }}
          >
            <Grid 
              item 
              xs={12} 
              md={6} 
              sx={{
                display: 'flex',
                pr: { md: 1.5 },
              }}
            >
              {showSkeleton ? (
                <WeatherSkeleton day={`This ${selectedDay}`} />
              ) : (
                currentWeek.length > 0 && currentScore && (
                  <WeatherCardLayout
                    title={`This ${selectedDay}`}
                    location={location}
                    graph={<WeatherGraph weatherData={currentWeek} timeLabels={timeLabels} />}
                    score={<EventScoreCard score={currentScore} />}
                  />
                )
              )}
            </Grid>

            <Grid 
              item 
              xs={12} 
              md={6} 
              sx={{
                display: 'flex',
              }}
            >
              {showSkeleton ? (
                <WeatherSkeleton day={`Next ${selectedDay}`} />
              ) : (
                nextWeek.length > 0 && nextScore && (
                  <WeatherCardLayout
                    title={`Next ${selectedDay}`}
                    location={location}
                    graph={<WeatherGraph weatherData={nextWeek} timeLabels={timeLabels} />}
                    score={<EventScoreCard score={nextScore} />}
                  />
                )
              )}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
