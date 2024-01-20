const express = require('express');
const path = require('path');
const axios = require('axios');


const router = express.Router();

let cityName = 'Astana';
router.use(express.static('public'));
router.use(express.json());

router.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'index.html');
    res.sendFile(filePath);
});

router.get('/photo', async (req, res) => {
    const apiKey = "41967838-bf6f2c052a1c378ce9cf36532";
    const city = req.query.city;
    const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${city}&image_type=photo`;

    try {
        const response = await axios.get(apiUrl);
        console.log(response.data);
        const data = response.data.hits[0];

        res.status(200).json(data)
    } catch (error) {
        console.error('Error fetching photo: ', error);
        res.status(500).send('Internal Server Error');
    }
});


router.post('/weather', async (req, res) => {
    cityName = req.body.city;
    const api_key = "ff5004aeebc675f39fa384dd6a113f6c";
    const currWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${api_key}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${api_key}&units=metric`;

    try {
        const currWeatherResponse = await fetch(currWeatherUrl);
        const currWeatherData = await currWeatherResponse.json();

        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        let lat = currWeatherData.coord.lat;
        let lon = currWeatherData.coord.lon;
        console.log(lat, lon);
        const airPollutionUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`;
        const airPollutionResponse = await fetch(airPollutionUrl);
        const airPollutionData = await airPollutionResponse.json();

        const responseData = {
            currentWeather: currWeatherData,
            forecast: forecastData,
            airPollution: airPollutionData,
        };
        console.log(responseData);
        res.status(200).json(responseData);

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;