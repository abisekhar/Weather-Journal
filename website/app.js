/* Global Variables */
const openWeatherMapUrl = 'https://api.openweathermap.org/data/2.5/weather?zip={zip}&units=imperial&appid=7fce1e49281f65adc0913dece185aeae';

// Create a new date instance dynamically with JS
const date = new Date();
const formattedDate = date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear();

//Get weather data from open weather map API
const getWeatherByZipCode = async (url = '') => {
    const response = await fetch(url, {
        method: 'GET',
        /*Code reviewer: Why am I getting a CORS blocked policy error when uncommenting 
        headers code below? Please provide response in the review if possible. Thank you! */

        // headers: {
        //     'Content-Type': 'application/json'
        // },
    });

    try {
        return await response.json();
    }
    catch (error) {
        console.log("error", error);
    }
}

//Save weather data retrieved from open weather map API and user input entered in client
const postWeather = async (url = '', weatherData = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(weatherData)
    });

    try {
        return await response.json();
    }
    catch (error) {
        console.log("error", error);
    }
}

//get saved weather data from node server
const getSavedWeatherData = async (url = '') => {
    const response = await fetch(url, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    try {
        return await response.json();
    } catch (error) {
        console.log("error", error);
    }
}

//get weather data on click
function getWeather() {
    const userZipCode = document.getElementById('zip').value;
    const userFeelings = document.getElementById('feelings').value;
    //make api calls only if user inputted values for zip code and feelings
    if (userZipCode && userFeelings) {
        //replace zip placeholder with user inputted value
        const formattedUrl = openWeatherMapUrl.replace('{zip}', userZipCode);
        //get weather by zip code
        getWeatherByZipCode(formattedUrl).then(response => {
            const weatherData = {
                temperature: response.main.temp,
                date: formattedDate,
                userResponse: userFeelings
            }
            //save weather data to node server once weather has been received from open weather API
            postWeather('/weather', weatherData).then(response => {
                //if node server sends back response of '200'
                if (response == '200') {
                    //get saved weather data from node server once weather data has been saved 
                    getSavedWeatherData('/weather').then(response => {
                        //update date,temp,and content elements with saved weather data
                        document.getElementById('date').innerHTML = 'Date: ' + response.date;
                        document.getElementById('temp').innerHTML = 'Temperature: ' + response.temperature
                            + '&deg;F';
                        document.getElementById('content').innerHTML = 'Feelings: ' + response.userResponse;
                    });
                }
            });
        });
    }
}

//add click event listener once DOM has rendered
document.addEventListener('DOMContentLoaded', function () {
    const generate = document.getElementById('generate');
    generate.addEventListener('click', getWeather);
});