// js/gsap-animations.js

/**
 * Anima la salida de un elemento antes de que se reemplace su contenido.
 * @param {HTMLElement} element - El elemento que se va a animar.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la animación de salida ha terminado.
 */
export function animateContentOut(element) {
    return new Promise(resolve => {
        // Animación de desvanecimiento y ligero escalado hacia abajo
        gsap.to(element, {
            opacity: 0,
            y: 20, // Se mueve ligeramente hacia abajo al salir
            duration: 0.3, // Duración de la animación de salida
            ease: "power2.in",
            onComplete: resolve // Resuelve la promesa cuando la animación termina
        });
    });
}

/**
 * Anima la entrada de un elemento después de que se ha cargado su contenido.
 * @param {HTMLElement} element - El elemento que se va a animar.
 */
export function animateContentIn(element) {
    // Asegurarse de que el elemento esté visible antes de animar
    gsap.set(element, { opacity: 0, y: -20 }); // Establecer estado inicial (arriba y transparente)

    // Animación de desvanecimiento y ligero escalado hacia arriba
    gsap.to(element, {
        opacity: 1,
        y: 0, // Vuelve a su posición original
        duration: 0.5, // Duración de la animación de entrada
        ease: "power2.out"
    });
}

/**
 * Anima los elementos individuales dentro de una sección recién cargada.
 * Esto da un efecto de "escritura" o aparición gradual.
 * @param {HTMLElement} sectionElement - El elemento <section> que contiene el contenido.
 */
export function animateSectionElementsIn(sectionElement) {
    // Selecciona los elementos comunes dentro de la sección para animar
    // Puedes ajustar estos selectores para ser más específico (ej. 'h2, h3, p, img, .chart-wrapper, .btn-modal-trigger')
    const elementsToAnimate = sectionElement.querySelectorAll('h2, h3, h4, p, img, .chart-wrapper, .placeholder-map, .btn-modal-trigger');
    
    gsap.from(elementsToAnimate, {
        opacity: 0,
        y: 30, // Se desliza desde abajo
        stagger: 0.08, // Retraso entre la animación de cada elemento
        duration: 0.6,
        ease: "power2.out",
        delay: 0.1 // Pequeño retraso para que la sección general ya haya entrado
    });
}


// Animación inicial al cargar la página (para el content-container)
export function animateInitialLoad(element) {
    gsap.fromTo(element, 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.2 }
    );
    // Después de la animación inicial del contenedor, anima sus elementos
    animateSectionElementsIn(element);
}

// Animación de los botones de navegación al pasar el ratón (hover)
export function initNavButtonHoverAnimations() {
    gsap.defaults({ overwrite: "auto" }); // Evita conflictos de animaciones

    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                scale: 1.05,
                backgroundColor: '#7a9cb8', // Color de hover
                duration: 0.2,
                ease: 'power1.out'
            });
        });
        button.addEventListener('mouseleave', () => {
            // Solo si no está activo, vuelve al color original
            if (!button.classList.contains('active')) {
                gsap.to(button, {
                    scale: 1,
                    backgroundColor: '#5a7d9a', // Color por defecto
                    duration: 0.2,
                    ease: 'power1.out'
                });
            } else {
                // Si está activo, vuelve al color de activo
                gsap.to(button, {
                    scale: 1,
                    backgroundColor: '#1abc9c',
                    duration: 0.2,
                    ease: 'power1.out'
                });
            }
        });

        // Animación para el botón activo
        button.addEventListener('click', (e) => {
            // Primero, desactivar todos los botones y luego activar el actual
            navButtons.forEach(btn => {
                btn.classList.remove('active');
                gsap.to(btn, { backgroundColor: '#5a7d9a', duration: 0.2 }); // Resetear no activos
            });
            e.currentTarget.classList.add('active');
            gsap.to(e.currentTarget, { 
                backgroundColor: '#1abc9c', // Color de activo
                boxShadow: '0 0 10px rgba(26, 188, 156, 0.6)',
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}