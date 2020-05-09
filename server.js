// Setup empty JS object to act as endpoint for all routes
let projectData = {};

// Require Express to run server and routes
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

// Setup Server
const port = 4200;
app.listen(port, () => console.log(`Listening on port: ${port}`));

//send updated weather data
function getWeather(request, response) {
    response.send(projectData);
}

//save weather data received from open weather api and user input from client
function postWeather(request, response) {
    projectData = {
        temperature: request.body.temperature,
        date: request.body.date,
        userResponse: request.body.userResponse
    };
    console.log(projectData);
    response.send('200');
}

app.get('/weather', getWeather);
app.post('/weather', postWeather);