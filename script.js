// =========================
// API URLS
// =========================

const GEOCODING_API =
    "https://geocoding-api.open-meteo.com/v1/search";

const WEATHER_API =
    "https://api.open-meteo.com/v1/forecast";


// =========================
// HTML ELEMENTS
// =========================

const searchForm =
    document.getElementById("searchForm");

const cityInput =
    document.getElementById("cityInput");

const searchButton =
    document.getElementById("searchButton");

const errorMessage =
    document.getElementById("errorMessage");

const loading =
    document.getElementById("loading");

const weatherContent =
    document.getElementById("weatherContent");

const cityName =
    document.getElementById("cityName");

const weatherDescription =
    document.getElementById("weatherDescription");

const weatherIcon =
    document.getElementById("weatherIcon");

const temperature =
    document.getElementById("temperature");

const feelsLike =
    document.getElementById("feelsLike");

const windSpeed =
    document.getElementById("windSpeed");

const localTime =
    document.getElementById("localTime");

const forecastContainer =
    document.getElementById("forecastContainer");


// =========================
// WEATHER CODE INFORMATION
// =========================

function getWeatherInfo(code) {

    const weatherMap = {

        0: {
            description: "Clear sky",
            icon: "☀️"
        },

        1: {
            description: "Mainly clear",
            icon: "🌤️"
        },

        2: {
            description: "Partly cloudy",
            icon: "⛅"
        },

        3: {
            description: "Overcast",
            icon: "☁️"
        },

        45: {
            description: "Fog",
            icon: "🌫️"
        },

        48: {
            description: "Rime fog",
            icon: "🌫️"
        },

        51: {
            description: "Light drizzle",
            icon: "🌦️"
        },

        53: {
            description: "Moderate drizzle",
            icon: "🌦️"
        },

        55: {
            description: "Dense drizzle",
            icon: "🌧️"
        },

        61: {
            description: "Light rain",
            icon: "🌦️"
        },

        63: {
            description: "Moderate rain",
            icon: "🌧️"
        },

        65: {
            description: "Heavy rain",
            icon: "🌧️"
        },

        71: {
            description: "Light snow",
            icon: "🌨️"
        },

        73: {
            description: "Moderate snow",
            icon: "🌨️"
        },

        75: {
            description: "Heavy snow",
            icon: "❄️"
        },

        80: {
            description: "Light rain showers",
            icon: "🌦️"
        },

        81: {
            description: "Rain showers",
            icon: "🌧️"
        },

        82: {
            description: "Heavy rain showers",
            icon: "⛈️"
        },

        95: {
            description: "Thunderstorm",
            icon: "⛈️"
        },

        96: {
            description: "Thunderstorm with hail",
            icon: "⛈️"
        },

        99: {
            description: "Heavy thunderstorm with hail",
            icon: "⛈️"
        }

    };


    return weatherMap[code] || {
        description: "Unknown weather",
        icon: "🌤️"
    };
}


// =========================
// SEARCH CITY
// =========================

async function searchCity(city) {

    const url =
        `${GEOCODING_API}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;


    const response = await fetch(url);


    if (!response.ok) {

        throw new Error(
            "Unable to search for the city."
        );

    }


    const data = await response.json();


    if (!data.results || data.results.length === 0) {

        throw new Error(
            "City not found. Please check the spelling and try again."
        );

    }


    return data.results[0];
}


// =========================
// GET WEATHER
// =========================

async function getWeather(latitude, longitude, timezone) {

    const url =
        `${WEATHER_API}?latitude=${latitude}` +
        `&longitude=${longitude}` +
        `&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
        `&timezone=${encodeURIComponent(timezone)}` +
        `&forecast_days=5`;


    const response = await fetch(url);


    if (!response.ok) {

        throw new Error(
            "Unable to retrieve weather information."
        );

    }


    return await response.json();
}


// =========================
// DISPLAY CURRENT WEATHER
// =========================

function displayCurrentWeather(city, weather) {

    const current = weather.current;

    const weatherInfo =
        getWeatherInfo(current.weather_code);


    cityName.textContent =
        `${city.name}, ${city.country_code}`;

    weatherDescription.textContent =
        weatherInfo.description;

    weatherIcon.textContent =
        weatherInfo.icon;

    temperature.textContent =
        Math.round(current.temperature_2m);

    feelsLike.textContent =
        `${Math.round(current.apparent_temperature)}°C`;

    windSpeed.textContent =
        `${Math.round(current.wind_speed_10m)} km/h`;


    const currentDate =
        new Date(current.time);


    localTime.textContent =
        currentDate.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );
}


// =========================
// DISPLAY FORECAST
// =========================

function displayForecast(weather) {

    forecastContainer.innerHTML = "";


    const daily = weather.daily;


    for (let i = 0; i < daily.time.length; i++) {

        const date =
            new Date(`${daily.time[i]}T12:00:00`);


        const weatherInfo =
            getWeatherInfo(
                daily.weather_code[i]
            );


        const dayName =
            date.toLocaleDateString(
                "en-US",
                {
                    weekday: "short"
                }
            );


        const maxTemp =
            Math.round(
                daily.temperature_2m_max[i]
            );


        const minTemp =
            Math.round(
                daily.temperature_2m_min[i]
            );


        const rainChance =
            daily.precipitation_probability_max[i];


        const card =
            document.createElement("article");


        card.className =
            "forecast-card";


        card.innerHTML = `

            <p class="forecast-day">
                ${dayName}
            </p>

            <div class="forecast-icon">
                ${weatherInfo.icon}
            </div>

            <p class="forecast-description">
                ${weatherInfo.description}
            </p>

            <div class="forecast-temperature">

                <span class="max-temp">
                    ${maxTemp}°C
                </span>

                <span class="min-temp">
                    ${minTemp}°C
                </span>

            </div>

            <p class="rain-chance">
                💧 ${rainChance ?? 0}% rain
            </p>

        `;


        forecastContainer.appendChild(card);

    }
}


// =========================
// SHOW LOADING
// =========================

function showLoading() {

    loading.classList.add("show");

    weatherContent.classList.remove("show");

    searchButton.disabled = true;

    searchButton.textContent =
        "Loading...";
}


// =========================
// HIDE LOADING
// =========================

function hideLoading() {

    loading.classList.remove("show");

    searchButton.disabled = false;

    searchButton.textContent =
        "Search";
}


// =========================
// DISPLAY ERROR
// =========================

function showError(message) {

    errorMessage.textContent =
        message;

}


// =========================
// CLEAR ERROR
// =========================

function clearError() {

    errorMessage.textContent = "";

}


// =========================
// SEARCH EVENT
// =========================

searchForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const city =
            cityInput.value.trim();


        // Input validation
        if (city === "") {

            showError(
                "Please enter a city name."
            );

            cityInput.focus();

            return;
        }


        // Minimum search length
        if (city.length < 2) {

            showError(
                "Please enter at least 2 characters."
            );

            cityInput.focus();

            return;
        }


        clearError();

        showLoading();


        try {

            // Find city coordinates
            const location =
                await searchCity(city);


            // Get weather data
            const weather =
                await getWeather(
                    location.latitude,
                    location.longitude,
                    weatherTimezone(location)
                );


            // Display data
            displayCurrentWeather(
                location,
                weather
            );

            displayForecast(
                weather
            );


            weatherContent.classList.add(
                "show"
            );


        } catch (error) {

            console.error(
                "Weather error:",
                error
            );


            showError(
                error.message ||
                "Something went wrong. Please try again."
            );


            weatherContent.classList.remove(
                "show"
            );


        } finally {

            hideLoading();

        }

    }
);


// =========================
// TIMEZONE HELPER
// =========================

function weatherTimezone(location) {

    return location.timezone || "auto";

}


// =========================
// INITIAL LOAD
// =========================

// Load Chennai weather when page opens.
// You can remove this section if you want
// the user to search manually every time.

cityInput.value = "Chennai";

searchForm.dispatchEvent(
    new Event("submit")
);