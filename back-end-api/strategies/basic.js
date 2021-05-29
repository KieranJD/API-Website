/**
 * A module to run Basic Authentication for users.
 * @module strategies/basic
 * @author Kieran Dhir
 */

const BasicStrategy = require('passport-http').BasicStrategy;
const users = require('../models/users');
const bcrypt = require('bcrypt');

/**
 * Function to verify if user's password hash and DB password hash match
 * @param {object} user - The user record in DB to be matched
 * @param {string} password - The password form input
 * @returns {bool} - Returns true if password hash matched the stored password hash in the DB
 */
const verifyPassword = function (user, password) {
  const isMatch = bcrypt.compareSync(password, user.password);
  return isMatch;
}

/**
 * Function to verify the login form input username and password match a valid user record in DB
 * @param {object} username - The username form input
 * @param {string} password - The password form input
 * @param {function} done - When preceded by a return it stops function executing immediately
 * @returns {object|bool} - Returns the user object if matched or false if invalid
 */
const checkUserAndPass = async (username, password, done) => {
  let result;

  /** 
   * Check username exists in DB 
   * Call done() with either an error or the user, depending on outcome 
   */ 
  try {
    result = await users.findByUsername(username);
  } catch (error) {
    console.error(`Error during authentication for user ${username}`);
    return done(error);
  }

  /** If user record exists */
  if (result.length) {
    const user = result[0];
    if (verifyPassword(user, password)) { /** If password hash matches hash stored in DB */
      console.log(`Successfully authenticated user ${username}`);
      return done(null, user);
    } else {
      console.log(`Password incorrect for user ${username}`);
    }
  } else {
    console.log(`No user found with username ${username}`);
  }
  return done(null, false);
}

/** Validate username and password against DB for logging in users */
const strategy = new BasicStrategy(checkUserAndPass);
module.exports = strategy;