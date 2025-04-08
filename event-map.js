// event-map.js

document.addEventListener("DOMContentLoaded", () => {
    const mapElement = document.getElementById("map");
    if (!mapElement) return;

    // Set height to fill screen
    mapElement.style.height = "90vh";

    // Initialize map
    const map = L.map("map").setView([50.8798, 4.7005], 14);

    // Add OSM tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors"
    }).addTo(map);

    // Sample static events
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

    // Add markers
    events.forEach(event => {
        const marker = L.marker(event.location).addTo(map);
        marker.bindPopup(`
      <div style="min-width: 200px;">
        <h5>${event.name}</h5>
        <p><strong>${event.date}</strong> at ${event.time}</p>
        <p>${event.description}</p>
      </div>
    `);
    });
});
