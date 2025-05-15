import { filterEvents } from './filters.js';

document.addEventListener("DOMContentLoaded", async () => {
    const map = L.map("map").setView([50.879, 4.7], 13); // Leuven center

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const eventListEl = document.getElementById("event-list");
    const allMarkers = [];
    let allEvents = [];

    // Load events from backend
    try {
        const response = await fetch("https://mapmyleuven.onrender.com/events");
        const data = await response.json();
        allEvents = data.events;
        console.log("Fetched events:", allEvents);
        renderEvents(allEvents);
    } catch (err) {
        console.error("Error fetching events:", err);
    }

    // Renders filtered events to map + list
    function renderEvents(events) {
        // Clear map
        allMarkers.forEach(obj => map.removeLayer(obj.marker));
        allMarkers.length = 0;

        // Clear list
        eventListEl.innerHTML = "";

        if (events.length === 0) {
            eventListEl.innerHTML = "<p>No events found.</p>";
            return;
        }

        events.forEach(event => {
            const coords = event.location?.coordinates;
            if (!coords || coords.length !== 2) return;
            const [lng, lat] = coords;

            const imageUrl = event.imageUrl || null;
            const popupContent = `
                <div style="max-width: 220px;">
                    <strong>
                        <a href="event-details.html?id=${event._id}" target="_blank" style="color:#333; text-decoration:none;">
                            ${event.title || "Untitled Event"}
                        </a>
                    </strong><br/>
                    ${event.date?.substring(0, 10) || "No date"} ${event.time || ""}<br/>
                    ${event.location.address || ""}
                    ${imageUrl ? `<br/><img src="${imageUrl}" alt="event image" class="popup-event-img" />` : ""}
                </div>
            `;

            const marker = L.marker([lat, lng])
                .addTo(map)
                .bindPopup(popupContent);

            allMarkers.push({ marker, lat, lng });

            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <strong>${event.title || "Untitled Event"}</strong><br/>
                <small>
                    🕒 ${event.date?.substring(0, 10) || "No date"} ${event.time || ""}<br/>
                    📍 ${event.location?.address || "No address"}
                </small>
            `;

            listItem.addEventListener("click", () => {
                map.setView([lat, lng], 15);
                marker.openPopup();
            });

            eventListEl.appendChild(listItem);
        });
    }

    // Show/hide custom date range picker
    const dateFilter = document.getElementById('date-filter');
    const dateRangeDiv = document.getElementById('custom-date-range');
    if (dateFilter && dateRangeDiv) {
        dateFilter.addEventListener('change', () => {
            dateRangeDiv.style.display = dateFilter.value === 'range' ? 'block' : 'none';
        });
    }

    // Apply Filters button
    const applyBtn = document.getElementById("apply-filters");
    if (applyBtn) {
        applyBtn.addEventListener("click", () => {
            const filtered = filterEvents(allEvents, map);
            renderEvents(filtered);
        });
    }

    // Reset Filters button
    const resetBtn = document.getElementById("reset-filters");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            document.getElementById("category-filter").value = "all";
            document.getElementById("date-filter").value = "all";
            document.getElementById("min-price").value = "";
            document.getElementById("max-price").value = "";
            document.getElementById("start-date").value = "";
            document.getElementById("end-date").value = "";
            if (dateRangeDiv) dateRangeDiv.style.display = "none";
            const zoomCheckbox = document.getElementById("filter-by-map");
            if (zoomCheckbox) zoomCheckbox.checked = false;

            renderEvents(allEvents);
        });
    }

    // Update automatically when zooming/panning if checkbox is on
    map.on('moveend', () => {
        const zoomCheckbox = document.getElementById("filter-by-map");
        if (zoomCheckbox && zoomCheckbox.checked) {
            const filtered = filterEvents(allEvents, map);
            renderEvents(filtered);
        }
    });
});
