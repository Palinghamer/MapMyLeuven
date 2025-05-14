document.addEventListener("DOMContentLoaded", function () {
    fetch("https://mapmyleuven.onrender.com/events")
        .then(res => res.json())
        .then(data => {
            const events = data.events;
            const container = document.getElementById("event-list-container");
            container.innerHTML = "";

            if (!Array.isArray(events)) {
                console.error("Expected an array, but got:", events);
                return;
            }

            events
                .filter(event => event.title && event.location && event.date && event.time)
                .forEach(event => {
                    container.innerHTML += `
            <div class="col-md-4 mb-4">
              <div class="card h-100">
                <img src="${event.imageUrl?.startsWith('http')
                        ? event.imageUrl
                        : `https://mapmyleuven.onrender.com${event.imageUrl}`}" 
                     class="card-img-top" alt="${event.title}">

                <div class="card-body">
                  <h5 class="card-title">${event.title}</h5>
                  <p class="card-text">${event.description || "No description provided."}</p>
                  <p>
                    <strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}<br>
                    <strong>Time:</strong> ${event.time}<br>
                    <strong>Location:</strong> ${event.location?.address || "Unknown"}
                  </p>
                </div>
              </div>
            </div>
          `;
                });
        })
        .catch(error => {
            console.error("Error loading events:", error);
        });
});
