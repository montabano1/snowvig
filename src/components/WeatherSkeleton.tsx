import React from 'react';
import { Box, Skeleton } from '@mui/material';
import { WeatherCardLayout } from './WeatherCardLayout';

export const WeatherSkeleton: React.FC<{ day: string }> = ({ day }) => {
  const title = (
    <Box>
      <h2>{day}</h2>
      <Skeleton width="250px" height={24} />
    </Box>
  );

  const graph = (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Skeleton variant="rectangular" height="100%" />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        {[...Array(12)].map((_, i) => (
          <Skeleton key={i} width={30} height={16} />
        ))}
      </Box>
    </Box>
  );

  const score = (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <Skeleton variant="circular" width={60} height={60} sx={{ mr: 2 }} />
      <Box sx={{ flex: 1 }}>
        <Skeleton width="180px" height={32} />
      </Box>
    </Box>
  );

  const conditions = (
    <Box>
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} width="80%" height={24} sx={{ mb: 1 }} />
      ))}
    </Box>
  );

  const recommendations = (
    <Box>
      <h3>Recommendations:</h3>
      {[...Array(3)].map((_, i) => (
        <Box key={i} sx={{ display: 'flex', mb: 2 }}>
          <Skeleton variant="circular" width={24} height={24} sx={{ mr: 2 }} />
          <Box sx={{ flex: 1 }}>
            <Skeleton width="60%" height={24} sx={{ mb: 0.5 }} />
            <Skeleton width="90%" height={20} />
          </Box>
        </Box>
      ))}
    </Box>
  );

  return (
    <WeatherCardLayout
      title={title}
      graph={graph}
      score={score}
      conditions={conditions}
      recommendations={recommendations}
    />
  );
};
