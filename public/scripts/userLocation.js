// permite al usuario poner su ubicacion actual en la pagina

document.getElementById('geo-button')?.addEventListener('click', () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Ubicación detectada:", latitude, longitude);
        // fetchWeatherByCoords(latitude, longitude); // Podés conectar esto con OpenWeather
      },
      (error) => {
        alert("No se pudo obtener la ubicación.");
        console.error(error);
      }
    );
  } else {
    alert("Tu navegador no soporta geolocalización.");
  }
});
