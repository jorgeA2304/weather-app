const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherResult = document.getElementById("weatherResult");




function getWeatherDescription(code) {
  if (code === 0) return "Clear sky";
  if (code === 1) return "Mainly clear";
  if (code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code === 45 || code === 48) return "Fog";
  if (code === 51 || code === 53 || code === 55) return "Drizzle";
  if (code === 61 || code === 63 || code === 65) return "Rain";
  if (code === 71 || code === 73 || code === 75) return "Snow";
  if (code === 95) return "Thunderstorm";

  return "Unknown weather";
}

function getWeatherIcon(code) {
  if (code === 0) return "☀️";
  if (code === 1 || code === 2) return "🌤️";
  if (code === 3) return "☁️";
  if (code === 45 || code === 48) return "🌫️";
  if (code === 51 || code === 53 || code === 55) return "🌦️";
  if (code === 61 || code === 63 || code === 65) return "🌧️";
  if (code === 71 || code === 73 || code === 75) return "❄️";
  if (code === 95) return "⛈️";

  return "🌍";
}


async function handleSearch() {
  const cityName = cityInput.value.trim();

  if (cityName === "") return;
  weatherResult.innerHTML = "<p>Loading...</p>";

  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;

  try {
    // 1) Find the city and get its coordinates
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      weatherResult.innerHTML = "<p>City not found.</p>";
      return;
    }

    const city = geoData.results[0];

    const latitude = city.latitude;
    const longitude = city.longitude;

    // 2) Use the coordinates to get current weather
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`;

    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    console.log("Weather response:", weatherData);

    const temperature = weatherData.current.temperature_2m;
    const weatherCode = weatherData.current.weather_code;
    const weatherDescription = getWeatherDescription(weatherCode);
    const weatherIcon = getWeatherIcon(weatherCode);

    weatherResult.innerHTML = `
    <div class="weather-icon">${weatherIcon}</div>
    <h2>${city.name}, ${city.country}</h2>
    <p><strong>Temperature:</strong> ${temperature}°C</p>
    <p><strong>Condition:</strong> ${weatherDescription}</p>
    `;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    weatherResult.innerHTML = "<p>Unable to load weather data. Please try again.</p>";
  }
}

searchBtn.addEventListener("click", function () {
  handleSearch();
});

cityInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    handleSearch();
  }
});