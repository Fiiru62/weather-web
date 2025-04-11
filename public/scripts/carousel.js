// carrousel para el bento

// Carrusel para el bento

const carouselContent = document.getElementById('carousel-content');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const sections = document.querySelectorAll('#carousel-content > section');
let currentIndex = 0;
let isAnimating = false; // Para evitar múltiples clics durante la animación

function updateCarousel(index) {
    if (isAnimating) return; // Evita que se ejecute si ya está animando
    isAnimating = true;

    sections.forEach((section, i) => {
        if (i === index) {
            section.style.opacity = '1';
            section.style.pointerEvents = 'auto';
        } else {
            section.style.opacity = '0';
            section.style.pointerEvents = 'none';
        }
    });

    // Transición del contenedor
    carouselContent.style.transition = 'transform 0.5s ease-in-out';
    carouselContent.style.transform = `translateX(-${index * 100}%)`;

    // Espera a que termine la animación para permitir nuevos clics
    setTimeout(() => {
        isAnimating = false;
    }, 500);
}

// Botón anterior
prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + sections.length) % sections.length;
    updateCarousel(currentIndex);
});

// Botón siguiente
nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % sections.length;
    updateCarousel(currentIndex);
});

// Inicializar carrusel
updateCarousel(currentIndex);


