/**
 * This module will handle testing dog route API calls.
 * @module routes/__tests__/dogRoutes
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

describe('Post new user for dog test', () => {
  it('should create a new admin account', async () => {
    const res = await request(app.callback())
      .post('/users/register')
      .send({
        username: 'canine2_admin',
        email: 'canine_admin2@example.com',
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
        username: 'canine2',
        email: 'canine2@example.com',
        password: 'password'
      })
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('created', true)
    user_token = res.body.token
    userID = res.body.ID
  })
});

describe('Post new dog', () => {
  it('should create a new dog account', async () => {
    const res = await request(app.callback())
      .post('/dogs/upload')
      .set('Authorization', admin_token)
      .send({
        name: 'Tilly',
        breed: 'bloodhound',
        sex: 'Female',
        age: 7
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
          name: 'Klaus',
          breed: 'bloodhound',
          sex: 'Male',
          age: 6
        })
      expect(res.statusCode).toEqual(201)
      expect(res.body).toHaveProperty('created', true)
      dogID_2 = res.body.ID
  })

  it('should fail as users cannot post new dogs', async () => {
    const res = await request(app.callback())
      .post('/dogs/upload')
      .set('Authorization', user_token)
      .send({
        name: 'Buster',
        breed: 'bloodhound',
        sex: 'Male',
        age: 10
      })
    expect(res.statusCode).toEqual(403)
  })

  it('should fail as breed field missing', async () => {
    const res = await request(app.callback())
      .post(`/dogs/upload`)
      .set('Authorization', admin_token)
      .send({
        name: 'Tilly',
        sex: 'Female',
        age: 2
      })
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message', 'instance requires property \"breed\"')
  })

  it('should fail as extra field included', async () => {
    const res = await request(app.callback())
      .post(`/dogs/upload`)
      .set('Authorization', admin_token)
      .send({
        name: 'Tilly',
        breed: 'bloodhound',
        sex: 'Female',
        age: 2,
        extra: 'extra'
      })
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message',
     'instance is not allowed to have the additional property \"extra\"')
  })

  it('should fail due to name being too short', async () => {
    const res = await request(app.callback())
      .post(`/dogs/upload`)
      .set('Authorization', admin_token)
      .send({
        name: 'T',
        breed: 'bloodhound',
        sex: 'Female',
        age: 2
      })
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message',
     'instance.name does not meet minimum length of 2')
  })

  it('should fail due to name being too long', async () => {
    const res = await request(app.callback())
      .post(`/dogs/upload`)
      .set('Authorization', admin_token)
      .send({
        name: 'Tillyyyyyyyyyyyyyyyyyyyyyyyy',
        breed: 'bloodhound',
        sex: 'Female',
        age: 2
      })
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message',
     'instance.name does not meet maximum length of 20')
  })

  it('should fail due to breed being too short', async () => {
    const res = await request(app.callback())
      .post(`/dogs/upload`)
      .set('Authorization', admin_token)
      .send({
        name: 'Tilly',
        breed: 'b',
        sex: 'Female',
        age: 2
      })
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message',
     'instance.breed does not meet minimum length of 2')
  })

  it('should fail due to breed being too long', async () => {
    const res = await request(app.callback())
      .post(`/dogs/upload`)
      .set('Authorization', admin_token)
      .send({
        name: 'Tilly',
        breed: 'bloodhoundddddddddddddddddddd',
        sex: 'Female',
        age: 2
      })
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message',
     'instance.breed does not meet maximum length of 20')
  })

  it('should fail due to sex being too long', async () => {
    const res = await request(app.callback())
      .post(`/dogs/upload`)
      .set('Authorization', admin_token)
      .send({
        name: 'Tilly',
        breed: 'bloodhound',
        sex: 'Femaleeeeeeeeeeeeeeeee',
        age: 2
      })
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message',
     'instance.sex does not meet maximum length of 8')
  })

  it('should fail due to age being negative', async () => {
    const res = await request(app.callback())
      .post(`/dogs/upload`)
      .set('Authorization', admin_token)
      .send({
        name: 'Tilly',
        breed: 'bloodhound',
        sex: 'Female',
        age: -1
      })
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message',
     'instance.age must be greater than or equal to 0')
  })

  it('should fail due to age being too old', async () => {
    const res = await request(app.callback())
      .post(`/dogs/upload`)
      .set('Authorization', admin_token)
      .send({
        name: 'Tilly',
        breed: 'bloodhound',
        sex: 'Female',
        age: 100
      })
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message',
     'instance.age must be less than or equal to 25')
  })

  it('should fail due name not being a string', async () => {
    const res = await request(app.callback())
    .post(`/dogs/upload`)
      .set('Authorization', admin_token)
      .send({
        name: 1234,
        breed: 'bloodhound',
        sex: 'Male',
        age: 6
      })
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message',
     'instance.name is not of a type(s) string')
  })

  it('should fail due breed not being a string', async () => {
    const res = await request(app.callback())
    .post(`/dogs/upload`)
      .set('Authorization', admin_token)
      .send({
        name: 'Klaus',
        breed: 1234,
        sex: 'Male',
        age: 6
      })
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message',
     'instance.breed is not of a type(s) string')
  })

  it('should fail due sex not being a string', async () => {
    const res = await request(app.callback())
    .post(`/dogs/upload`)
      .set('Authorization', admin_token)
      .send({
        name: 'Klaus',
        breed: 'bloodhound',
        sex: 1234,
        age: 6
      })
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message',
     'instance.sex is not of a type(s) string')
  })

  it('should fail due age not being an integer', async () => {
    const res = await request(app.callback())
    .post(`/dogs/upload`)
      .set('Authorization', admin_token)
      .send({
        name: 'Klaus',
        breed: 'bloodhound',
        sex: 'Male',
        age: '6'
      })
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message',
     'instance.age is not of a type(s) integer')
  })

});


describe('Get a list of all dogs', () => {
  it('should list all dogs for admin', async () => {
    const res = await request(app.callback())
      .get(`/dogs`)
      .set('Authorization', admin_token)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toContainEqual(
        expect.objectContaining({ID: dogID_1, name: 'Tilly', breed: 'bloodhound',
         sex: 'Female', age: 7}),
      )
      expect(res.body).toContainEqual(
        expect.objectContaining({ID: dogID_2, name: 'Klaus', breed: 'bloodhound',
         sex: 'Male', age: 6}),
      )
  })

  it('should list all dogs for user', async () => {
    const res = await request(app.callback())
      .get(`/dogs`)
      .set('Authorization', user_token)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toContainEqual(
        expect.objectContaining({ID: dogID_1, name: 'Tilly', breed: 'bloodhound',
         sex: 'Female', age: 7}),
      )
      expect(res.body).toContainEqual(
        expect.objectContaining({ID: dogID_2, name: 'Klaus', breed: 'bloodhound',
         sex: 'Male', age: 6}),
      )
  })
});


describe('Get dog(s) matching search query', () => {
  it('should get dog Klaus for admin', async () => {
    const res = await request(app.callback())
      .get('/dogs/search?q=Klaus')
      .set('Authorization', admin_token)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({name: 'Klaus', breed: 'bloodhound',
         sex: 'Male', age: 6}),
      ])
    )
  })

  it('should get dog Klaus for user', async () => {
    const res = await request(app.callback())
      .get('/dogs/search?q=Klaus')
      .set('Authorization', user_token)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({name: 'Klaus', breed: 'bloodhound',
         sex: 'Male', age: 6}),
      ])
    )
  })

  it('should get all dogs of breed bloodhound', async () => {
    const res = await request(app.callback())
      .get('/dogs/search?q=bloodhound')
      .set('Authorization', admin_token)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({name: 'Klaus', breed: 'bloodhound',
         sex: 'Male', age: 6}),
        expect.objectContaining({name: 'Tilly', breed: 'bloodhound',
         sex: 'Female', age: 7})
      ])
    )
  })

  it('should fail as no matching dog entries', async () => {
    const res = await request(app.callback())
      .get('/dogs/search?q=impossible_dog')
      .set('Authorization', admin_token)
    expect(res.statusCode).toEqual(404)
  })

});

describe('Get dog by dogID', () => {
  it('should get dog dogID_1 for admin', async () => {
    const res = await request(app.callback())
      .get(`/dogs/${dogID_1}`)
      .set('Authorization', admin_token)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(
      expect.objectContaining({ID: dogID_1, name: 'Tilly', breed: 'bloodhound',
       sex: 'Female', age: 7}),
    )
  })

  it('should get dog dogID_1 for user', async () => {
    const res = await request(app.callback())
      .get(`/dogs/${dogID_1}`)
      .set('Authorization', user_token)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(
      expect.objectContaining({ID: dogID_1, name: 'Tilly', breed: 'bloodhound',
       sex: 'Female', age: 7}),
    )
  })

  it('should fail as dog does not exist', async () => {
    const res = await request(app.callback())
      .get(`/dogs/9999999`)
      .set('Authorization', admin_token)
    expect(res.statusCode).toEqual(404)
  })

});

describe('Put dog by dogID', () => {
  it('should update dog dogID_1', async () => {
    const res = await request(app.callback())
      .put(`/dogs/${dogID_1}`)
      .set('Authorization', admin_token)
      .send({
        name: 'Tilly',
        breed: 'bloodhound-hunter',
        sex: 'Female',
        age: 13
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('updated', true)
  })

  it('should fail as users cannot update dogs', async () => {
    const res = await request(app.callback())
      .put(`/dogs/${dogID_1}`)
      .set('Authorization', user_token)
      .send({
        name: 'Tilly',
        breed: 'bloodhound-dog',
        sex: 'Female',
        age: 13
      })
    expect(res.statusCode).toEqual(403)
  })

  it('should fail as dog does not exist', async () => {
    const res = await request(app.callback())
      .put(`/dogs/99999999`)
      .set('Authorization', user_token)
      .send({
        name: 'Tilly',
        breed: 'bloodhound-dog',
        sex: 'Female',
        age: 13
      })
    expect(res.statusCode).toEqual(404)
  })

  it('should fail as breed field missing', async () => {
    const res = await request(app.callback())
      .put(`/dogs/${dogID_1}`)
      .set('Authorization', admin_token)
      .send({
        name: 'Tilly',
        sex: 'Female',
        age: 2
      })
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message', 'instance requires property \"breed\"')
  })

  it('should fail as extra field included', async () => {
    const res = await request(app.callback())
      .put(`/dogs/${dogID_1}`)
      .set('Authorization', admin_token)
      .send({
        name: 'Tilly',
        breed: 'bloodhound',
        sex: 'Female',
        age: 2,
        extra: 'extra'
      })
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message',
    'instance is not allowed to have the additional property \"extra\"')
  })

});

describe('Delete dog entries', () => {
  it('should delete the dog dogID_2 for admin', async () => {
    const res = await request(app.callback())
      .delete(`/dogs/${dogID_2}`)
      .set('Authorization', admin_token)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('deleted', true)
  })

  it('should fail as dog dogID_2 now does not exists', async () => {
    const res = await request(app.callback())
      .get(`/dogs/${dogID_2}`)
      .set('Authorization', admin_token)
    expect(res.statusCode).toEqual(404)
  })

  it('should fail as users cannot delete dogs', async () => {
    const res = await request(app.callback())
      .delete(`/dogs/${dogID_1}`)
      .set('Authorization', user_token)
    expect(res.statusCode).toEqual(403)
  })

});