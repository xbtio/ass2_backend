document.getElementById('searchButton').addEventListener('click', function() {
    const city = document.getElementById('cityInput').value;
    fetchWeatherData(city);

});


function fetchWeatherData(city) {
    fetch('/weather', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city: city }),
    })
    
    .then(response => response.json())
    .then(data => updateUI(data))
    .catch(error => console.error('Error:', error));
}

function updateUI(data) {
    const currentWeatherDiv = document.getElementById('currentWeather');
    currentWeatherDiv.innerHTML = `
        <h1 class="text-6xl">${data.currentWeather.name}</h1>
        <p class="text-xl">${data.currentWeather.weather[0].description}</p>
        <p class="text-9xl font-bold">${Math.round(data.currentWeather.main.temp)}°</p>
        <!-- Add icons and additional data here -->
    `;
    

    const forecastDiv = document.getElementById('forecast');
    data.forecast.list.forEach((forecast, index) => {
        if (index % 8 === 0) { // Assuming we get data every 3 hours, this gets one data point per day
            forecastDiv.innerHTML += `
                <div class="flex justify-between items-center text-sm">
                    <p>${new Date(forecast.dt * 1000).toLocaleDateString(undefined, { weekday: 'long' })}</p>
                    <p>${forecast.weather[0].main}</p>
                    <p>${Math.round(forecast.main.temp_max)}°/${Math.round(forecast.main.temp_min)}°</p>
                </div>
            `;
        }
    });

    const airPollutionDiv = document.getElementById('airPollution');
    const airQuality = data.airPollution.list[0].main.aqi;
    airPollutionDiv.innerHTML = `
        <p>Air Quality Index (AQI): ${airQuality}</p>
        <!-- Add more air pollution details here -->
    `;

    const mapDiv = document.getElementById('map');
    const cityLocation = new google.maps.LatLng(data.currentWeather.coord.lat, data.currentWeather.coord.lon);
    const mapOptions = {
        zoom: 8,
        center: cityLocation
    };
    const map = new google.maps.Map(mapDiv, mapOptions);
    new google.maps.Marker({ position: cityLocation, map: map });

    fetch(`/photo?city=${encodeURIComponent(data.currentWeather.name)}`)
    .then(photoResponse => {
        if (!photoResponse.ok) {
            throw new Error(`Pixabay API error! Status: ${photoResponse.status}`);
        }
        return photoResponse.json();
    })
    .then(photoData => displayImage(photoData.webformatURL))
    .catch(error => console.error('Error:', error));

}

function displayImage(imageURL) {
    const imageElement = document.getElementById('cityPhoto');
    imageElement.src = imageURL;
    imageElement.alt = 'Pixabay Image';
}
