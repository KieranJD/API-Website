/**
 * A module to manage user grants for user routes.
 * @module permissions/grants/userGrants
 * @author Kieran Dhir
 * @see permissions/users for the module that requires this module
 */

const grantsObject = {
  admin: {
    grants: [
      {
        resource: 'user', action: 'read', attributes: ['*', '!password']
      },
      {
        resource: 'users', action: 'read', attributes: ['*', '!password']
      }
    ]
  },
  user: {
    grants: [
      {
        resource: 'user', action: 'read', attributes: ['*', '!password'],
        condition: {
          Fn: 'EQUALS',
          args: {
            'requester':'$.owner'
          }
        }
      }
    ]
  }
}

exports.userGrants = grantsObject;