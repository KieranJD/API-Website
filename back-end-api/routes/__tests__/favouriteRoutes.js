/**
 * This module will handle testing favourites route API calls.
 * @module routes/__tests__/favouriteRoutes
 * @author Kieran Dhir
 */

const request = require('supertest')
const app = require('../../app')
var admin_token = '';
var user_token = '';
var adminID;
var userID;
var dogID_1;
var dogID_2;

describe('Post new user for favourite tests', () => {
  it('should create a new admin account', async () => {
    const res = await request(app.callback())
      .post('/users/register')
      .send({
        username: 'canine3_admin',
        email: 'canine_admin3@example.com',
        password: 'password',
        role: '1234'
      })
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('created', true)
    admin_token = res.body.token
    adminID = res.body.ID
  })

  it('should create a new user account', async () => {
    const res = await request(app.callback())
      .post('/users/register')
      .send({
        username: 'canine3',
        email: 'canine3@example.com',
        password: 'password'
      })
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('created', true)
    user_token = res.body.token
    userID = res.body.ID
  })
});

describe('Post new dog for favourite tests', () => {
    it('should create a new dog account', async () => {
      const res = await request(app.callback())
        .post('/dogs/upload')
        .set('Authorization', admin_token)
        .send({
          name: 'Marley',
          breed: 'german shepherd',
          sex: 'Male',
          age: 3
        })
      expect(res.statusCode).toEqual(201)
      expect(res.body).toHaveProperty('created', true)
      dogID_1 = res.body.ID
    })

    it('should create a new dog account again', async () => {
        const res = await request(app.callback())
          .post('/dogs/upload')
          .set('Authorization', admin_token)
          .send({
            name: 'Barney',
            breed: 'pug',
            sex: 'Male',
            age: 5
          })
        expect(res.statusCode).toEqual(201)
        expect(res.body).toHaveProperty('created', true)
        dogID_2 = res.body.ID
      })
});

describe('Post a new favourite dog', () => {
    it('should create a new favourite dog entry for admin', async () => {
      const res = await request(app.callback())
        .post(`/users/${adminID}/favourites/${dogID_1}`)
        .set('Authorization', admin_token)
      expect(res.statusCode).toEqual(201)
      expect(res.body).toHaveProperty('ID', dogID_1)
      expect(res.body).toHaveProperty('created', true)
    })
  
    it('should create a new favourite dog entry for user', async () => {
      const res = await request(app.callback())
        .post(`/users/${userID}/favourites/${dogID_1}`)
        .set('Authorization', user_token)
      expect(res.statusCode).toEqual(201)
      expect(res.body).toHaveProperty('created', true)
    })

    it('should create a new favourite dog entry for user (admin)', async () => {
        const res = await request(app.callback())
          .post(`/users/${userID}/favourites/${dogID_2}`)
          .set('Authorization', admin_token)
        expect(res.statusCode).toEqual(201)
        expect(res.body).toHaveProperty('ID', dogID_2)
        expect(res.body).toHaveProperty('created', true)
      })

    it('should fail as users can only add to own favourites', async () => {
        const res = await request(app.callback())
          .post(`/users/${adminID}/favourites/${dogID_2}`)
          .set('Authorization', user_token)
        expect(res.statusCode).toEqual(403)
    })

    it('should fail due to duplicate entry', async () => {
      const res = await request(app.callback())
        .post(`/users/${adminID}/favourites/${dogID_1}`)
        .set('Authorization', admin_token)
      expect(res.statusCode).toEqual(401)
    })

    it('should fail due to unknown dog entry', async () => {
      const res = await request(app.callback())
        .post(`/users/${adminID}/favourites/1000`)
        .set('Authorization', admin_token)
      expect(res.statusCode).toEqual(404)
    })

    it('should fail due to unknown user', async () => {
      const res = await request(app.callback())
        .post(`/users/1000/favourites/${dogID_2}}`)
        .set('Authorization', user_token)
      expect(res.statusCode).toEqual(404)
    })
});

describe('Get a list of a users favourites', () => {
  it('should list all favourite dogs for admin (admin)', async () => {
    const res = await request(app.callback())
      .get(`/users/${adminID}/favourites/`)
      .set('Authorization', admin_token)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({name: 'Marley', breed: 'german shepherd',
         sex: 'Male', age: 3})
      ])
    )
  })

  it('should list all favourite dogs for user (user)', async () => {
    const res = await request(app.callback())
      .get(`/users/${userID}/favourites/`)
      .set('Authorization', user_token)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({name: 'Marley', breed: 'german shepherd',
         sex: 'Male', age: 3}),
        expect.objectContaining({name: 'Barney', breed: 'pug',
         sex: 'Male', age: 5})
      ])
    )
  })

  it('should list all favourite dogs for user (admin)', async () => {
    const res = await request(app.callback())
      .get(`/users/${userID}/favourites/`)
      .set('Authorization', admin_token)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({name: 'Marley', breed: 'german shepherd',
         sex: 'Male', age: 3}),
        expect.objectContaining({name: 'Barney', breed: 'pug',
         sex: 'Male', age: 5})
      ])
    )
  })

  it('should fail as users can only list thier own favoourites', async () => {
    const res = await request(app.callback())
      .get(`/users/${adminID}/favourites/`)
      .set('Authorization', user_token)
    expect(res.statusCode).toEqual(403)
  })

});

describe('Delete user favourite entries', () => {
  it('should fail as users can only delete their own', async () => {
    const res = await request(app.callback())
      .delete(`/users/${adminID}/favourites/${dogID_1}`)
      .set('Authorization', user_token)
    expect(res.statusCode).toEqual(403)
  })

  it('should delete the favourite dogID_1 for admin (admin)', async () => {
    const res = await request(app.callback())
      .delete(`/users/${adminID}/favourites/${dogID_1}`)
      .set('Authorization', admin_token)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('deleted', true)
  })

  it('should show admin favourite dogID_1 has been deleted', async () => {
    const res = await request(app.callback())
      .get(`/users/${adminID}/favourites/`)
      .set('Authorization', admin_token)
    expect(res.statusCode).toEqual(404)
  })

  it('should delete the favourite dogID_1 for user (user)', async () => {
    const res = await request(app.callback())
      .delete(`/users/${userID}/favourites/${dogID_1}`)
      .set('Authorization', user_token)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('deleted', true)
  })

  it('should delete the favourite dogID_2 for user (admin)', async () => {
    const res = await request(app.callback())
      .delete(`/users/${userID}/favourites/${dogID_2}`)
      .set('Authorization', admin_token)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('deleted', true)
  })

  it('should show user favourites have been deleted', async () => {
    const res = await request(app.callback())
      .get(`/users/${adminID}/favourite/`)
      .set('Authorization', admin_token)
    expect(res.statusCode).toEqual(404)
  })
});

/*

Fix status codes for openapi

*/