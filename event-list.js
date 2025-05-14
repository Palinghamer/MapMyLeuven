document.addEventListener("DOMContentLoaded", function () {
    const eventListContainer = document.getElementById("event-list-container");

    fetch("https://mapmyleuven.onrender.com/events")
        .then((res) => res.json())
        .then((data) => {
            const events = data.events;

            if (!Array.isArray(events)) {
                console.error("Expected an array, but got:", events);
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
                  <small class="text-muted">📍 ${event.location?.address || "Unknown"} | 🕒 ${event.time}</small>
                </p>
                <a href="event-details.html?id=${event._id}" class="btn btn-primary">Learn More</a>
              </div>
            </div>
          </div>
        `;

                eventListContainer.innerHTML += eventHTML;
            });
        })
        .catch((error) => {
            console.error("Error loading event list:", error);
            eventListContainer.innerHTML = `<p class="text-danger">Failed to load events. Please try again later.</p>`;
        });
});
