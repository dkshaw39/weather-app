// Weather API Configuration
const API_KEY = "039a631a109b4867b6175802252407";
const BASE_URL = "https://api.weatherapi.com/v1";

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const locationBtn = document.getElementById('location-btn');
const currentWeatherSection = document.getElementById('current-weather');
const forecastSection = document.getElementById('forecast');
const historicalSection = document.getElementById('historical');
const sportsSection = document.getElementById('sports');
const alertsSection = document.querySelector('.alerts-container');
const suggestionsDropdown = document.getElementById('suggestions');
const loadingIndicator = document.getElementById('loading');

// Initialize DOM elements when needed
function initializeElements() {
    // This function doesn't need to do anything now since we're getting elements fresh each time
    // It's kept for compatibility with existing calls
}

// Current location
let currentLocation = "New York";

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Initialize DOM elements for current page
    initializeElements();
    
    // Load weather data for default location
    getWeatherData(currentLocation);
    
    // Get current page elements
    const currentSearchInput = document.getElementById('search-input');
    const currentSearchBtn = document.getElementById('search-btn');
    const currentLocationBtn = document.getElementById('location-btn');
    
    // Event listeners
    if (currentSearchBtn) {
        currentSearchBtn.addEventListener('click', handleSearch);
    }
    if (currentSearchInput) {
        currentSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
    
    if (currentLocationBtn) {
        currentLocationBtn.addEventListener('click', getCurrentLocationWeather);
    }
    
    // Initialize search suggestions if input exists
    if (currentSearchInput) {
        setupSearchSuggestions();
    }
    
    // Initialize keyboard navigation if search input exists
    if (currentSearchInput) {
        setupKeyboardNavigation();
    }
    
    // Initialize mobile menu if it exists
    setupMobileMenu();
    
    // Load page-specific content
    loadPageSpecificContent();
});

// Setup mobile menu functionality
function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('show');
        });
    }
}

// Load content specific to each page
function loadPageSpecificContent() {
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'forecast.html':
            document.querySelector('.nav-link[href="forecast.html"]').classList.add('active');
            break;
        case 'air-quality.html':
            document.querySelector('.nav-link[href="air-quality.html"]').classList.add('active');
            break;
        case 'astronomy.html':
            document.querySelector('.nav-link[href="astronomy.html"]').classList.add('active');
            break;
        case 'historical.html':
            document.querySelector('.nav-link[href="historical.html"]').classList.add('active');
            break;
        case 'alerts.html':
            document.querySelector('.nav-link[href="alerts.html"]').classList.add('active');
            break;
        default:
            document.querySelector('.nav-link[href="index.html"]').classList.add('active');
            break;
    }
}

// Handle search functionality
function handleSearch() {
    // Initialize elements to make sure we have the current page elements
    initializeElements();
    
    // Re-get the search input after initialization
    const currentSearchInput = document.getElementById('search-input');
    const currentSuggestionsDropdown = document.getElementById('suggestions');
    
    if (currentSearchInput) {
        const location = currentSearchInput.value.trim();
        if (location) {
            getWeatherData(location);
            if (currentSuggestionsDropdown) currentSuggestionsDropdown.classList.remove('show');
            currentSearchInput.value = '';
        }
    }
}

// Get weather data for a specific location
async function getWeatherData(location) {
    showLoading(true);
    
    try {
        // Fetch current weather and forecast
        const currentResponse = await fetch(`${BASE_URL}/current.json?key=${API_KEY}&q=${location}&aqi=yes`);
        const forecastResponse = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${location}&days=7&aqi=yes&alerts=yes&hour=24`);
        
        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error('Location not found');
        }
        
        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();
        
        // Update the UI with current weather data - only if elements exist
        if (document.querySelector('.city-name')) displayCurrentWeather(currentData);
        if (document.querySelector('.forecast-container')) displayForecast(forecastData);
        if (document.querySelector('.hourly-container')) displayHourlyForecast(forecastData);
        if (document.querySelector('.astronomy-info')) displayAstronomy(currentData);
        if (document.querySelector('.pollutants')) displayAirQuality(currentData);
        if (document.querySelector('.alerts-container')) displayAlerts(forecastData);
        if (document.querySelector('.timezone-info')) displayTimezone(currentData);
        
        // Also fetch historical and sports data
        getHistoricalWeather(location);
        getSportsData();
        
        currentLocation = location;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please try again.');
    } finally {
        showLoading(false);
    }
}

// Get historical weather data
async function getHistoricalWeather(location) {
    try {
        // Calculate dates for the last 7 days
        for (let i = 1; i <= 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const formattedDate = date.toISOString().split('T')[0];
            
            try {
                const response = await fetch(`${BASE_URL}/history.json?key=${API_KEY}&q=${location}&dt=${formattedDate}`);
                if (response.ok) {
                    const data = await response.json();
                    displayHistoricalWeather([data]); // Pass as array for compatibility
                }
            } catch (error) {
                console.error(`Error fetching historical data for ${formattedDate}:`, error);
            }
        }
    } catch (error) {
        console.error('Error fetching historical weather data:', error);
    }
}

// Get sports data
async function getSportsData() {
    try {
        // Note: WeatherAPI.com's sports API is a separate feature
        // This implementation uses a mock approach since the primary API
        // doesn't include sports data in the same way as other features
        
        // In a real implementation, you would connect to a sports API
        // For now, we'll use sample data
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=4');
        if (response.ok) {
            const data = await response.json();
            
            // Format the sample data to look like sports events
            const sportsData = data.map((item, index) => {
                const sportsTypes = ['Football', 'Basketball', 'Tennis', 'Soccer', 'Baseball'];
                const teams = [
                    'Team A vs Team B',
                    'Team X vs Team Y', 
                    'Champions vs Challengers',
                    'Home vs Away',
                    'Red Team vs Blue Team'
                ];
                
                const dates = [
                    `Today, ${14 + index}:00`,
                    `Tomorrow, ${15 + index}:00`,
                    `In 2 days, ${16 + index}:00`,
                    `Next week, 14:00`
                ];
                
                return {
                    type: sportsTypes[index % sportsTypes.length],
                    event: teams[index % teams.length],
                    date: dates[index % dates.length],
                    description: item.title
                };
            });
            
            displaySportsData(sportsData);
        } else {
            // Fallback to mock data if API call fails
            const sportsData = [
                { 
                    type: 'Football', 
                    event: 'Manchester United vs Liverpool', 
                    date: 'Today, 15:00',
                    description: 'Premier League Match'
                },
                { 
                    type: 'Basketball', 
                    event: 'Lakers vs Warriors', 
                    date: 'Tomorrow, 19:30',
                    description: 'NBA Game'
                }
            ];
            
            displaySportsData(sportsData);
        }
    } catch (error) {
        console.error('Error fetching sports data:', error);
        // Fallback to mock data
        const sportsData = [
            { 
                type: 'Football', 
                event: 'Local Team vs Visitors', 
                date: 'This weekend',
                description: 'Local league match'
            }
        ];
        
        displaySportsData(sportsData);
    }
}

// Display current weather information
function displayCurrentWeather(data) {
    const location = data.location;
    const current = data.current;
    
    // Update location info
    document.querySelector('.city-name').textContent = `${location.name}, ${location.country}`;
    document.querySelector('.date-time').textContent = new Date().toDateString() + 
                                                      ' - ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    document.querySelector('.weather-condition').textContent = current.condition.text;
    
    // Update main weather
    document.querySelector('.weather-icon').src = current.condition.icon;
    document.querySelector('.temp-value').textContent = Math.round(current.temp_c);
    document.querySelector('.temp-unit').textContent = 'C';
    
    // Create detailed weather stats
    const weatherStatsContainer = document.querySelector('.weather-stats');
    weatherStatsContainer.innerHTML = `
        <div class="stat">
            <i class="fas fa-wind"></i>
            <span class="stat-value">${current.wind_kph} km/h</span>
            <span class="stat-label">Wind</span>
        </div>
        <div class="stat">
            <i class="fas fa-tint"></i>
            <span class="stat-value">${current.humidity}%</span>
            <span class="stat-label">Humidity</span>
        </div>
        <div class="stat">
            <i class="fas fa-sun"></i>
            <span class="stat-value">${current.uv}</span>
            <span class="stat-label">UV Index</span>
        </div>
        <div class="stat">
            <i class="fas fa-tachometer-alt"></i>
            <span class="stat-value">${current.pressure_mb} mb</span>
            <span class="stat-label">Pressure</span>
        </div>
        <div class="stat">
            <i class="fas fa-cloud"></i>
            <span class="stat-value">${current.cloud}%</span>
            <span class="stat-label">Cloud Cover</span>
        </div>
        <div class="stat">
            <i class="fas fa-fire"></i>
            <span class="stat-value">${current.heatindex_c}°C</span>
            <span class="stat-label">Heat Index</span>
        </div>
    `;
    
    // Update description
    document.querySelector('.current-weather').style.background = getWeatherGradient(current.condition.text);
}

// Display 3-day forecast
function displayForecast(data) {
    const forecastDays = data.forecast.forecastday;
    const forecastContainer = document.querySelector('.forecast-container');
    
    if (forecastContainer) {
        forecastContainer.innerHTML = '';
        
        // Only show 3 days for the 3-day forecast
        const daysToShow = forecastDays.slice(0, 3);
        
        daysToShow.forEach(day => {
            const date = new Date(day.date);
            const formattedDate = date.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
            });
            
            const forecastDay = document.createElement('div');
            forecastDay.className = 'forecast-day';
            forecastDay.innerHTML = `
                <div class="forecast-date">${formattedDate}</div>
                <img src="${day.day.condition.icon}" alt="${day.day.condition.text}" class="forecast-icon">
                <div class="forecast-temp">${Math.round(day.day.maxtemp_c)}°<span class="temp-low">/${Math.round(day.day.mintemp_c)}°</span></div>
                <div class="forecast-desc">${day.day.condition.text}</div>
                <div class="forecast-details">
                    <div class="detail-item">
                        <i class="fas fa-tint"></i> ${day.day.avghumidity}%
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-wind"></i> ${day.day.maxwind_kph} km/h
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-cloud"></i> ${day.day.daily_chance_of_rain}%
                    </div>
                </div>
            `;
            
            forecastContainer.appendChild(forecastDay);
        });
    }
}

// Display week forecast (7-day)
function displayWeekForecast(data) {
    const forecastDays = data.forecast.forecastday;
    const weekForecastContainer = document.querySelector('.week-forecast-container');
    
    if (weekForecastContainer) {
        weekForecastContainer.innerHTML = '';
        
        forecastDays.forEach(day => {
            const date = new Date(day.date);
            const formattedDate = date.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
            });
            
            const forecastDay = document.createElement('div');
            forecastDay.className = 'forecast-day';
            forecastDay.innerHTML = `
                <div class="forecast-date">${formattedDate}</div>
                <img src="${day.day.condition.icon}" alt="${day.day.condition.text}" class="forecast-icon">
                <div class="forecast-temp">${Math.round(day.day.maxtemp_c)}°<span class="temp-low">/${Math.round(day.day.mintemp_c)}°</span></div>
                <div class="forecast-desc">${day.day.condition.text}</div>
                <div class="forecast-details">
                    <div class="detail-item">
                        <i class="fas fa-tint"></i> ${day.day.avghumidity}%
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-wind"></i> ${day.day.maxwind_kph} km/h
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-cloud"></i> ${day.day.daily_chance_of_rain}%
                    </div>
                </div>
            `;
            
            weekForecastContainer.appendChild(forecastDay);
        });
    }
}

// Update the main getWeatherData function to call week forecast on forecast page
async function getWeatherData(location) {
    showLoading(true);
    
    try {
        // Fetch current weather and forecast
        const currentResponse = await fetch(`${BASE_URL}/current.json?key=${API_KEY}&q=${location}&aqi=yes`);
        const forecastResponse = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${location}&days=7&aqi=yes&alerts=yes&hour=24`);
        
        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error('Location not found');
        }
        
        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();
        
        // Update the UI with current weather data - only if elements exist
        if (document.querySelector('.city-name')) displayCurrentWeather(currentData);
        if (document.querySelector('.forecast-container')) displayForecast(forecastData);
        if (document.querySelector('.week-forecast-container')) displayWeekForecast(forecastData);
        if (document.querySelector('.hourly-container')) displayHourlyForecast(forecastData);
        if (document.querySelector('.astronomy-info')) displayAstronomy(currentData);
        if (document.querySelector('.pollutants')) displayAirQuality(currentData);
        if (document.querySelector('.alerts-container')) displayAlerts(forecastData);
        if (document.querySelector('.timezone-info')) displayTimezone(currentData);
        
        // Also fetch historical and sports data
        getHistoricalWeather(location);
        getSportsData();
        
        currentLocation = location;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please try again.');
    } finally {
        showLoading(false);
    }
}

// Display hourly forecast
function displayHourlyForecast(data) {
    const hourlyContainer = document.querySelector('.hourly-container');
    hourlyContainer.innerHTML = '';
    
    // Get today's hourly forecast
    const todayForecast = data.forecast.forecastday[0];
    if (todayForecast && todayForecast.hour) {
        const currentHour = new Date().getHours();
        
        // Show next 24 hours starting from current hour
        for (let i = currentHour; i < currentHour + 24 && i < todayForecast.hour.length; i++) {
            const hourData = todayForecast.hour[i];
            
            // Format the time
            const hour = new Date(hourData.time).getHours();
            const timeString = hour === 0 ? '12 AM' : 
                              hour === 12 ? '12 PM' : 
                              hour > 12 ? `${hour - 12} PM` : 
                              `${hour} AM`;
            
            const hourlyItem = document.createElement('div');
            hourlyItem.className = 'hourly-item';
            hourlyItem.innerHTML = `
                <div class="hourly-time">${timeString}</div>
                <img src="${hourData.condition.icon}" alt="${hourData.condition.text}" class="hourly-icon">
                <div class="hourly-temp">${Math.round(hourData.temp_c)}°</div>
                <div class="hourly-condition">${hourData.condition.text}</div>
            `;
            
            hourlyContainer.appendChild(hourlyItem);
        }
    }
}

// Display historical weather
function displayHistoricalWeather(data) {
    // For historical data, we need to accumulate results
    // In a real implementation, this would be handled differently
    // But for this implementation, we'll just update with the latest data
    if (!window.historicalData) window.historicalData = [];
    
    // Add the new data to the historical array
    data.forEach(dayData => {
        if (dayData.forecast && dayData.forecast.forecastday) {
            const day = dayData.forecast.forecastday[0]; // Get the first day from the forecast
            if (day) {
                const exists = window.historicalData.some(d => d.date === day.date);
                if (!exists) {
                    window.historicalData.push(day);
                }
            }
        }
    });
    
    // Sort and limit to last 7 days
    window.historicalData.sort((a, b) => new Date(b.date) - new Date(a.date));
    window.historicalData = window.historicalData.slice(0, 7);
    
    const historicalContainer = document.querySelector('.historical-container');
    historicalContainer.innerHTML = '';
    
    window.historicalData.forEach(day => {
        const date = new Date(day.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
        
        const historicalDay = document.createElement('div');
        historicalDay.className = 'historical-day';
        historicalDay.innerHTML = `
            <div class="historical-date">${formattedDate}</div>
            <div class="historical-temp">${Math.round(day.day.avgtemp_c)}°</div>
            <div class="historical-desc">${day.day.condition.text}</div>
        `;
        
        historicalContainer.appendChild(historicalDay);
    });
}

// Display air quality data
function displayAirQuality(data) {
    if (data.current.air_quality) {
        const aqi = data.current.air_quality["us-epa-index"];
        const pollutants = data.current.air_quality;
        
        // Update AQI info
        document.querySelector('.aqi-value').textContent = aqi;
        document.querySelector('.aqi-label').textContent = getAqiLevel(aqi);
        document.querySelector('.aqi-label').style.color = getAqiColor(aqi);
        document.querySelector('.aqi-value').style.color = getAqiColor(aqi);
        
        // Update pollutants
        const pollutantContainer = document.querySelector('.pollutants');
        pollutantContainer.innerHTML = '';
        
        // Create detailed pollutant list
        const pollutantDetails = [
            { key: 'co', label: 'Carbon Monoxide (CO)', unit: ' μg/m³', icon: 'fas fa-wind' },
            { key: 'o3', label: 'Ozone (O3)', unit: ' μg/m³', icon: 'fas fa-cloud' },
            { key: 'no2', label: 'Nitrogen Dioxide (NO2)', unit: ' μg/m³', icon: 'fas fa-biohazard' },
            { key: 'so2', label: 'Sulphur Dioxide (SO2)', unit: ' μg/m³', icon: 'fas fa-smog' },
            { key: 'pm2_5', label: 'PM2.5', unit: ' μg/m³', icon: 'fas fa-wind' },
            { key: 'pm10', label: 'PM10', unit: ' μg/m³', icon: 'fas fa-wind' },
            { key: 'us-epa-index', label: 'US EPA Index', unit: '', icon: 'fas fa-ruler' },
            { key: 'gb-defra-index', label: 'GB DEFRA Index', unit: '', icon: 'fas fa-ruler' }
        ];
        
        pollutantDetails.forEach(p => {
            if (pollutants[p.key] !== undefined) {
                const pollutantEl = document.createElement('div');
                pollutantEl.className = 'pollutant';
                pollutantEl.innerHTML = `
                    <i class="${p.icon}"></i>
                    <span class="pollutant-label">${p.label}</span>
                    <span class="pollutant-value">${typeof pollutants[p.key] === 'number' ? pollutants[p.key].toFixed(1) : pollutants[p.key]}${p.unit}</span>
                `;
                pollutantContainer.appendChild(pollutantEl);
            }
        });
    }
}

// Display astronomy data
function displayAstronomy(data) {
    if (data.forecast && data.forecast.forecastday && data.forecast.forecastday[0] && data.forecast.forecastday[0].astro) {
        const astro = data.forecast.forecastday[0].astro;
        
        // Create detailed astronomy info
        const astronomyContainer = document.querySelector('.astronomy-info');
        astronomyContainer.innerHTML = `
            <div class="astronomy-item">
                <i class="fas fa-sun"></i>
                <div>
                    <div class="astronomy-label">Sunrise</div>
                    <div class="astronomy-value">${astro.sunrise}</div>
                </div>
            </div>
            <div class="astronomy-item">
                <i class="fas fa-sun"></i>
                <div>
                    <div class="astronomy-label">Sunset</div>
                    <div class="astronomy-value">${astro.sunset}</div>
                </div>
            </div>
            <div class="astronomy-item">
                <i class="fas fa-moon"></i>
                <div>
                    <div class="astronomy-label">Moonrise</div>
                    <div class="astronomy-value">${astro.moonrise}</div>
                </div>
            </div>
            <div class="astronomy-item">
                <i class="fas fa-moon"></i>
                <div>
                    <div class="astronomy-label">Moonset</div>
                    <div class="astronomy-value">${astro.moonset}</div>
                </div>
            </div>
            <div class="astronomy-item">
                <i class="fas fa-moon"></i>
                <div>
                    <div class="astronomy-label">Moon Phase</div>
                    <div class="astronomy-value">${getMoonPhase(astro.moon_phase)}</div>
                </div>
            </div>
            <div class="astronomy-item">
                <i class="fas fa-moon"></i>
                <div>
                    <div class="astronomy-label">Illumination</div>
                    <div class="astronomy-value">${astro.moon_illumination}%</div>
                </div>
            </div>
        `;
    }
}

// Display weather alerts
function displayAlerts(data) {
    if (data.alerts && data.alerts.alert && data.alerts.alert.length > 0) {
        alertsSection.innerHTML = '';
        
        data.alerts.alert.forEach(alert => {
            const alertEl = document.createElement('div');
            alertEl.className = 'alert';
            alertEl.innerHTML = `
                <div class="alert-header">
                    <h4><i class="fas fa-exclamation-circle"></i> ${alert.event}</h4>
                    <span class="alert-type">${alert.type || 'Weather'}</span>
                </div>
                <div class="alert-content">
                    <p>${alert.desc}</p>
                    <div class="alert-meta">
                        <div class="alert-time">
                            <i class="fas fa-calendar-alt"></i>
                            ${new Date(alert.start_epoch * 1000).toLocaleString()} - 
                            ${new Date(alert.end_epoch * 1000).toLocaleString()}
                        </div>
                        <div class="alert-area">
                            <i class="fas fa-map-marker-alt"></i>
                            ${alert.area || 'Local Area'}
                        </div>
                    </div>
                </div>
            `;
            alertsSection.appendChild(alertEl);
        });
    } else {
        alertsSection.innerHTML = '<div class="no-alerts"><i class="fas fa-check-circle"></i> No active weather alerts</div>';
    }
}

// Display timezone information
function displayTimezone(data) {
    if (data.location) {
        const timezoneContainer = document.querySelector('.timezone-info');
        const localTime = new Date();
        
        // Format the local time and date with more comprehensive information
        timezoneContainer.innerHTML = `
            <div class="timezone-value">${data.location.tz_id}</div>
            <div class="local-time"><i class="fas fa-clock"></i> Local Time: ${localTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
            <div class="local-date"><i class="fas fa-calendar"></i> Local Date: ${localTime.toLocaleDateString()}</div>
            <div class="local-timezone"><i class="fas fa-globe-americas"></i> Timezone: ${data.location.tz_id}</div>
            <div class="local-offset"><i class="fas fa-exchange-alt"></i> UTC Offset: ${data.location.localtime.split(' ')[1] || 'N/A'}</div>
            <div class="local-epoch"><i class="fas fa-hashtag"></i> Unix Timestamp: ${Math.floor(Date.now() / 1000)}</div>
        `;
    }
}

// Display sports data
function displaySportsData(data) {
    const sportsContainer = document.querySelector('.sports-container');
    
    sportsContainer.innerHTML = '';
    
    if (data && data.length > 0) {
        data.forEach(sport => {
            const sportEvent = document.createElement('div');
            sportEvent.className = 'sport-event';
            sportEvent.innerHTML = `
                <div class="sport-type">
                    <i class="fas fa-${getSportIcon(sport.type)}"></i>
                    ${sport.type}
                </div>
                <div class="event-date">${sport.date}</div>
                <div class="match">${sport.event}</div>
                <div class="event-description">${sport.description || ''}</div>
            `;
            sportsContainer.appendChild(sportEvent);
        });
    } else {
        sportsContainer.innerHTML = '<div class="no-sports">No upcoming sports events</div>';
    }
}

// Helper function to get appropriate sport icon
function getSportIcon(sportType) {
    switch(sportType.toLowerCase()) {
        case 'football':
        case 'soccer':
            return 'futbol';
        case 'basketball':
            return 'basketball-ball';
        case 'tennis':
            return 'table-tennis';
        case 'baseball':
            return 'baseball-ball';
        default:
            return 'futbol';
    }
}

// Get user's current location
function getCurrentLocationWeather() {
    // Initialize elements to make sure we have the current page elements
    initializeElements();
    
    // Re-get the location button after initialization
    const currentLocationBtn = document.getElementById('location-btn');
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                // Use coordinates to get location name
                getLocationFromCoords(lat, lon);
            },
            error => {
                console.error('Error getting location:', error);
                // Fallback to IP-based location if geolocation fails
                getIPLocation();
            }
        );
    } else {
        // If geolocation is not supported, try IP-based location
        getIPLocation();
    }
}

// Get location based on IP address
async function getIPLocation() {
    try {
        showLoading(true);
        
        // First, get IP-based location data
        const ipResponse = await fetch(`${BASE_URL}/ip.json?key=${API_KEY}`);
        const ipData = await ipResponse.json();
        
        if (ipData && ipData.city) {
            getWeatherData(`${ipData.city}, ${ipData.country_name}`);
        } else {
            // If IP lookup fails, use a default location
            getWeatherData('New York');
        }
    } catch (error) {
        console.error('Error getting IP-based location:', error);
        alert('Could not determine your location. Please enter a city name.');
    } finally {
        showLoading(false);
    }
}

// Get location from coordinates
async function getLocationFromCoords(lat, lon) {
    try {
        const response = await fetch(`${BASE_URL}/current.json?key=${API_KEY}&q=${lat},${lon}`);
        const data = await response.json();
        
        getWeatherData(`${data.location.name}, ${data.location.country}`);
    } catch (error) {
        console.error('Error getting location from coordinates:', error);
        alert('Error retrieving location. Please try entering a city name.');
    }
}

// Setup search suggestions
function setupSearchSuggestions() {
    const currentSearchInput = document.getElementById('search-input');
    const currentSuggestionsDropdown = document.getElementById('suggestions');
    
    if (!currentSearchInput || !currentSuggestionsDropdown) return;
    
    let timeout;
    
    currentSearchInput.addEventListener('input', function() {
        clearTimeout(timeout);
        
        const query = currentSearchInput.value.trim();
        
        if (query.length > 2) {
            timeout = setTimeout(() => {
                fetchSuggestions(query);
            }, 300);
        } else {
            currentSuggestionsDropdown.classList.remove('show');
        }
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (currentSearchInput && !currentSearchInput.contains(e.target) && currentSuggestionsDropdown && !currentSuggestionsDropdown.contains(e.target)) {
            currentSuggestionsDropdown.classList.remove('show');
        }
    });
}

// Fetch location suggestions
async function fetchSuggestions(query) {
    const currentSuggestionsDropdown = document.getElementById('suggestions');
    if (!currentSuggestionsDropdown) return;
    
    try {
        const response = await fetch(`${BASE_URL}/search.json?key=${API_KEY}&q=${query}`);
        const suggestions = await response.json();
        
        displaySuggestions(suggestions);
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
}

// Display search suggestions
function displaySuggestions(suggestions) {
    const currentSearchInput = document.getElementById('search-input');
    const currentSuggestionsDropdown = document.getElementById('suggestions');
    
    if (!currentSuggestionsDropdown || !currentSearchInput) return;
    
    currentSuggestionsDropdown.innerHTML = '';
    
    if (suggestions.length > 0) {
        suggestions.forEach(location => {
            const suggestionEl = document.createElement('div');
            suggestionEl.className = 'suggestion-item';
            suggestionEl.textContent = `${location.name}, ${location.country}`;
            suggestionEl.addEventListener('click', () => {
                currentSearchInput.value = `${location.name}, ${location.country}`;
                getWeatherData(`${location.name}, ${location.country}`);
                currentSuggestionsDropdown.classList.remove('show');
            });
            currentSuggestionsDropdown.appendChild(suggestionEl);
        });
        
        currentSuggestionsDropdown.classList.add('show');
    } else {
        currentSuggestionsDropdown.classList.remove('show');
    }
}

// Helper function to get weather-appropriate gradient
function getWeatherGradient(condition) {
    const lowerCondition = condition.toLowerCase();
    
    if (lowerCondition.includes('sunny') || lowerCondition.includes('clear')) {
        return 'linear-gradient(to right, #ff9a9e, #fad0c4)';
    } else if (lowerCondition.includes('cloud') || lowerCondition.includes('overcast')) {
        return 'linear-gradient(to right, #a1c4fd, #c2e9fb)';
    } else if (lowerCondition.includes('rain') || lowerCondition.includes('shower')) {
        return 'linear-gradient(to right, #4b6cb7, #182848)';
    } else if (lowerCondition.includes('snow')) {
        return 'linear-gradient(to right, #d3d3d3, #ffffff)';
    } else {
        return 'linear-gradient(to right, #74b9ff, #0984e3)';
    }
}

// Helper function to get AQI level
function getAqiLevel(index) {
    if (index <= 50) return 'Good';
    if (index <= 100) return 'Moderate';
    if (index <= 150) return 'Unhealthy for Sensitive Groups';
    if (index <= 200) return 'Unhealthy';
    if (index <= 300) return 'Very Unhealthy';
    return 'Hazardous';
}

// Helper function to get AQI color
function getAqiColor(index) {
    if (index <= 50) return '#009966'; // Green
    if (index <= 100) return '#ffde33'; // Yellow
    if (index <= 150) return '#ff9933'; // Orange
    if (index <= 200) return '#cc0033'; // Red
    if (index <= 300) return '#660099'; // Purple
    return '#7e0023'; // Maroon
}

// Helper function to get moon phase description
function getMoonPhase(phase) {
    // Simple mapping - in a real app, you would calculate the actual moon phase
    const phaseMap = {
        'New Moon': 'New Moon',
        'Waxing Crescent': 'Waxing Crescent',
        'First Quarter': 'First Quarter',
        'Waxing Gibbous': 'Waxing Gibbous',
        'Full Moon': 'Full Moon',
        'Waning Gibbous': 'Waning Gibbous',
        'Last Quarter': 'Last Quarter',
        'Waning Crescent': 'Waning Crescent'
    };
    
    return phaseMap[phase] || phase;
}

// Show/hide loading indicator
function showLoading(show) {
    const currentLoadingIndicator = document.getElementById('loading');
    if (currentLoadingIndicator) {
        if (show) {
            currentLoadingIndicator.classList.remove('hidden');
        } else {
            currentLoadingIndicator.classList.add('hidden');
        }
    }
}

// Add keyboard navigation for search suggestions
function setupKeyboardNavigation() {
    const currentSearchInput = document.getElementById('search-input');
    const currentSuggestionsDropdown = document.getElementById('suggestions');
    
    if (!currentSearchInput || !currentSuggestionsDropdown) return;
    
    let currentIndex = -1;
    
    currentSearchInput.addEventListener('keydown', function(e) {
        const suggestions = document.querySelectorAll('.suggestion-item');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            currentIndex = (currentIndex + 1) % suggestions.length;
            updateActiveSuggestion(suggestions, currentIndex);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            currentIndex = (currentIndex - 1 + suggestions.length) % suggestions.length;
            updateActiveSuggestion(suggestions, currentIndex);
        } else if (e.key === 'Enter') {
            if (currentIndex >= 0 && suggestions[currentIndex]) {
                e.preventDefault();
                suggestions[currentIndex].click();
                currentIndex = -1;
            }
        } else if (e.key === 'Escape') {
            currentSuggestionsDropdown.classList.remove('show');
            currentIndex = -1;
        }
    });
}

// Update active suggestion for keyboard navigation
function updateActiveSuggestion(suggestions, index) {
    suggestions.forEach((item, i) => {
        if (i === index) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    suggestionsDropdown.classList.add('show');
}

// Initialize keyboard navigation
setupKeyboardNavigation();