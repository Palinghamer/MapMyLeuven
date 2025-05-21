//this is a general file for all Javascript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load navbar
    loadNavbar();

    // Initialize carousel
    initCarousel();

    // Initialize map/list toggle
    initMapListToggle();
});

// Function to load navbar
function loadNavbar() {
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
            // After navbar is loaded, set the active state
            setActiveNavLink();

            // Add event listeners to nav links
            addNavLinkListeners();
        });
}

// Function to set the active nav link based on current page
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'homepage.html';
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Function to add click listeners to nav links
function addNavLinkListeners() {
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            navLinks.forEach(item => {
                item.classList.remove('active');
            });

            // Add active class to the clicked link
            this.classList.add('active');
        });
    });
}

// Function to initialize carousel
function initCarousel() {
    // Get carousel elements
    const carousel = document.querySelector('.events-carousel');
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');

    // If carousel elements don't exist on this page, exit the function
    if (!carousel || !prevArrow || !nextArrow) return;

    // Create carousel indicators
    createCarouselIndicators();

    // Get all event cards and calculate their width
    const eventCards = document.querySelectorAll('.event-card');
    const cardWidth = eventCards[0].offsetWidth + parseInt(window.getComputedStyle(eventCards[0]).marginLeft) * 2;

    // Calculate how many cards to show per view based on screen width
    let cardsPerView = getCardsPerView();
    let totalSlides = Math.ceil(eventCards.length / cardsPerView);
    let currentSlide = 0;

    // Function to update the carousel position
    function updateCarousel() {
        const scrollAmount = currentSlide * cardsPerView * cardWidth;
        carousel.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });

        // Update active dot
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    // Previous arrow click handler
    prevArrow.addEventListener('click', function() {
        if (currentSlide > 0) {
            currentSlide--;
        } else {
            currentSlide = totalSlides - 1;
        }
        updateCarousel();
    });

    // Next arrow click handler
    nextArrow.addEventListener('click', function() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
        } else {
            currentSlide = 0;
        }
        updateCarousel();
    });

    // Create carousel indicators
    function createCarouselIndicators() {
        const indicatorsContainer = document.getElementById('carousel-indicators');
        if (!indicatorsContainer) return;

        const cardsPerView = getCardsPerView();
        const eventCards = document.querySelectorAll('.event-card');
        const totalSlides = Math.ceil(eventCards.length / cardsPerView);

        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');

            dot.addEventListener('click', function() {
                currentSlide = i;
                updateCarousel();
            });

            indicatorsContainer.appendChild(dot);
        }
    }

    // Handle window resize
    window.addEventListener('resize', function() {
        const newCardsPerView = getCardsPerView();
        if (newCardsPerView !== cardsPerView) {
            cardsPerView = newCardsPerView;
            totalSlides = Math.ceil(eventCards.length / cardsPerView);

            // Recreate indicators
            const indicatorsContainer = document.getElementById('carousel-indicators');
            if (indicatorsContainer) {
                indicatorsContainer.innerHTML = '';
                createCarouselIndicators();
            }

            // Make sure current slide is valid
            if (currentSlide >= totalSlides) {
                currentSlide = totalSlides - 1;
            }

            updateCarousel();
        }
    });

    // Initialize carousel
    updateCarousel();
}

// Function to determine how many cards to show based on screen width
function getCardsPerView() {
    if (window.innerWidth < 768) {
        return 1;
    } else if (window.innerWidth < 992) {
        return 2;
    } else {
        return 3;
    }
}

// Function to initialize map/list toggle
function initMapListToggle() {
    // Get elements
    const mapViewBtn = document.getElementById('map-view-btn');
    const listViewBtn = document.getElementById('list-view-btn');
    const mapPlaceholder = document.getElementById('map-placeholder');
    const eventList = document.getElementById('event-list');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');

    // If map elements don't exist on this page, exit the function
    if (!mapViewBtn || !listViewBtn || !mapPlaceholder || !eventList) return;

    // Toggle between map and list views
    mapViewBtn.addEventListener('click', function() {
        mapPlaceholder.style.display = 'flex';
        eventList.style.display = 'none';
        mapViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
    });

    listViewBtn.addEventListener('click', function() {
        mapPlaceholder.style.display = 'none';
        eventList.style.display = 'block';
        listViewBtn.classList.add('active');
        mapViewBtn.classList.remove('active');

        // Populate event list
        populateEventList();
    });

    // Apply filters
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            const category = document.getElementById('category-filter').value;
            const date = document.getElementById('date-filter').value;
            const cost = document.getElementById('cost-filter').value;

            // Filter events
            filterEvents(category, date, cost);
        });
    }

    // Reset filters
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            document.getElementById('category-filter').value = 'all';
            document.getElementById('date-filter').value = 'all';
            document.getElementById('cost-filter').value = 'all';

            // Reset any applied filters
            filterEvents('all', 'all', 'all');
        });
    }
}

// Function to populate event list
function populateEventList() {
    const eventList = document.getElementById('event-list');
    if (!eventList) return;

    // This would normally fetch events from an API
    const events = [
        { title: 'Beiaardcantus', date: '2025-03-25', category: 'student', cost: 'paid', location: 'Ladeuzeplein' },
        { title: '600 years KU Leuven', date: '2025-04-10', category: 'academic', cost: 'free', location: 'University Hall' },
        { title: 'The Longest Day', date: '2025-06-21', category: 'culture', cost: 'student', location: 'City Center' }
    ];

    // Clear existing events
    eventList.innerHTML = '';

    if (events.length === 0) {
        eventList.innerHTML = '<p class="no-events">No events match your criteria</p>';
        return;
    }

    // Create event items
    events.forEach(event => {
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';
        eventItem.innerHTML = `
      <h3>${event.title}</h3>
      <p><strong>Date:</strong> ${formatDate(event.date)}</p>
      <p><strong>Category:</strong> ${capitalizeFirstLetter(event.category)}</p>
      <p><strong>Cost:</strong> ${formatCost(event.cost)}</p>
      <p><strong>Location:</strong> ${event.location}</p>
      <button class="event-details-btn">View Details</button>
    `;
        eventList.appendChild(eventItem);
    });

    // Add event item styles
    if (!document.getElementById('event-list-styles')) {
        const style = document.createElement('style');
        style.id = 'event-list-styles';
        style.textContent = `
      .event-item {
        padding: 15px;
        border-bottom: 1px solid #eee;
        margin-bottom: 15px;
      }
      .event-item:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }
      .event-item h3 {
        margin-top: 0;
        color: #4285c7;
      }
      .event-details-btn {
        background-color: #4285c7;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 3px;
        cursor: pointer;
        margin-top: 10px;
      }
      .no-events {
        text-align: center;
        color: #777;
        font-style: italic;
      }
    `;
        document.head.appendChild(style);
    }
}

// Function to filter events
function filterEvents(category, date, cost) {
    console.log('Filtering events by:', { category, date, cost });

    // If in list view, update the displayed events
    const eventList = document.getElementById('event-list');
    if (eventList && eventList.style.display === 'block') {
        populateEventList();
    }
}

// Helper functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatCost(cost) {
    switch(cost) {
        case 'free': return 'Free';
        case 'paid': return 'Paid';
        case 'student': return 'Student Discount';
        default: return cost;
    }
}
