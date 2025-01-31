import React from 'react';
import { Line } from 'react-chartjs-2';
import { Box } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { WeatherData } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface WeatherGraphProps {
  weatherData: WeatherData[];
  timeLabels: string[];
}

export const WeatherGraph: React.FC<WeatherGraphProps> = ({ weatherData, timeLabels }) => {
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            if (label.includes('Temperature')) return `${label}: ${value}°F`;
            if (label.includes('Precipitation')) return `${label}: ${value}%`;
            if (label.includes('Wind')) return `${label}: ${value} mph`;
            return `${label}: ${value}`;
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        min: Math.min(...weatherData.map(d => d.temperature)) - 5,
        max: Math.max(...weatherData.map(d => d.temperature)) + 5,
        title: {
          display: true,
          text: 'Temperature (°F)'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        min: 0,
        max: 100,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Precipitation Probability (%)'
        }
      },
      y2: {
        type: 'linear',
        display: true,
        position: 'right',
        min: 0,
        max: Math.max(...weatherData.map(d => d.windSpeed)) + 2,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Wind Speed (mph)'
        }
      },
    },
  };

  const data = {
    labels: timeLabels,
    datasets: [
      {
        label: 'Temperature (°F)',
        data: weatherData.map(d => d.temperature),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        yAxisID: 'y',
      },
      {
        label: 'Precipitation Probability (%)',
        data: weatherData.map(d => d.precipitationProbability),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        yAxisID: 'y1',
      },
      {
        label: 'Wind Speed (mph)',
        data: weatherData.map(d => d.windSpeed),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        yAxisID: 'y2',
      },
    ],
  };

  return (
    <Box sx={{ width: '100%', height: '300px' }}>
      <Line options={options} data={data} />
    </Box>
  );
};
