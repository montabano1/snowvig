import React from 'react';
import { Card, CardContent, Box, styled } from '@mui/material';

interface WeatherCardLayoutProps {
  title: React.ReactNode;
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
        gap: 2,
        p: 3,
        '&:last-child': {
          pb: 3, // Override Material-UI's default padding-bottom for last child
        },
      }}>
        <Box>{title}</Box>
        <Box sx={{ flexGrow: 1 }}>{graph}</Box>
        <Box>{score}</Box>
        {conditions && <Box>{conditions}</Box>}
        {recommendations && (
          <RecommendationsSection>
            {recommendations}
          </RecommendationsSection>
        )}
      </CardContent>
    </Card>
  );
};
