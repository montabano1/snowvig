import React, { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { WeatherData } from '../types';
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

// Register Chart.js components
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
  const chartRef = useRef<ChartJS | null>(null);

  // Cleanup chart on unmount
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  // Ensure weatherData is an array and has data
  const data = Array.isArray(weatherData) ? weatherData : [];

  const temperatures = data.map(item => item.temperature || 0);
  const precipitationProb = data.map(item => item.precipitationProbability || 0);
  const windSpeed = data.map(item => item.windSpeed || 0);

  const chartData = {
    labels: timeLabels,
    datasets: [
      {
        label: 'Temperature (°F)',
        data: temperatures,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        yAxisID: 'y',
      },
      {
        label: 'Precipitation Probability (%)',
        data: precipitationProb,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        yAxisID: 'y1',
      },
      {
        label: 'Wind Speed (mph)',
        data: windSpeed,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        yAxisID: 'y2',
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Temperature (°F)',
        },
      },
      y1: {
        type: 'linear',
        display: false,
        position: 'right',
        min: 0,
        max: 100,
        grid: {
          drawOnChartArea: false,
        },
      },
      y2: {
        type: 'linear',
        display: false,
        position: 'right',
        min: 0,
        max: 40,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <Box sx={{ width: '100%', height: '300px' }}>
      <Line 
        options={options} 
        data={chartData}
        ref={chartRef}
      />
    </Box>
  );
};
