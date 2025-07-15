document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('#main-nav .nav-button');
    const contentContainer = document.getElementById('content-container');
    const modalOverlays = document.querySelectorAll('.modal-overlay');
    const closeModalButtons = document.querySelectorAll('.close-modal-btn');
    const currentWeekNumberSpan = document.getElementById('current-week-number');

    // Function to calculate the epidemiological week number (Sunday as first day)
    const getWeekNumber = (d) => {
        // Copy date so don't modify original
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        // Set to nearest Sunday: current date + (4 - current day number)
        // Adjust for Sunday being 0, Monday 1, etc.
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        // Get first day of year
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        // Calculate full weeks to nearest Sunday
        const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        return weekNo;
    };

    // Update the current week number in the header
    if (currentWeekNumberSpan) {
        const today = new Date();
        currentWeekNumberSpan.textContent = getWeekNumber(today);
    }

    // Función para cargar contenido dinámicamente
    const loadContent = async (pageName) => {
        try {
            const response = await fetch(`content/${pageName}.html`);
            if (!response.ok) {
                throw new Error(`No se pudo cargar el contenido: ${response.statusText}`);
            }
            const htmlContent = await response.text();
            contentContainer.innerHTML = htmlContent;

            // Después de cargar el contenido, necesitamos inicializar cualquier script específico
            // o elementos interactivos (gráficos, mapas) que estén en ese HTML.
            initializePageSpecificScripts(pageName);
            
            // Reasignar eventos a botones de "Más Información" si existen en el nuevo contenido
            const moreInfoBtns = contentContainer.querySelectorAll('.more-info-btn');
            moreInfoBtns.forEach(btn => {
                btn.onclick = () => {
                    const modalId = btn.dataset.modal;
                    const modal = document.getElementById(modalId);
                    if (modal) {
                        modal.classList.add('active');
                        modal.classList.remove('hidden');
                    }
                };
            });

        } catch (error) {
            console.error('Error al cargar la página:', error);
            contentContainer.innerHTML = `<p>Error al cargar el contenido de esta sección. Por favor, intente de nuevo más tarde.</p>`;
        }
    };

    // Función para inicializar scripts específicos de cada página
    // Aquí es donde pondrás la lógica para tus gráficos Chart.js y mapas Leaflet
    const initializePageSpecificScripts = (pageName) => {
        switch (pageName) {
            case 'sarampion':
                // Código para inicializar el gráfico de Sarampión
                const sarampionCtx = document.getElementById('sarampionCasosChart');
                if (sarampionCtx) {
                    new Chart(sarampionCtx, {
                        type: 'bar',
                        data: {
                            labels: ['SE 1', 'SE 5', 'SE 9', 'SE 13', 'SE 17', 'SE 21', 'SE 23'],
                            datasets: [{
                                label: 'Casos Confirmados',
                                data: [5, 8, 12, 15, 10, 7, 3],
                                backgroundColor: 'rgba(93, 171, 169, 0.8)', // Verde institucional
                                borderColor: 'rgba(93, 171, 169, 1)',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            responsive: true,
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            },
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Casos de Sarampión por Semana Epidemiológica (2025)'
                                }
                            }
                        }
                    });
                }
                break;
            case 'dengue':
                // Código para inicializar el mapa de Dengue
                const dengueMapDiv = document.getElementById('dengueMap');
                if (dengueMapDiv) {
                    // Asegúrate de que el mapa no se inicialice múltiples veces
                    if (dengueMapDiv._leaflet_id) {
                        dengueMapDiv.remove(); // Elimina el div si ya tiene un mapa
                        const newDengueMapDiv = document.createElement('div');
                        newDengueMapDiv.id = 'dengueMap';
                        newDengueMapDiv.className = 'placeholder-map';
                        document.querySelector('.boletin-page[id="dengue"] .chart-wrapper').appendChild(newDengueMapDiv);
                        dengueMapDiv = newDengueMapDiv;
                    }
                    
                    const map = L.map('dengueMap').setView([-34.6037, -58.3816], 5); // Coordenadas de Argentina

                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }).addTo(map);

                    // Ejemplo de marcador
                    L.marker([-34.6037, -58.3816]).addTo(map)
                        .bindPopup('Buenos Aires: X casos de Dengue.')
                        .openPopup();
                }
                break;
            case 'influenza':
                // Código para inicializar el gráfico de Influenza
                const influenzaCtx = document.getElementById('influenzaVacunacionChart');
                if (influenzaCtx) {
                    new Chart(influenzaCtx, {
                        type: 'pie',
                        data: {
                            labels: ['Vacunados', 'No Vacunados'],
                            datasets: [{
                                data: [75, 25], // Ejemplo: 75% vacunados
                                backgroundColor: ['#5DABA9', '#FF6384'], // Verde institucional, Rojo
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Cobertura de Vacunación contra Influenza (Grupos de Riesgo)'
                                }
                            }
                        }
                    });
                }
                break;
            // Agrega más casos para otras páginas si tienen scripts específicos
        }
    };


    // Manejador de eventos para los botones de navegación
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Eliminar 'active' de todos los botones y añadirlo al botón clicado
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const pageName = button.dataset.page;
            // Solo cargar si tiene data-page (excluye el botón de NotebookLM que abre una nueva ventana)
            if (pageName) { 
                loadContent(pageName);
            }
        });
    });

    // Manejador de eventos para cerrar modales
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal-overlay');
            if (modal) {
                modal.classList.remove('active');
                modal.classList.add('hidden');
            }
        });
    });

    // Cargar la página de inicio al cargar la aplicación por primera vez
    loadContent('inicio');
});
