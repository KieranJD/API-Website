/**
 * All SQL models for users table in DB.
 * @module models/users
 * @author Kieran Dhir
 * @see routes/* for the modules that require this module
 */

const db = require('../helpers/database');
const bcrypt = require('bcrypt');

/**
 * Get a single user by its ID
 * @param {integer} userID - The user ID
 * @returns {object} - Returns entire user record
 */
exports.getById = async function getById (userID) {
  const query = "SELECT * FROM users WHERE ID = ?;";
  const values = [userID];
  const data = await db.run_query(query, values);
  return data;
}

/**
 * Get a single user by the (unique) username 
 * @param {string} username - The user's username
 * @returns {object} - Returns entire user record
 */
exports.findByUsername = async function getByUsername(username) {
const query = "SELECT * FROM users WHERE username = ?;";
const user = await db.run_query(query, username);
return user;
}

/**
 * Get a single user by the (unique) email
 * @param {string} email - The user's email
 * @returns {object} - Returns entire user record
 */
exports.findByEmail = async function getByEmail(email) {
  const query = "SELECT * FROM users WHERE email = ?;";
  const user = await db.run_query(query, email);
  return user;
  }

/**
 * List all the users in the database
 * @returns {array} - Returns an array of user objects
 */
exports.getAll = async function getAll () {
  const query = "SELECT * FROM users;";
  const data = await db.run_query(query);
  return data;
}

/**
 * Create a new user in the database
 * @param {object} user - The user data to be inserted
 * @returns {object} - Returns an object stating DB changes
 */
exports.register = async function register (user) {
  const query = "INSERT INTO users SET ?;";
  const password = user.password;
  const hash = bcrypt.hashSync(password, 10);
  user.password = hash;
  const data = await db.run_query(query, user);
  return data;
}

/**
 * Delete a user by its ID
 * @param {integer} userID - The user ID
 * @returns {object} - Returns an object stating DB changes
 */
exports.delById = async function delById (userID) {
  const query = "DELETE FROM users WHERE ID = ?;";
  const values = [userID];
  const data = await db.run_query(query, values);
  return data;
}

/**
 * Update an existing user
 * @param {object} dog - The user data to be updated
 * @returns {object} - Returns an object stating DB changes
 */
exports.update = async function update (user) {
  const query = "UPDATE users SET ? WHERE ID = ?;";
  const password = user.password;
  const hash = bcrypt.hashSync(password, 10);
  user.password = hash;
  const values = [user, user.ID];
  const data = await db.run_query(query, values);
  return data;
}
