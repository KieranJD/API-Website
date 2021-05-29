/**
 * A module to verify JWT tokens.
 * @module strategies/verifyJwt
 * @author Kieran Dhir
 */

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const path = require('path');
const fs = require('fs');
const users = require('../models/users');

/** Import Public RSA key */
const pathToKey = path.join(__dirname, '..', 'helpers/rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

/** Generate passportjwt options to extract jwt from request header */
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms: ['RS256']
};

/**
 * Decode the jwt token using passport and options param then
 * Define an async function to extract the payload within the jwt token
 * @param {object} options - Options to extract jwt from request header
 * @param {object} payload - An object literal containing the decoded JWT payload
 * @param {function} done - A passport error first callback accepting arguments done(error, user, info)
 * @returns {object} - Returns user record object from DB
 */
module.exports = (passport) => {
  passport.use(new JwtStrategy(options, async function(payload, done) {
    id = payload.sub;
    /** Extract user from DB by the payload id */
    try{
      result = await users.getById(id);
    }catch (error){
      console.log(`Error during authenticarton for user id ${id}`);
      return done(error);
    }
    /** If user record exists */
    if (result.length){
      user = result[0];
      console.log(`Successfully authenticated as ${user.username}`);
      return done(null, user);
    }else{
      console.log(`No user found with id ${id}`);
      return done(null,false);
    }
  }))
}
