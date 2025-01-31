import React from 'react';
import { Card, CardContent, Box, Typography, styled } from '@mui/material';

interface WeatherCardLayoutProps {
  title: string;
  location: string;
  graph: React.ReactNode;
  score: React.ReactNode;
  conditions?: React.ReactNode;
  recommendations?: React.ReactNode;
}

const ContentSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const GraphContainer = styled(Box)({
  height: 300,
  marginBottom: 16,
});

const ScoreSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: 24,
});

const RecommendationsSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

export const WeatherCardLayout: React.FC<WeatherCardLayoutProps> = ({
  title,
  location,
  graph,
  score,
  conditions,
  recommendations,
}) => {
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
          <Typography variant="h4" gutterBottom>{title}</Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Weather Conditions Over Time in {location}
          </Typography>
        </Box>
        <GraphContainer>{graph}</GraphContainer>
        <Box sx={{ flex: '0 0 auto' }}>{score}</Box>
        <Box sx={{ flex: 1 }}>
          {conditions}
          {recommendations && (
            <RecommendationsSection>
              {recommendations}
            </RecommendationsSection>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
