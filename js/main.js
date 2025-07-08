// js/main.js

// Importa las funciones de animación de GSAP desde el nuevo archivo
import { animateContentOut, animateContentIn, animateInitialLoad, initNavButtonHoverAnimations, animateSectionElementsIn } from './gsap-animations.js';
// Importa las funciones de inicialización de gráficos
import { initDengueCharts, initHantavirusCharts, initInfluenzaCharts } from './charts.js';
// Importa las funciones para los mapas
import { initDengueMap } from './maps.js';


document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-button');
    const contentContainer = document.getElementById('content-container');

    // Función para cargar contenido dinámicamente
    const loadContent = async (pageName, isInitialLoad = false) => { // Añadimos un parámetro para la carga inicial
        // Desactivar botones de navegación para evitar clics múltiples durante la transición
        navButtons.forEach(button => button.disabled = true);

        // Animar la salida del contenido actual antes de cargarlo
        // Solo animamos la salida si NO es la carga inicial Y si ya hay contenido
        if (!isInitialLoad && contentContainer.children.length > 0) {
            await animateContentOut(contentContainer); // Espera a que termine la animación de salida
        }

        try {
            const response = await fetch(`content/${pageName}.html`);
            if (!response.ok) {
                console.error(`Error al cargar la página ${pageName}.html:`, response.status, response.statusText);
                contentContainer.innerHTML = `<section class="boletin-page"><h2>Error al cargar</h2><p>No se pudo cargar el contenido de la sección "${pageName}". Asegúrate de que el archivo 'content/${pageName}.html' exista y esté accesible.</p></section>`;
                return;
            }
            const content = await response.text();
            
            // Reemplazar el contenido después de la animación de salida (o directamente si es carga inicial)
            contentContainer.innerHTML = content;

            // Animar la entrada del nuevo contenido (solo si no es la carga inicial, ya que animateSectionElementsIn se encarga del efecto en la carga inicial)
            if (!isInitialLoad) {
                animateContentIn(contentContainer); // Anima la entrada del nuevo contenido con movimiento y fade
            }
            
            // Animar los elementos individuales dentro de la nueva sección (SIEMPRE se aplica para el efecto "deslumbrante")
            const newSection = contentContainer.querySelector('.page-section');
            if (newSection) {
                animateSectionElementsIn(newSection);
            }

            // Desactivar todos los botones y activar el actual
            navButtons.forEach(button => {
                button.classList.remove('active');
            });
            const activeButton = document.querySelector(`.nav-button[data-page="${pageName}"]`);
            if (activeButton) {
                activeButton.classList.add('active');
            }

            // Después de cargar el contenido, reinicializar scripts específicos si existen
            initializePageSpecificScripts(pageName);
            
            // Re-adjuntar listeners a los botones del modal si la página los contiene
            attachModalListeners(); 

        } catch (error) {
            console.error('Error general al cargar el contenido:', error);
            contentContainer.innerHTML = `<section class="boletin-page"><h2>Error inesperado</h2><p>Ocurrió un error al cargar la sección "${pageName}".</p></section>`;
        } finally {
            // Volver a habilitar los botones una vez que la carga y animación han terminado
            navButtons.forEach(button => button.disabled = false);
        }
    };

    // Función para adjuntar listeners a los botones de modal
    const attachModalListeners = () => {
        const modalTriggers = document.querySelectorAll('.btn-modal-trigger');
        const closeButtons = document.querySelectorAll('.close-modal-btn');
        const modalOverlays = document.querySelectorAll('.modal-overlay');

        modalTriggers.forEach(button => {
            // Remover listeners previos para evitar duplicados
            button.removeEventListener('click', openModalHandler);
            button.addEventListener('click', openModalHandler);
        });

        closeButtons.forEach(button => {
            // Remover listeners previos para evitar duplicados
            button.removeEventListener('click', closeModalHandler);
            button.addEventListener('click', closeModalHandler);
        });

        modalOverlays.forEach(overlay => {
            // Remover listeners previos para evitar duplicados
            overlay.removeEventListener('click', closeOnOverlayClick);
            overlay.addEventListener('click', closeOnOverlayClick);
        });
    };

    // Manejador para abrir modales
    const openModalHandler = (event) => {
        const modalId = event.currentTarget.dataset.modalTarget;
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            document.body.classList.add('modal-open'); // Previene el scroll del body
            // Animar la entrada del modal
            gsap.fromTo(modal.querySelector('.modal-content'), 
                { opacity: 0, y: 50, scale: 0.9 }, 
                { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
            );
        }
    };

    // Manejador para cerrar modales
    const closeModalHandler = (event) => {
        const modal = event.currentTarget.closest('.modal-overlay');
        if (modal) {
            // Animar la salida del modal
            gsap.to(modal.querySelector('.modal-content'), 
                { opacity: 0, y: 50, scale: 0.9, duration: 0.3, ease: 'power2.in', onComplete: () => {
                    modal.classList.add('hidden');
                    document.body.classList.remove('modal-open'); // Permite el scroll del body
                }
            });
        }
    };

    // Cerrar modal al hacer clic en el overlay (fuera del contenido del modal)
    const closeOnOverlayClick = (event) => {
        if (event.target.classList.contains('modal-overlay')) {
            closeModalHandler(event);
        }
    };

    // Función para inicializar scripts específicos de la página
    const initializePageSpecificScripts = (pageName) => {
        // Asegúrate de que las funciones de gráficos se importen y estén disponibles.
        switch (pageName) {
            case 'inicio':
                // No hay scripts específicos para la página de inicio que necesiten reinicialización aquí.
                break;
            case 'dengue':
                if (typeof initDengueCharts === 'function') {
                    initDengueCharts();
                }
                if (typeof initDengueMap === 'function') {
                    initDengueMap();
                }
                break;
            case 'hantavirus':
                if (typeof initHantavirusCharts === 'function') {
                    initHantavirusCharts();
                }
                break;
            case 'influenza':
                if (typeof initInfluenzaCharts === 'function') {
                    initInfluenzaCharts();
                }
                break;
            default:
                console.log(`No hay scripts específicos para la página ${pageName}`);
        }
    };

    // Asignar eventos a los botones de navegación
    navButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const page = event.currentTarget.dataset.page;
            loadContent(page, false); // No es carga inicial al hacer clic
        });
    });

    // Cargar el contenido de "inicio" por defecto al cargar la página
    // Y animar la carga inicial del contenedor
    // Esta llamada es para la carga INICIAL
    loadContent('inicio', true); // Indica que es la carga inicial

    // Inicializar animaciones de hover para los botones de navegación
    initNavButtonHoverAnimations();
});