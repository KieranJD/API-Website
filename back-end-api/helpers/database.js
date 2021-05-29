/**
 * A module to connect to mysql DB and run SQL commands.
 * @module helpers/database
 * @author Kieran Dhir
 * @see models/* for the models that require this module
 */

const mysql = require('promise-mysql');  
const info = require('../config');
const { v4: uuidv4 } = require('uuid');

/**
 * Async utility function to get a connection to the DB.
 * @param {string} query - sql query string
 * @param {array|number|string} values - the values to insert into the sql query string
 * @returns {object} - a sql query response
 * @throws {DatabaseException} exception for DB query failures
 */
exports.run_query = async function run_query(query, values) {
  try {
    const connection = await mysql.createConnection(info.config);
    const data = await connection.query(query, values);
    await connection.end();
    return data;
  } catch (error) {
    /**
     * Don't let unknown errors propagate up to the response object
     * as it may contain sensitive server information.
     * Instead log it somehow and throw a generic error.
     */
    const errorId = uuidv4();
    console.error(Date.now(), errorId, query, values, error.message);
    throw new DatabaseException("Database error.", error.code, errorId);
  }
}

/**
 * A custom error constructor to re-raise DB erros in a sanitised way.
 * @class
 * @param {string} message - the error message
 * @param {string|integer} code - the original error's error code
 * @param {string} id - a UUID identifier for the error identified
 */
function DatabaseException(message, code, id) {
  this.message = message;
  this.code = code;
  this.id = id;
  this.name = 'DatabaseException';
}