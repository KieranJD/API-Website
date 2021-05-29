/**
 * Set up passport and its jwt strategy
 * Importing this module in a route gives a middleware handler that can be used
 * to protect downstream handlers by rejecting unauthenticated requests
 * @module controllers/token
 * @author Kieran Dhir
 * @see strategies/verifyJWT for jwt functionality
 */

const passport = require('koa-passport');

require('../strategies/verifyJwt')(passport);
passport.initialize();

module.exports =  passport.authenticate('jwt', { session: false })