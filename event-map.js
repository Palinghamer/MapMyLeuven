document.addEventListener("DOMContentLoaded", async () => {
    // Initialize the map
    const map = L.map("map").setView([50.879, 4.7], 13); // Leuven center

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    try {
        // Fetch events from the backend
        const response = await fetch("http://localhost:3000/events");
        const events = await response.json();
        console.log("Fetched events:", events);

        events.forEach(event => {
            console.log("Raw event:", event);

            const coords = event.location?.coordinates;

            if (
                coords &&
                Array.isArray(coords) &&
                coords.length === 2 &&
                !isNaN(coords[0]) &&
                !isNaN(coords[1])
            ) {
                const [lng, lat] = coords; // GeoJSON order
                console.log(`Placing marker at lat: ${lat}, lng: ${lng}`);

                L.marker([lat, lng]) // Leaflet wants [lat, lng]
                    .addTo(map)
                    .bindPopup(`
                <strong>${event.title || "Untitled Event"}</strong><br/>
                ${event.date || "No date provided"}<br/>
                ${event.location.address || ""}
            `);
            } else {
                console.warn("Invalid coordinates for event:", coords);
            }
        });

    } catch (err) {
        console.error("Error fetching events:", err);
    }
});