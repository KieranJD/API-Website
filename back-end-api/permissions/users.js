/**
 * A module to manage user permissions for users routes.
 * @module permissions/users
 * @author Kieran Dhir
 * @see routes/* for the modules that require this module
 */

const AccessControl = require('role-acl');
const grantsObject = require('./grants/userGrants'); 

const ac = new AccessControl(grantsObject.userGrants);

/**
 * 
 * @param {object} requester - the user requesting permission 
 * @returns {bool} - permission to perform operation
 */
exports.readAll = (requester) =>

  ac.can(requester.role).execute('read').sync().on('users');

/**
 * 
 * @param {object} requester - the user requesting permission
 * @param {object} data - the owner of the records being requested
 * @returns {bool} - permission to perform operation
 */
exports.read = (requester, data) =>

  ac.can(requester.role).context({requester:requester.ID, owner:data.ID}).execute('read').sync().on('user');
