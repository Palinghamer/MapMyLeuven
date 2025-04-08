// event-map.js

// 1. Initialize the map
const map = L.map('map').setView([50.8798, 4.7005], 14); // Leuven center

// 2. Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// 3. Resize map container on load
window.addEventListener('load', () => {
    const mapElement = document.getElementById('map');
    mapElement.style.height = '90vh'; // full screen height
});

// 4. Sample events (these will come from your DB later)
const events = [
    {
        name: "Beiaardcantus",
        location: [50.8788, 4.7010],
        date: "May 14",
        time: "18:00",
        description: "Join the traditional student singing event at Ladeuzeplein."
    },
    {
        name: "KU Leuven 600",
        location: [50.8784, 4.7003],
        date: "Apr 10",
        time: "10:00",
        description: "Celebrate 600 years of academic excellence."
    },
    {
        name: "The Longest Day",
        location: [50.8754, 4.7060],
        date: "June 21",
        time: "All Day",
        description: "Summer solstice celebrations throughout the city."
    }
];

// 5. Add markers with popups
events.forEach(event => {
    const marker = L.marker(event.location).addTo(map);
    marker.bindPopup(`
        <div style="min-width:200px">
            <strong>${event.name}</strong><br />
            <em>${event.date} @ ${event.time}</em><br />
            ${event.description}
        </div>
    `);
});
