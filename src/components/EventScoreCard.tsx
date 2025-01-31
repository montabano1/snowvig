import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemIcon, ListItemText, Box, CircularProgress, Chip, Stack } from '@mui/material';
import { EventScore } from '../types';
import { Warning } from '@mui/icons-material';

interface EventScoreCardProps {
  score: EventScore;
}

const getScoreColor = (score: number): string => {
  if (score >= 80) return '#4CAF50'; // Green
  if (score >= 60) return '#FFC107'; // Yellow
  return '#F44336'; // Red
};

export const EventScoreCard: React.FC<EventScoreCardProps> = ({ score }) => {
  const scoreColor = getScoreColor(score.score);

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Box position="relative" display="inline-flex" mr={2}>
            <CircularProgress
              variant="determinate"
              value={score.score}
              size={60}
              thickness={4}
              sx={{
                color: scoreColor,
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                },
              }}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="caption" component="div" color="text.secondary">
                {score.score}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography variant="h6" component="div" gutterBottom>
              {score.score >= 80 ? 'Great' : score.score >= 60 ? 'Fair' : 'Poor'} Conditions
            </Typography>
            <Stack direction="row" spacing={1}>
              {score.score < 70 && (
                <Chip
                  icon={<Warning />}
                  label="Consider Backup Plan"
                  color="warning"
                  size="small"
                />
              )}
            </Stack>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          {score.conditions.map((condition, index) => (
            <Typography key={index} variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              • {condition}
            </Typography>
          ))}
        </Box>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
          Recommendations:
        </Typography>

        <List dense>
          {score.recommendations.map((rec, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                {rec.icon}
              </ListItemIcon>
              <ListItemText
                primary={rec.title}
                secondary={rec.description}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};
