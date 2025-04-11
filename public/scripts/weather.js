// vinculo a la pagina openweather

const API_KEY = '5ee5a3987e58ad3d86bd7c6ffae042aa';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';


// Cuando el usuario hace la búsqueda:
function buscarClima() {
  const city = document.getElementById('search-input').value.trim();
  if (!city) return;

  // Guardar ciudad para usar en moreInformation.astro
  localStorage.setItem('city', city);

  // Luego llamás a tu función para buscar el clima
  getWeatherData(city);
}

// para elegir las unidades de los valores
let units = {
    pressure: 'hPa', // hPa, Pa, atm
    temp: 'C', // Cº, Fº
    wind: 'km/h' // m/s
};

// funciones de conversión
function convertPressure(hPa) {
    if (units.pressure === 'Pa') return `${(hPa * 100).toFixed(0)} Pa`;
    if (units.pressure === 'atm') return `${(hPa / 1013.25).toFixed(2)} atm`;
    return `${hPa} hPa`;
  }
  
  function convertTemp(celsius) {
    if (units.temp === 'F') return `${Math.round(celsius * 9 / 5 + 32)}°F`;
    return `${Math.round(celsius)}°C`;
  }
  
  function convertWind(kmh) {
    if (units.wind === 'm/s') return `${(kmh / 3.6).toFixed(1)} m/s`;
    return `${kmh} km/h`;
  }
  
  // función principal
  function updateWeatherCards(data) {
    // guardar última data globalmente para reusar al cambiar unidades
    window.latestWeatherData = data;
  
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
  
    const main = data.weather[0].main;
    const description = data.weather[0].description;
    const translated = traducciones[main] || main;
  
    document.getElementById('city').textContent = data.name;
    document.getElementById('weather').textContent = `${translated} - ${description}`;
    document.getElementById('temp').textContent = `${convertTemp(data.main.temp)}` /* (Sensación: ${convertTemp(data.main.feels_like)}) */ /* agrega la sensacion termica al lado de la temp */;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('wind').textContent = convertWind(data.wind.speed);
    document.getElementById('pressure').textContent = convertPressure(data.main.pressure);
    document.getElementById('feels-like').textContent = convertTemp(data.main.feels_like);
    document.getElementById('country').textContent = data.sys.country;

    // icono
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    const weatherIcon = document.getElementById('weather-icon');
    if (weatherIcon) {
      weatherIcon.src = iconUrl;
    }
  
    // mostrar hora local
    updateLocalTime(data.timezone);
  }

    // desplegar menú
    document.getElementById('toggle-menu')?.addEventListener('click', () => {
    const menu = document.getElementById('units-menu');
    menu.classList.toggle('hidden');
  });

  // esconder menú al hacer click en cualquier parte de la pantalla
  document.addEventListener('click', (e) => {
    const menu = document.getElementById('units-menu');
    const toggle = document.getElementById('toggle-menu');
  
    // si el menú no existe, salir
    if (!menu || !toggle) return;
  
    // si el click fue fuera del botón y fuera del menú, esconderlo
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      menu.classList.add('hidden');
    }
  });
  
    // cambios de unidades
    document.getElementById('unit-pressure')?.addEventListener('change', (e) => {
        units.pressure = e.target.value;
        if (window.latestWeatherData) updateWeatherCards(window.latestWeatherData);
  });
  
    document.getElementById('unit-temp')?.addEventListener('change', (e) => {
        units.temp = e.target.value;
        if (window.latestWeatherData) updateWeatherCards(window.latestWeatherData);
  });
  
  document.getElementById('unit-wind')?.addEventListener('change', (e) => {
        units.wind = e.target.value;
        if (window.latestWeatherData) updateWeatherCards(window.latestWeatherData);
  });
  
  
  // botón para cambiar unidades
  document.getElementById('toggle-units')?.addEventListener('click', () => {
    // Alternar presión
    units.pressure = units.pressure === 'hPa' ? 'Pa' : units.pressure === 'Pa' ? 'atm' : 'hPa';
    // Alternar temperatura
    units.temp = units.temp === 'C' ? 'F' : 'C';
    // Alternar viento
    units.wind = units.wind === 'km/h' ? 'm/s' : 'km/h';
    // Volver a renderizar con los nuevos valores
    if (window.latestWeatherData) {
      updateWeatherCards(window.latestWeatherData);
    }
});
  
  
// llaman a la api para buscar la ciudad mediante el nombre o coordenadas
async function fetchWeatherByCity(city) {
  try {
    const response = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=es`);
    const data = await response.json();
    if (data.cod === 200) {
      updateWeatherCards(data);
    } else {
      alert("Ciudad no encontrada");
    }
  } catch (err) {
    console.error("Error al buscar el clima por ciudad:", err);
  }
}

async function fetchWeatherByCoords(lat, lon) {
  try {
    const response = await fetch(`${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`);
    const data = await response.json();
    updateWeatherCards(data);
  } catch (err) {
    console.error("Error al buscar el clima por coordenadas:", err);
  }
}


// eventos del buscador
document.getElementById('search-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = document.getElementById('city-input').value;
  if (city) fetchWeatherByCity(city);
});

// eventos del botón "tu ubicación"
document.getElementById('geo-button')?.addEventListener('click', () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      (err) => {
        alert("No se pudo obtener tu ubicación.");
        console.error(err);
      }
    );
  } else {
    alert("Tu navegador no soporta geolocalización.");
  }
});

// card que muestra la hora y actualiza minuto a minuto
let timeInterval;

function updateLocalTime(timezoneOffsetInSeconds) {
  if (timeInterval) clearInterval(timeInterval); // detiene el intervalo anterior si existe

  function renderTime() {
    const nowUTC = new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60000);
    const localTime = new Date(nowUTC.getTime() + timezoneOffsetInSeconds * 1000);

    const hours = localTime.getHours().toString().padStart(2, '0');
    const minutes = localTime.getMinutes().toString().padStart(2, '0');

    const timeElem = document.getElementById('local-time');
    if (timeElem) {
      timeElem.textContent = `${hours}:${minutes}`;
    }
  }

  renderTime(); // renderiza la hora inmediatamente
  timeInterval = setInterval(renderTime, 60000); // actualiza la hora cada minuto
}

// funcion para intentar tomar valores de la ubicacion del usuario antes de cargar la pagina. si el usuario no tiene la ubicacion activada se la pide. en caso de rechazar, se ponen los valores de buenos aires
document.addEventListener("DOMContentLoaded", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude); // tu función ya debe existir
      },
      error => {
        // si el usuario no da permiso, mostrar una ciudad por defecto
        fetchWeather("Buenos Aires");
      }
    );
  } else {
    // si no hay geolocalización disponible, también usar una ciudad por defecto
    fetchWeather("Buenos Aires");
  }
});

