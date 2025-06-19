const apiKey = "e9a75d8bf8802d37ce4fc794915b92cd"; 
let currentUnit = "metric";

function formatDateTime(dt, timezone) {
  // dt is UTC timestamp in seconds
  // timezone is offset from UTC in seconds (+/-)

  // Create UTC date from dt
  const utcDate = new Date(dt * 1000);

  const localTime = new Date(utcDate.getTime() + timezone * 1000);

  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: 'UTC' 
  };

  return localTime.toLocaleString("en-US", options);
}


function updateBackground(tempCelsius) {
  if (tempCelsius <= 10) {
    document.body.style.background = "linear-gradient(to right, #74ebd5, #ACB6E5)";
  } else if (tempCelsius <= 25) {
    document.body.style.background = "linear-gradient(to right, #a1c4fd, #c2e9fb)";
  } else {
    document.body.style.background = "linear-gradient(to right, #fbc7aa, #f9d976)";
  }
}

async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    alert("Please enter a city name.");
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${currentUnit}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("City not found");
    const data = await res.json();

    // Convert temperature to Celsius for background logic
    let tempC = currentUnit === "metric" ? data.main.temp : (data.main.temp - 32) * 5 / 9;
    updateBackground(tempC);

    const dateTimeStr = formatDateTime(data.dt, data.timezone);
    const unitSymbol = currentUnit === "metric" ? "°C" : "°F";

    document.getElementById("weatherResult").innerHTML = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <p><em>${dateTimeStr}</em></p>
      <p>🌡 Temperature: ${data.main.temp.toFixed(1)} ${unitSymbol}</p>
      <p>💧 Humidity: ${data.main.humidity}%</p>
      <p>🌬 Wind Speed: ${data.wind.speed} ${currentUnit === "metric" ? "m/s" : "mph"}</p>
      <p>🌥 Weather: ${data.weather[0].description}</p>
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather icon" />
      <br><br>
      <button onclick="toggleUnit()">Switch to ${currentUnit === "metric" ? "°F" : "°C"}</button>
    `;
  } catch (err) {
    document.getElementById("weatherResult").innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}

function toggleUnit() {
  currentUnit = currentUnit === "metric" ? "imperial" : "metric";
  getWeather();
}
