/**
 * All SQL models for dog table in DB.
 * @module models/dogs
 * @author Kieran Dhir
 * @see routes/* for the modules that require this module
 */

const db = require('../helpers/database');

/**
 * Get a single dog by its ID  
 * @param {integer} id - The dog ID
 * @returns {object} - Returns entire dog record
 */
exports.getById = async function getById (dogID) {
  const query = "SELECT * FROM dogs WHERE ID = ?;";
  const values = [dogID];
  const data = await db.run_query(query, values);
  return data;
}

/**
 * Get every dog matching an ID from an array
 * @param {array} dogIDs - Array of dog IDs
 * @returns {array} - Returns an array of dog entry objects
 */
 exports.getFavList = async function getFavList (dogIDs) {
  const query = "SELECT * FROM dogs WHERE ID IN (?);"
  const values = [dogIDs];
  const data = await db.run_query(query, values);
  return data;
}

/**
 * List all the dogs in the database 
 * @returns {array} - Returns an array of dog entry objects
 */
exports.getAll = async function getAll () {
  const query = "SELECT * FROM dogs;";
  const data = await db.run_query(query);
  return data;
}

/**
 * List all the dogs matching the query
 * @param {string} q - The search query
 * @returns {array} - Returns an array of dog entry objects
 */
exports.search = async function search (q) {
  const query = "SELECT * FROM dogs WHERE name LIKE ? OR breed LIKE ?;";
  const values = ['%'+q+'%', '%'+q+'%'];
  const data = await db.run_query(query, values);
  return data;
}

/**
 * Create a new dog in the database
 * @param {object} dog - The dog data to be inserted
 * @returns {object} - Returns an object stating DB changes
 */
exports.add = async function add (dog) {
  const query = "INSERT INTO dogs SET ?;";
  const data = await db.run_query(query, dog);
  return data;
}

/**
 * Delete a dog by its ID
 * @param {integer} dogID - The dog ID
 * @returns {object} - Returns an object stating DB changes
 */
exports.delById = async function delById (dogID) {
  const query = "DELETE FROM dogs WHERE ID = ?;";
  const values = [dogID];
  const data = await db.run_query(query, values);
  return data;
}

/**
 * Update an existing dog
 * @param {object} dog - The dog data to be updated
 * @returns {object} - Returns an object stating DB changes
 */
exports.update = async function update (dog) {
  const query = "UPDATE dogs SET ? WHERE ID = ?;";
  const values = [dog, dog.ID];
  const data = await db.run_query(query, values);
  return data;
}
