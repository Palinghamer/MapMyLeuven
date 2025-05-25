import { filterEvents } from './filters.js';

document.addEventListener("DOMContentLoaded", async function () {
    const eventListContainer = document.getElementById("event-list-container");
    let allEvents = [];

    // Fetch all events from the backend
    try {
        const response = await fetch("https://mapmyleuven.onrender.com/events");
        const data = await response.json();
        allEvents = data.events;
        renderEventCards(allEvents);

    } catch (error) {
        console.error("Error loading event list:", error);
        eventListContainer.innerHTML = `<p class="text-danger">Failed to load events. Please try again later.</p>`;
    }

    // Filter logic
    document.getElementById("apply-filters").addEventListener("click", () => {
        const filtered = filterEvents(allEvents);
        renderEventCards(filtered);
    });

    document.getElementById("reset-filters").addEventListener("click", () => {
        document.getElementById('category-filter').value = 'all';
        document.getElementById('date-filter').value = 'all';
        document.getElementById('min-price').value = '';
        document.getElementById('max-price').value = '';
        document.getElementById('start-date').value = '';
        document.getElementById('end-date').value = '';
        document.getElementById('custom-date-range').style.display = 'none';

        renderEventCards(allEvents);
    });

    // Toggle custom date range inputs
    document.getElementById('date-filter').addEventListener('change', function () {
        const range = document.getElementById('custom-date-range');
        range.style.display = this.value === 'range' ? 'block' : 'none';
    });

    function renderEventCards(events) {
        eventListContainer.innerHTML = '';

        if (events.length === 0) {
            eventListContainer.innerHTML = '<p class="text-muted">No events found.</p>';
            return;
        }

        events.forEach((event) => {
            const imageUrl = event.imageUrl?.startsWith("http")
                ? event.imageUrl
                : `https://mapmyleuven.onrender.com${event.imageUrl}`;

            const eventHTML = `
        <div class="col-md-4">
          <div class="card mb-4 shadow-sm">
            <img src="${imageUrl}" class="card-img-top" alt="${event.title}">
            <div class="card-body">
              <h5 class="card-title">${event.title}</h5>
              <p class="card-description">${event.description || "No description available."}</p>
              <p class="card-text">
                <small class="text-muted">📍 ${event.location?.address || "Unknown"} | 🕒 ${event.date?.substring(0, 10)} ${event.time}</small>
              </p>
              <a href="event-details.html?id=${event._id}" class="btn btn-primary">Learn More</a>
            </div>
          </div>
        </div>
      `;

            eventListContainer.innerHTML += eventHTML;
        });
    }
});
