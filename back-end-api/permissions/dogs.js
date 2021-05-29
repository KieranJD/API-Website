/**
 * A module to manage user permissions for dogs routes.
 * @module permissions/dogs
 * @author Kieran Dhir
 * @see routes/* for the modules that require this module
 */

const AccessControl = require('role-acl');
const grantsObject = require('./grants/dogGrants'); 

const ac = new AccessControl(grantsObject.dogGrants);

/**
 * 
 * @param {object} requester - the user requesting permission 
 * @returns {bool} - permission to perform operation
 */
exports.add = (requester) =>

  ac.can(requester.role).execute('add').sync().on('dog');

/**
 * 
 * @param {object} requester - the user requesting permission 
 * @returns {bool} - permission to perform operation
 */
exports.update = (requester) =>

  ac.can(requester.role).execute('update').sync().on('dog');

/**
 * 
 * @param {object} requester - the user requesting permission 
 * @returns {bool} - permission to perform operation
 */  
exports.delete = (requester) =>

  ac.can(requester.role).execute('delete').sync().on('dog'); 