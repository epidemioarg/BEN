// js/charts.js

// Función para inicializar el gráfico de Dengue por Provincia
export function initDengueCharts() {
    const ctx = document.getElementById('dengueProvinciaChart');
    if (ctx) {
        // Destruir el gráfico anterior si existe para evitar duplicados al recargar la página
        if (ctx.chart) {
            ctx.chart.destroy();
        }
        ctx.chart = new Chart(ctx, {
            type: 'bar', // Tipo de gráfico de barras
            data: {
                labels: ['Buenos Aires', 'CABA', 'Córdoba', 'Santa Fe', 'Salta', 'Mendoza', 'Tucumán'], // Etiquetas para las provincias
                datasets: [{
                    label: 'Tasas de Dengue', // Etiqueta de la serie de datos
                    data: [12000, 8500, 6000, 4000, 2500, 3200, 1800], // Datos de ejemplo
                    backgroundColor: [ // Colores de las barras
                        'rgba(255, 99, 132, 0.7)', // Rojo
                        'rgba(54, 162, 235, 0.7)', // Azul
                        'rgba(255, 206, 86, 0.7)', // Amarillo
                        'rgba(75, 192, 192, 0.7)', // Verde
                        'rgba(153, 102, 255, 0.7)', // Púrpura
                        'rgba(255, 159, 64, 0.7)', // Naranja
                        'rgba(199, 199, 199, 0.7)' // Gris
                    ],
                    borderColor: [ // Bordes de las barras
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(199, 199, 199, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true, // Hace que el gráfico sea responsivo
                maintainAspectRatio: false, // Permite que el gráfico no mantenga su relación de aspecto original
                scales: {
                    y: {
                        beginAtZero: true, // El eje Y comienza en cero
                        title: {
                            display: true,
                            text: 'Número de Tasas' // Título del eje Y
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Provincia' // Título del eje X
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Tasa de Dengue por Provincia', // Título del gráfico
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        display: false // Oculta la leyenda si solo hay una serie
                    }
                }
            }
        });
        // Ocultar el placeholder una vez que el gráfico se ha renderizado
        const placeholder = ctx.nextElementSibling;
        if (placeholder && placeholder.classList.contains('placeholder-chart')) {
            placeholder.style.display = 'none';
        }
    }
}

// Función para inicializar el gráfico de Hantavirus por Semana Epidemiológica
export function initHantavirusCharts() {
    const ctx = document.getElementById('hantavirusChart');
    if (ctx) {
        if (ctx.chart) {
            ctx.chart.destroy();
        }
        // Crear etiquetas para 20 semanas (SE01, SE02... SE20)
        const semanas = Array.from({ length: 20 }, (_, i) => `SE${(i + 1).toString().padStart(2, '0')}`); 
        // Datos de ejemplo para 20 semanas
        const datosSemanales = [1, 0, 2, 1, 0, 3, 1, 0, 0, 1, 2, 0, 1, 1, 0, 0, 2, 1, 0, 1]; 

        ctx.chart = new Chart(ctx, {
            type: 'line', // Tipo de gráfico de línea
            data: {
                labels: semanas, // Etiquetas de semana epidemiológica
                datasets: [{
                    label: 'Casos de Hantavirus 2025',
                    data: datosSemanales, // Datos de ejemplo
                    borderColor: 'rgba(255, 99, 132, 1)', // Color de la línea
                    backgroundColor: 'rgba(255, 99, 132, 0.2)', // Color del área bajo la línea
                    tension: 0.4, // Curvatura de la línea
                    fill: true // Rellena el área bajo la línea
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Número de Casos'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Semana Epidemiológica'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Tendencia Semanal de Hantavirus',
                        font: {
                            size: 16
                        }
                    }
                }
            }
        });
        const placeholder = ctx.nextElementSibling;
        if (placeholder && placeholder.classList.contains('placeholder-chart')) {
            placeholder.style.display = 'none';
        }
    }
}

// Función para inicializar el gráfico de Influenza
export function initInfluenzaCharts() {
    const ctx = document.getElementById('influenzaChart');
    if (ctx) {
        if (ctx.chart) {
            ctx.chart.destroy();
        }
        ctx.chart = new Chart(ctx, {
            type: 'pie', // Tipo de gráfico de torta
            data: {
                labels: ['Influenza A', 'Influenza B', 'VSR', 'Adenovirus', 'Otros'], // Etiquetas para las secciones
                datasets: [{
                    label: 'Detecciones Virales',
                    data: [300, 150, 400, 50, 100], // Datos de ejemplo
                    backgroundColor: [ // Colores de las secciones
                        'rgba(54, 162, 235, 0.7)', // Azul
                        'rgba(75, 192, 192, 0.7)', // Verde
                        'rgba(255, 206, 86, 0.7)', // Amarillo
                        'rgba(153, 102, 255, 0.7)', // Púrpura
                        'rgba(255, 99, 132, 0.7)' // Rojo
                    ],
                    borderColor: '#ffffff', // Borde blanco entre secciones
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Virus Respiratorios',
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        position: 'right', // Posición de la leyenda
                        labels: {
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });
        const placeholder = ctx.nextElementSibling;
        if (placeholder && placeholder.classList.contains('placeholder-chart')) {
            placeholder.style.display = 'none';
        }
    }
}