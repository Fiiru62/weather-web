const API_KEY = '5ee5a3987e58ad3d86bd7c6ffae042aa';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

const traducciones = {
  Rain: "Lluvia",
  Clouds: "Nublado",
  Clear: "Despejado",
  Snow: "Nieve",
  Thunderstorm: "Tormenta",
  Drizzle: "Llovizna",
  Mist: "Niebla",
  Smoke: "Humo",
  Haze: "Calina",
  Dust: "Polvo",
  Fog: "Niebla",
  Sand: "Arena",
  Ash: "Ceniza",
  Squall: "Chubasco",
  Tornado: "Tornado",
};

function formatHora(timestamp, offset) {
  const localTime = new Date((timestamp + offset) * 1000);
  return localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function updateLocalTime(offset) {
  const local = new Date(new Date().getTime() + offset * 1000);
  document.getElementById('local-time').textContent = local.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function updateWeatherCards(data) {
  const main = data.weather[0].main;
  const description = data.weather[0].description;
  const translated = traducciones[main] || main;

  document.getElementById('clouds').textContent = `${data.clouds.all}%`;
  document.getElementById('visibility').textContent = `${(data.visibility / 1000).toFixed(1)} km`;
  document.getElementById('sunrise').textContent = formatHora(data.sys.sunrise, data.timezone);
  document.getElementById('sunset').textContent = formatHora(data.sys.sunset, data.timezone);

  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  const weatherIcon = document.getElementById('weather-icon');
  if (weatherIcon) weatherIcon.src = iconUrl;

  updateLocalTime(data.timezone);
}

async function getWeatherData() {
  const city = localStorage.getItem('city') || 'Buenos Aires'; // SIEMPRE usa la ciudad buscada
  const url = `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=es`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    updateWeatherCards(data);
  } catch (err) {
    console.error("Error obteniendo datos:", err.message);
  }
}

// Llamar al cargar la página
getWeatherData();
