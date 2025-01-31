import React from 'react';
import { Box, Card, CardContent, Skeleton } from '@mui/material';

interface WeatherSkeletonProps {
  day: string;
}

export const WeatherSkeleton: React.FC<WeatherSkeletonProps> = ({ day }) => {
  return (
    <Card sx={{ 
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <CardContent sx={{ 
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        p: 3,
        '&:last-child': {
          pb: 3,
        }
      }}>
        <Box>
          <h2>{day}</h2>
          <Skeleton variant="text" width="250px" height={24} />
        </Box>
        
        <Box sx={{ flexGrow: 1, minHeight: 300, mb: 2 }}>
          <Skeleton variant="rectangular" height="100%" />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            {[...Array(12)].map((_, i) => (
              <Skeleton key={i} width={30} height={16} />
            ))}
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Skeleton 
            variant="circular" 
            width={60} 
            height={60} 
            sx={{ 
              mr: 2,
              position: 'relative',
              zIndex: 1 
            }} 
          />
          <Box sx={{ flex: 1 }}>
            <Skeleton width="180px" height={32} />
          </Box>
        </Box>

        <Box>
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} width="80%" height={24} sx={{ mb: 1 }} />
          ))}
        </Box>

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
      </CardContent>
    </Card>
  );
};
