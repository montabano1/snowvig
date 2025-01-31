import React from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { TimeSlot } from '../types';

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
  const handleDayChange = (event: SelectChangeEvent) => {
    onDayChange(event.target.value);
  };

  const handleLocationChange = (event: SelectChangeEvent) => {
    onLocationChange(event.target.value);
  };

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
        <InputLabel>Location</InputLabel>
        <Select
          label="Location"
          defaultValue="New York, NY"
          onChange={handleLocationChange}
        >
          <MenuItem value="New York, NY">New York, NY</MenuItem>
          <MenuItem value="Los Angeles, CA">Los Angeles, CA</MenuItem>
          <MenuItem value="Chicago, IL">Chicago, IL</MenuItem>
          <MenuItem value="Houston, TX">Houston, TX</MenuItem>
        </Select>
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
