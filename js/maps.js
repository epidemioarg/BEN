// js/maps.js

// Variable global para el mapa de Leaflet para poder destruirlo si es necesario
let dengueLeafletMap = null;

// Función para inicializar el mapa de Dengue
export function initDengueMap() {
    const mapElement = document.getElementById('dengueMap');

    if (mapElement) {
        // Si el mapa ya existe, destrúyelo antes de crear uno nuevo para evitar duplicados
        // Esto es importante cuando se carga dinámicamente el contenido de la página
        if (dengueLeafletMap) {
            dengueLeafletMap.remove();
            dengueLeafletMap = null; // Resetear la referencia
        }

        // Asegurarse de que el div del mapa tenga una altura definida
        mapElement.style.height = '400px'; // Asegura que el contenedor del mapa tenga altura
        mapElement.style.width = '100%'; // Asegura que el contenedor del mapa tenga ancho

        // Inicializar el mapa de Leaflet
        // Coordenadas centradas en Argentina [-34.6037, -58.3816] es Buenos Aires
        dengueLeafletMap = L.map('dengueMap').setView([-34.6037, -64.9673], 5); // Centro de Argentina, zoom 5

        // Añadir una capa de OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(dengueLeafletMap);

        // Ejemplo de marcadores para algunas provincias con incidencia de dengue
        const dengueHotspots = [
            { lat: -34.6037, lng: -58.3816, name: 'Buenos Aires', cases: '12,000+' },
            { lat: -31.4201, lng: -64.1888, name: 'Córdoba', cases: '6,000+' },
            { lat: -24.7821, lng: -65.4117, name: 'Salta', cases: '2,500+' },
            { lat: -26.8083, lng: -65.2226, name: 'Tucumán', cases: '1,800+' }
        ];

        dengueHotspots.forEach(hotspot => {
            L.marker([hotspot.lat, hotspot.lng])
                .addTo(dengueLeafletMap)
                .bindPopup(`<b>${hotspot.name}</b><br>Casos: ${hotspot.cases}`)
                .openPopup(); // Abre el popup por defecto para el primer marcador
        });

        // Opcional: Añadir un círculo para representar un área de alta incidencia (ej. Buenos Aires)
        L.circle([-34.6037, -58.3816], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 50000 // Radio en metros
        }).addTo(dengueLeafletMap).bindPopup("Área de alta incidencia en Buenos Aires");

        // Ocultar el placeholder una vez que el mapa se ha renderizado
        const placeholder = mapElement.nextElementSibling;
        if (placeholder && placeholder.classList.contains('placeholder-map')) {
            placeholder.style.display = 'none';
        }
    }
}