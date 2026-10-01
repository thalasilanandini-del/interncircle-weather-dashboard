# Live Weather Dashboard

A responsive weather dashboard developed as part of my InternCircle Web Development Internship.

## About the Project

This project allows users to search for a city and view its current weather conditions along with a 5-day forecast.

The application uses JavaScript Fetch API with async/await to retrieve real-time weather data and dynamically render it on the webpage.

## Features

- Search weather by city name
- Current temperature display
- Weather condition and weather icons
- Feels-like temperature
- Wind speed
- Local time
- 5-day weather forecast
- Daily maximum and minimum temperatures
- Rain probability
- Loading indicator
- Search input validation
- Error handling for invalid cities
- Responsive design for desktop, tablet and mobile devices
- Dynamic DOM rendering

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Fetch API
- Async/Await
- DOM Manipulation
- Open-Meteo Weather API

## API Flow

```text
City Name
    ↓
Geocoding API
    ↓
Latitude & Longitude
    ↓
Weather API
    ↓
Current Weather + 5-Day Forecast
    ↓
Dynamic Webpage Rendering
interncircle-weather-dashboard/
│
├── index.html
├── style.css
├── script.js
└── README.md