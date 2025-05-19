export function filterEvents(events, map) {
    const selectedCategory = document.getElementById("category-filter")?.value || "all";
    const selectedDate = document.getElementById("date-filter")?.value || "all";
    const minPrice = parseFloat(document.getElementById("min-price")?.value) || 0;
    const maxPrice = parseFloat(document.getElementById("max-price")?.value) || Infinity;
    const startDate = document.getElementById("start-date")?.value;
    const endDate = document.getElementById("end-date")?.value;
    const onlyShowInMapView = document.getElementById("filter-by-map")?.checked;

    const now = new Date();
    const mapBounds = onlyShowInMapView && map ? map.getBounds() : null;

    return events.filter(event => {
        const eventDate = new Date(event.date);
        const price = parseFloat(event.price?.replace(',', '.') || "0");

        const matchesCategory =
            selectedCategory === 'all' ||
            event.category?.toLowerCase() === selectedCategory.toLowerCase();

        const matchesPrice = price >= minPrice && price <= maxPrice;

        let matchesDate = true;
        if (selectedDate === 'today') {
            matchesDate = eventDate.toDateString() === now.toDateString();
        } else if (selectedDate === 'tomorrow') {
            const tomorrow = new Date();
            tomorrow.setDate(now.getDate() + 1);
            matchesDate = eventDate.toDateString() === tomorrow.toDateString();
        } else if (selectedDate === 'week') {
            const weekFromNow = new Date();
            weekFromNow.setDate(now.getDate() + 7);
            matchesDate = eventDate >= now && eventDate <= weekFromNow;
        } else if (selectedDate === 'month') {
            const monthFromNow = new Date();
            monthFromNow.setMonth(now.getMonth() + 1);
            matchesDate = eventDate >= now && eventDate <= monthFromNow;
        } else if (selectedDate === 'range' && startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            matchesDate = eventDate >= start && eventDate <= end;
        }

        let matchesMapBounds = true;
        if (mapBounds) {
            const [lng, lat] = event.location?.coordinates || [];
            if (!isNaN(lat) && !isNaN(lng)) {
                const latLng = L.latLng(lat, lng);
                matchesMapBounds = mapBounds.contains(latLng);
            } else {
                matchesMapBounds = false;
            }
        }

        return matchesCategory && matchesPrice && matchesDate && matchesMapBounds;
    });
}
