// =========================================================
// PRE-FLOW LOGIC: Landing → City Selection → Main Page
// =========================================================

// City data with images
const cities = [
    {
        name: 'London',
        description: 'Historic elegance meets modern sophistication',
        image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80'
    },
    {
        name: 'Dubai',
        description: 'Luxury, innovation, and desert grandeur',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80'
    },
    {
        name: 'Barcelona',
        description: 'Artistic flair and Mediterranean charm',
        image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80'
    },
    {
        name: 'Tokyo',
        description: 'Futuristic innovation meets ancient tradition',
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80'
    },
    {
        name: 'New York',
        description: 'The city that never sleeps, always inspiring',
        image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80'
    },
    {
        name: 'Custom',
        description: 'Plan your own unique adventure',
        image: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }
];

// DOM Elements
const landingPage = document.getElementById('landing-page');
const citySelectionCard = document.getElementById('city-selection-card');
const mainPage = document.getElementById('main-page');
const startJourneyBtn = document.getElementById('start-journey-btn');
const carouselLeft = document.getElementById('carousel-left');
const carouselRight = document.getElementById('carousel-right');
const customCityInput = document.getElementById('custom-city-input');
const customCityBtn = document.getElementById('custom-city-btn');
const themeToggle = document.getElementById('theme-toggle');
const destinationInput = document.getElementById('destination');
const backButton = document.getElementById('back-to-city-selection');

// State
let currentCityIndex = 0;
let isTransitioning = false;

// =========================================================
// THEME TOGGLE
// =========================================================
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('.theme-icon');
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

themeToggle.addEventListener('click', toggleTheme);
initTheme();

// =========================================================
// LANDING PAGE → CITY SELECTION
// =========================================================
startJourneyBtn.addEventListener('click', () => {
    landingPage.classList.add('hidden');
    citySelectionCard.classList.remove('hidden');
    themeToggle.classList.remove('hidden');
    renderCityCarousel();
});

// =========================================================
// CITY CAROUSEL RENDERING
// =========================================================
function renderCityCarousel() {
    const carousel = document.getElementById('city-carousel');
    carousel.innerHTML = '';

    // Calculate indices for left, center, right
    const leftIndex = (currentCityIndex - 1 + cities.length) % cities.length;
    const centerIndex = currentCityIndex;
    const rightIndex = (currentCityIndex + 1) % cities.length;

    const indices = [
        { index: leftIndex, position: 'left' },
        { index: centerIndex, position: 'center' },
        { index: rightIndex, position: 'right' }
    ];

    indices.forEach(({ index, position }) => {
        const city = cities[index];
        const card = document.createElement('div');
        card.className = `city-card ${position}`;
        
        // Handle custom city gradient vs image
        if (city.name === 'Custom') {
            card.style.background = city.image;
        } else {
            card.style.backgroundImage = `url(${city.image})`;
        }
        
        card.innerHTML = `
            <div class="city-card-content">
                <h3>${city.name}</h3>
                <p>${city.description}</p>
            </div>
        `;

        card.addEventListener('click', () => selectCity(city.name));
        carousel.appendChild(card);
    });
}

// =========================================================
// CAROUSEL NAVIGATION
// =========================================================
function navigateCarousel(direction) {
    if (isTransitioning) return;
    
    isTransitioning = true;

    // Update index
    if (direction === 'next') {
        currentCityIndex = (currentCityIndex + 1) % cities.length;
    } else {
        currentCityIndex = (currentCityIndex - 1 + cities.length) % cities.length;
    }

    // Re-render with new positions (CSS transitions handle animation)
    renderCityCarousel();
    
    setTimeout(() => {
        isTransitioning = false;
    }, 450);
}

carouselLeft.addEventListener('click', () => navigateCarousel('prev'));
carouselRight.addEventListener('click', () => navigateCarousel('next'));

// =========================================================
// CITY SELECTION
// =========================================================
function selectCity(cityName) {
    if (cityName === 'Custom') {
        // Show custom input, don't proceed yet
        customCityInput.focus();
        return;
    }

    // Pre-fill destination and transition to main page
    if (destinationInput) {
        destinationInput.value = cityName;
    }
    
    transitionToMainPage();
}

// =========================================================
// CUSTOM CITY INPUT
// =========================================================
customCityBtn.addEventListener('click', () => {
    const customCity = customCityInput.value.trim();
    if (customCity) {
        if (destinationInput) {
            destinationInput.value = customCity;
        }
        transitionToMainPage();
    }
});

customCityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        customCityBtn.click();
    }
});

// =========================================================
// TRANSITION TO MAIN PAGE
// =========================================================
function transitionToMainPage() {
    citySelectionCard.classList.add('hidden');
    mainPage.classList.remove('hidden');
    themeToggle.classList.remove('hidden');
    
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =========================================================
// BACK TO CITY SELECTION
// =========================================================
backButton.addEventListener('click', () => {
    mainPage.classList.add('hidden');
    citySelectionCard.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// =========================================================
// INITIALIZE ON LOAD
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    // Show landing page by default
    landingPage.classList.remove('hidden');
    citySelectionCard.classList.add('hidden');
    mainPage.classList.add('hidden');
    themeToggle.classList.add('hidden');
});
