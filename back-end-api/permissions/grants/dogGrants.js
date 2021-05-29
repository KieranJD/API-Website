/**
 * A module to manage user grants for dog routes.
 * @module permissions/grants/dogsGrants
 * @author Kieran Dhir
 * @see permissions/dogs for the module that requires this module
 */

const grantsObject = {
  admin: {
    grants: [
      {
        resource: 'dog', action: 'add', attributes: ['*']
      },
      {
        resource: 'dog', action: 'delete', attributes: ['*']
      },
      {
        resource: 'dog', action: 'update', attributes: ['*']
      }
    ]
  },
  user: {
      
  }
}

exports.dogGrants =  grantsObject;