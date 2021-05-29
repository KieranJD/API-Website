/**
 * A module to issue JWT tokens.
 * @module strategies/issueJwt
 * @author Kieran Dhir
 */

const jsonwebtoken = require('jsonwebtoken')
const path = require('path');
const fs = require('fs');

/** Import Private RSA key */
const pathToKey = path.join(__dirname, '..', 'helpers/rsa_priv.pem');
console.log(pathToKey);
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');

/**
 * Function to issue JWT token to a given user
 * @param {integer} id - The user ID to be issued its unique JWT token
 * @returns {object} - Returns JWT token and expiry date
 */
function issueJwt(id){
  const expiresIn = '1d';
  /** Generate payload with user's ID and current Date */
  const payload = {
    sub: id,
    iat: Date.now()
  };

  /** Sign the JWT token with given payload and Private RSA key */
  const signedToken = jsonwebtoken.sign(
    payload,
    PRIV_KEY,
    {expiresIn: expiresIn, algorithm: 'RS256'});
  /** Returns token and its expire date*/
  return {
    token: "Bearer " + signedToken,
    expires: expiresIn
  }
}

module.exports = issueJwt;