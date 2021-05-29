/**
 * All SQL models for favourite table in DB.
 * @module models/favourites
 * @author Kieran Dhir
 * @see routes/* for the modules that require this module
 */

const db = require('../helpers/database');

/**
 * Get all a user's favourite dog IDs
 * @param {integer} userID - The user's ID
 * @returns {array} - Returns an array of objects containing user's ID and corresponding Dog ID 
 */
exports.getAll = async function getAll (userID) {
  const query = "SELECT * FROM favourites WHERE userID = ?;";
  const values = [userID];
  const data = await db.run_query(query, values);
  return data;
}

/**
 * Get a favourite record matching userID and dogID
 * @param {integer} userID - The user's ID
 * @returns {object} - Returns an object containing user's ID and corresponding Dog ID 
 */
exports.getById = async function getById (userID, dogID) {
  const query = "SELECT * FROM favourites WHERE userID = ? AND dogID = ?;";
  const values = [userID, dogID];
  const data = await db.run_query(query, values);
  return data;
}

/**
 * Create a new favourite dog for a user
 * @param {integer} userID - The user ID
 *  * @param {integer} dogID - The dog ID
 * @returns {object} - Returns an object stating DB changes
 */
exports.add = async function add (userID, dogID) {
  const query = "INSERT INTO favourites SET ?;";
  values = {userID, dogID};
  const data = await db.run_query(query, values);
  return data;
}

/**
 * Delete a favourite dog for a user
 * @param {integer} userID - The user ID
 *  * @param {integer} dogID - The dog ID
 * @returns {object} - Returns an object stating DB changes
 */
exports.delById = async function delById (userID, dogID) {
  const query = "DELETE FROM favourites WHERE userID = ? AND dogID = ?;";
  const values = [userID, dogID];
  const data = await db.run_query(query, values);
  return data;
}

