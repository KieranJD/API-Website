/**
 * A module to manage user permissions for favourites routes.
 * @module permissions/favourites
 * @author Kieran Dhir
 * @see routes/* for the modules that require this module
 */

const AccessControl = require('role-acl');
const grantsObject = require('./grants/favGrants'); 

const ac = new AccessControl(grantsObject.favGrants);

/**
 * 
 * @param {object} requester - the user requesting permission
 * @param {object} data - the owner of the records being requested
 * @returns {bool} - permission to perform operation
 */
exports.readAll = (requester, data) =>

  ac.can(requester.role).context({requester:requester.ID, owner:data.userID}).execute('readAll').sync().on('fav');

/**
 * 
 * @param {object} requester - the user requesting permission
 * @param {integer} userID - the owner of the records being requested
 * @returns {bool} - permission to perform operation
 */
exports.add = (requester, userID) =>

  ac.can(requester.role).context({requester:requester.ID, owner:userID}).execute('add').sync().on('fav');

/**
 * 
 * @param {object} requester - the user requesting permission
 * @param {integer} userID - the owner of the records being requested
 * @returns {bool} - permission to perform operation
 */
exports.delete = (requester, userID) =>

  ac.can(requester.role).context({requester:requester.ID, owner:userID}).execute('delete').sync().on('fav'); 