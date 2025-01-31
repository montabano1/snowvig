import React, { useState, useEffect } from 'react';
import { Box, FormControl, TextField, Autocomplete, CircularProgress } from '@mui/material';
import { Location } from '../types';
import { searchLocations } from '../services/locationService';
import debounce from 'lodash/debounce';

interface EventControlsProps {
  onLocationChange: (location: Location) => void;
  onDayChange: (day: string) => void;
  selectedDay: string;
}

export const EventControls: React.FC<EventControlsProps> = ({
  onLocationChange,
}) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const defaultLocation: Location = {
      name: "New York, New York",
      lat: 40.7127281,
      lng: -74.0060152
    };
    setSelectedLocation(defaultLocation);
    onLocationChange(defaultLocation);
  }, [onLocationChange]);

  const handleLocationSearch = debounce(async (query: string) => {
    if ((/^\d{5}$/.test(query) || (!query.match(/^\d+$/) && query.length >= 3))) {
      setLoading(true);
      try {
        const results = await searchLocations(query);
        setLocations(results);
        if (results.length > 0) {
          setOpen(true);
        }
      } catch (error) {
        setLocations([]);
      } finally {
        setLoading(false);
      }
    } else {
      setLocations([]);
      setOpen(false);
    }
  }, 300);

  const selectLocation = (location: Location) => {
    setSelectedLocation(location);
    setInputValue(location.name);
    onLocationChange(location);
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
            setInputValue(newValue);
            if (reason === 'input') {
              handleLocationSearch(newValue);
            }
          }}
          onChange={(_, newValue) => {
            if (newValue) {
              if (typeof newValue === 'string') {
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
                  selectLocation(firstLocation);
                }
              }}
            />
          )}
        />
      </FormControl>

      {/* Day picker removed
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
      */}
    </Box>
  );
};
