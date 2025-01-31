import React, { useState, useEffect } from 'react';
import { Box, FormControl, InputLabel, TextField, MenuItem, Select, SelectChangeEvent, Autocomplete, CircularProgress } from '@mui/material';
import { TimeSlot, Location } from '../types';
import { searchLocations } from '../services/locationService';
import debounce from 'lodash/debounce';

const TIME_RANGES = [
  { label: "Morning (9 AM - 12 PM)", period: "morning", startTime: "09:00", endTime: "12:00" },
  { label: "Afternoon (2 PM - 5 PM)", period: "afternoon", startTime: "14:00", endTime: "17:00" },
  { label: "Evening (6 PM - 9 PM)", period: "evening", startTime: "18:00", endTime: "21:00" },
];

interface EventControlsProps {
  onLocationChange: (location: string) => void;
  onDayChange: (day: string) => void;
  selectedDay: string;
  selectedTimeRange: TimeSlot;
  onTimeRangeChange: (timeRange: TimeSlot) => void;
}

export const EventControls: React.FC<EventControlsProps> = ({
  onLocationChange,
  onDayChange,
  selectedDay,
  selectedTimeRange,
  onTimeRangeChange,
}) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [inputValue, setInputValue] = useState('New York, NY');
  const [displayValue, setDisplayValue] = useState('New York, NY');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Set default location on mount
    onLocationChange('New York, NY');
  }, []);

  const handleDayChange = (event: SelectChangeEvent) => {
    onDayChange(event.target.value);
  };

  const handleLocationSearch = debounce(async (query: string) => {
    console.log('Searching for:', query);
    // Only search if it's a 5-digit zip code or at least 3 characters for city names
    if ((/^\d{5}$/.test(query) || (!query.match(/^\d+$/) && query.length >= 3))) {
      setLoading(true);
      try {
        const results = await searchLocations(query);
        console.log('Search results:', results);
        setLocations(results);
        if (results.length > 0) {
          setOpen(true);
        }
      } catch (error) {
        console.error('Error searching locations:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setLocations([]);
      setOpen(false);
    }
  }, 300);

  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    const selected = TIME_RANGES.find(range => range.period === event.target.value);
    if (selected) {
      onTimeRangeChange({
        day: selectedDay,
        period: selected.period as "morning" | "afternoon" | "evening",
        startTime: selected.startTime,
        endTime: selected.endTime,
      });
    }
  };

  const selectLocation = (location: Location) => {
    console.log('Selecting location:', location);
    setSelectedLocation(location);
    setInputValue(location.name);
    setDisplayValue(location.name);
    onLocationChange(location.name);
    setOpen(false);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 3,
      flexWrap: 'wrap',
      width: '100%',
      '& > *': {
        flex: 1,
        minWidth: { xs: '100%', sm: '200px' },
        maxWidth: { sm: '300px' },
      }
    }}>
      <FormControl>
        <Autocomplete
          sx={{ width: '100%' }}
          autoComplete
          includeInputInList
          filterOptions={(x) => x}
          open={open && locations.length > 0}
          onOpen={() => {
            if (locations.length > 0) {
              setOpen(true);
            }
          }}
          onClose={() => setOpen(false)}
          freeSolo
          loading={loading}
          loadingText="Searching..."
          noOptionsText="No locations found"
          options={locations}
          getOptionLabel={(option) => {
            if (typeof option === 'string') return option;
            return option.name;
          }}
          renderOption={(props, option) => (
            <Box component="li" {...props}>
              {option.name}
            </Box>
          )}
          value={selectedLocation}
          inputValue={inputValue}
          onInputChange={(_, newValue, reason) => {
            console.log('Input changed:', newValue, reason);
            setInputValue(newValue);
            if (reason === 'input') {
              handleLocationSearch(newValue);
            }
          }}
          onChange={(_, newValue) => {
            console.log('Selection changed:', newValue);
            if (newValue) {
              if (typeof newValue === 'string') {
                // Handle the case when user types and presses enter without selecting
                const matchingLocation = locations.find(loc => loc.name.toLowerCase() === newValue.toLowerCase());
                if (matchingLocation) {
                  selectLocation(matchingLocation);
                }
              } else {
                selectLocation(newValue);
              }
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Location"
              variant="outlined"
              placeholder="Enter city or zip code..."
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading && <CircularProgress color="inherit" size={20} />}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && locations.length > 0) {
                  e.preventDefault();
                  const firstLocation = locations[0];
                  console.log('Selecting first location on enter:', firstLocation);
                  selectLocation(firstLocation);
                }
              }}
            />
          )}
        />
      </FormControl>

      <FormControl>
        <InputLabel>Day of Week</InputLabel>
        <Select
          label="Day of Week"
          value={selectedDay}
          onChange={handleDayChange}
        >
          <MenuItem value="Monday">Monday</MenuItem>
          <MenuItem value="Tuesday">Tuesday</MenuItem>
          <MenuItem value="Wednesday">Wednesday</MenuItem>
          <MenuItem value="Thursday">Thursday</MenuItem>
          <MenuItem value="Friday">Friday</MenuItem>
          <MenuItem value="Saturday">Saturday</MenuItem>
          <MenuItem value="Sunday">Sunday</MenuItem>
        </Select>
      </FormControl>

      <FormControl>
        <InputLabel>Time of Day</InputLabel>
        <Select
          label="Time of Day"
          value={selectedTimeRange.period}
          onChange={handleTimeRangeChange}
        >
          {TIME_RANGES.map((range) => (
            <MenuItem key={range.period} value={range.period}>
              {range.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
