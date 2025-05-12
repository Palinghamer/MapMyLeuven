document.addEventListener("DOMContentLoaded", async () => {
    const map = L.map("map").setView([50.879, 4.7], 13); // Leuven center

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const eventListEl = document.getElementById("event-list");
    const allMarkers = [];

    try {
        // Fetch events from the backend
        const response = await fetch("https://mapmyleuven.onrender.com/events");
        const data = await response.json();
        const events = data.events;
        console.log("Fetched events:", events);

        events.forEach(event => {
            const coords = event.location?.coordinates;

            if (
                coords &&
                Array.isArray(coords) &&
                coords.length === 2 &&
                !isNaN(coords[0]) &&
                !isNaN(coords[1])
            ) {
                const [lng, lat] = coords; // GeoJSON order
                const imageUrl = event.imageUrl
                    ? `https://mapmyleuven.onrender.com${event.imageUrl}`
                    : null;

                const popupContent = `
                    <div style="max-width: 220px;">
                        <strong>${event.title || "Untitled Event"}</strong><br/>
                        ${event.date?.substring(0, 10) || "No date"} ${event.time || ""}<br/>
                        ${event.location.address || ""}
                        ${imageUrl ? `<br/><img src="${imageUrl}" alt="event image" style="width:100%; margin-top:5px; border-radius:6px;" />` : ""}
                    </div>
                `;

                const marker = L.marker([lat, lng])
                    .addTo(map)
                    .bindPopup(popupContent);

                allMarkers.push({ marker, lat, lng });

                // Add to event list
                const listItem = document.createElement("li");
                listItem.innerHTML = `
                    <strong>${event.title || "Untitled Event"}</strong><br/>
                    <small>
                        🕒 ${event.date?.substring(0, 10) || "No date"}
                        ${event.time || ""}
                        <br/>
                        📍 ${event.location?.address || "No address"}
                    </small>
                `;

                listItem.addEventListener("click", () => {
                    map.setView([lat, lng], 15);
                    marker.openPopup();
                });
                eventListEl.appendChild(listItem);
            } else {
                console.warn("Invalid coordinates for event:", coords);
            }
        });

    } catch (err) {
        console.error("Error fetching events:", err);
    }
});
