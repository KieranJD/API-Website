/**
 * Set up passport and its basic authentication strategy
 * Importing this module in a route gives a middleware handler that can be used
 * to protect downstream handlers by rejecting unauthenticated requests
 * @module controllers/auth
 * @author Kieran Dhir
 * @see strategies/basic for basic auth functionality
 */

const passport = require('koa-passport');
const basicAuth = require('../strategies/basic');

passport.use(basicAuth);

module.exports = passport.authenticate(['basic'], {session:false});
