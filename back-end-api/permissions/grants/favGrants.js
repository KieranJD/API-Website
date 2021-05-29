/**
 * A module to manage user grants for favourites routes.
 * @module permissions/grants/favGrants
 * @author Kieran Dhir
 * @see permissions/favourites for the module that requires this module
 */

const grantsObject = {
  admin: {
    grants: [
      {
        resource: 'fav', action: 'readAll', attributes: ['*'],
      },
      {
        resource: 'fav', action: 'add', attributes: ['*', '!userID'],
      },
      {
        resource: 'fav', action: 'delete', attributes: ['*'],
      }
    ]
  },
  user: {
    grants: [
      {
        resource: 'fav', action: 'readAll', attributes: ['*', '!userID'],
        condition: {
          Fn: 'EQUALS',
          args: {
            'requester':'$.owner'
          }
        }
      },
      {
        resource: 'fav', action: 'add', attributes: ['*'],
        condition: {
          Fn: 'EQUALS',
          args: {
            'requester':'$.owner'
          }
        }
      },
      {
        resource: 'fav', action: 'delete', attributes: ['*'],
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

exports.favGrants = grantsObject;