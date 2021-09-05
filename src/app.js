const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');


const app = express();

//Define paths for Express config
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

//Setup handlebars engine and view location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

//Setup static directory to serve
app.use(express.static('public'));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Minh Tu'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Minh Tu'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        message: 'Hello',
        title: "Help",
        name: "Minh Tu"
    });
});

app.get('/weather', (req, res) => {
    const address = req.query.address;
    if (!address) {
        return res.send({
            error
        });
    } else {
        geocode(address, (error, {latitude, longitude, location} = {}) => {
            if (error) {
                return res.send({
                    error: "You must provide an address!"
                });
            }
            forecast(latitude, longitude, (error, forecastData) => {
                if (error) {
                    res.send({error});
                }
                res.send({
                    forecast: forecastData,
                    location,
                    address
                });
            });

        });
    }

});

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        message: 'Help article not found',
        name: 'Minh Tu'
    });
});

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        message: 'Page not found',
        name: 'Minh Tu'
    });
});

app.listen(3000, () => {
    console.log("listening on port 3000");
});