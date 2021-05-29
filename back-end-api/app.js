/**
 * A module to set-up koa app and routes.
 * @module app
 * @author Kieran Dhir
 */

const Koa = require('koa');
const cors = require('@koa/cors');
const app = new Koa();
const corsOptions = {
    origin: 'https://coral-sensor-3000.codio-box.uk',
}

app.use(cors(corsOptions));

const users = require('./routes/users.js');
const dogs = require('./routes/dogs.js');
const favourites = require('./routes/favourites.js');

app.use(users.routes());
app.use(dogs.routes());
app.use(favourites.routes());

module.exports = app;