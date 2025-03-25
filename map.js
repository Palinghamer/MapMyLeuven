document.addEventListener("DOMContentLoaded", function () {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    // Initialize the map
    const map = L.map('map').setView([50.8798, 4.7005], 13);

    // Add OSM tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add a welcome marker
    L.marker([50.8798, 4.7005])
        .addTo(map)
        .bindPopup('Welcome to Map My Leuven!')
        .openPopup();
});
