// script para cambiar el fondo de la página segun la hora

// /public/scripts/setBackground.js

window.addEventListener('DOMContentLoaded', () => {
    const img = document.getElementById('background-image');
  
    if (!img) return;
  
    const hour = new Date().getHours();
    let imgSrc = '';
  
    if (hour >= 6 && hour < 12) {
      imgSrc = '/public/img/pagina-clima-img-principal-amanecer.png'; // Mañana
    } else if (hour >= 12 && hour < 18) {
      imgSrc = '/public/img/pagina-clima-img-principal-atardecer.png'; // Tarde
    } else { /* >= 18 && < 6 */
      imgSrc = '/public/img/pagina-clima-img-principal-anochecer.png'; // Noche
    }
  
    img.src = imgSrc;
  });
  