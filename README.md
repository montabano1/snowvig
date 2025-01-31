# Weather Meetup Planner

A smart weather application designed to help meetup organizers plan outdoor events. The app provides detailed weather forecasts, activity recommendations, and event scores to make informed decisions about outdoor gatherings.

## Features

### 🌡️ Weather Information
- Detailed temperature, precipitation, and wind speed graphs
- Weekly forecast view for comparing current and next week
- Color-coded event scores (0-100) indicating overall conditions

### 🎯 Smart Recommendations
- **Activities**: Suggestions for outdoor/indoor activities based on weather
  - Warm weather: Cycling, hiking, beach activities, park sports
  - Cold weather: Winter sports, ice skating, snow activities
  - Indoor alternatives during bad weather

- **Games**:
  - Flying disc games when wind conditions are favorable
  - Ball sports in good weather
  - Indoor game suggestions during inclement weather

- **Food & Drinks**:
  - Temperature-appropriate refreshment suggestions
  - Picnic recommendations
  - Food safety alerts in extreme conditions

### 🎨 User Interface
- Clean, modern Material-UI design
- Intuitive date selection
- Location search functionality
- Visual weather indicators and icons

## Technical Details

### Built With
- React + TypeScript
- Material-UI for components
- Chart.js for weather visualization
- Visual Crossing Weather API

### Key Components
- `WeatherPanel`: Main weather display
- `DayCards`: Weekly forecast view
- `WeatherGraph`: Interactive weather visualization
- `EventScoreCard`: Conditions and recommendations

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your Visual Crossing API key:
   ```
   VITE_VISUAL_CROSSING_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. **Set Location**: Enter your meetup location
2. **View Forecast**: See weather conditions for current and next week
3. **Check Recommendations**: Review suggested activities, games, and food options
4. **Monitor Score**: Use the event score to make informed decisions about your meetup

## Weather Score System

- **80-100**: Great conditions - Perfect for outdoor activities
- **60-79**: Fair conditions - Outdoor activities possible with preparation
- **0-59**: Poor conditions - Consider indoor alternatives

## Contributing

Feel free to submit issues and enhancement requests!