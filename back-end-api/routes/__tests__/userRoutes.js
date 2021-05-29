/**
 * This module will handle testing user route API calls.
 * @module routes/__tests__/userRoutes
 * @author Kieran Dhir
 */

const request = require('supertest')
const app = require('../../app')
var admin_token = '';
var user_token = '';
var adminID;
var userID;

describe('Post new user', () => {
  it('should create a new admin account', async () => {
    const res = await request(app.callback())
      .post('/users/register')
      .send({
        username: 'canine_admin',
        email: 'canine_admin@example.com',
        password: 'password',
        role: '1234'
      })
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('created', true)
    adminID = res.body.ID
  })
  
  it('should create a new user account', async () => {
    const res = await request(app.callback())
      .post('/users/register')
      .send({
        username: 'canine',
        email: 'canine@example.com',
        password: 'password'
      })
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('created', true)
    userID = res.body.ID
  })

  it('should fail due to incorrect admin code', async () => {
    const res = await request(app.callback())
      .post('/users/register')
      .send({
        username: 'unique_123',
        email: 'unique_123@example.com',
        password: 'password',
        role: '12345'
      })
    expect(res.statusCode).toEqual(409)
    expect(res.body).toHaveProperty('message', 'Invalid admin code')
  })

  it('should fail due to duplicate username and email', async () => {
    const res = await request(app.callback())
      .post('/users/register')
      .send({
        username: 'canine',
        email: 'canine@example.com',
        password: 'password'
      })
    expect(res.statusCode).toEqual(409)
    expect(res.body).toHaveProperty('message', 'Username and Email already taken')
  })

  it('should fail due to duplicate username', async () => {
    const res = await request(app.callback())
      .post('/users/register')
      .send({
        username: 'canine',
        email: 'unique_123@gmail.com',
        password: 'password'
      })
    expect(res.statusCode).toEqual(409)
    expect(res.body).toHaveProperty('message', 'Username already taken')
  })

  it('should fail due to duplicate email', async () => {
    const res = await request(app.callback())
      .post('/users/register')
      .send({
        username: 'unique_123',
        email: 'canine@example.com',
        password: 'password'
      })
    expect(res.statusCode).toEqual(409)
    expect(res.body).toHaveProperty('message', 'Email already taken')
  })

  it('should fail due email being invalid', async () => {
    const res = await request(app.callback())
      .post('/users/register')
      .send({
        username: 'unique_123',
        email: 'unique_123example.com',
        password: 'password'
      })
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message',
     'instance.email does not conform to the \"email\" format')
  })

  it('should fail due username not being a string', async () => {
    const res = await request(app.callback())
      .post('/users/register')
      .send({
        username: 1234,
        email: 'unique_123@example.com',
        password: 'password'
      })
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message',
     'instance.username is not of a type(s) string')
  })

  it('should fail due password not being a string', async () => {
    const res = await request(app.callback())
      .post('/users/register')
      .send({
        username: 'unique_123',
        email: 'unique_123@example.com',
        password: 123456
      })
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message',
     'instance.password is not of a type(s) string')
  })

  it('should fail due to username being too short', async () => {
    const res = await request(app.callback())
      .post('/users/register')
      .send({
        username: 'u',
        email: 'unique_123@example.com',
        password: 'password'
      })
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message',
     'instance.username does not meet minimum length of 2')
  })

  it('should fail due to username being too long', async () => {
    const res = await request(app.callback())
      .post('/users/register')
      .send({
        username: 'unique_1233333333333333333333333',
        email: 'unique_123@example.com',
        password: 'password'
      })
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message',
     'instance.username does not meet maximum length of 16')
  })

  it('should fail due to password being too short', async () => {
    const res = await request(app.callback())
      .post('/users/register')
      .send({
        username: 'unique_123',
        email: 'unique_123@example.com',
        password: 'pass'
      })
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message',
     'instance.password does not meet minimum length of 8')
  })

  it('should fail due to password being too long', async () => {
    const res = await request(app.callback())
      .post('/users/register')
      .send({
        username: 'unique_123',
        email: 'unique_123@example.com',
        password: 'passworddddddddddddddddddddd'
      })
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message',
     'instance.password does not meet maximum length of 16')
  })

  it('should fail due an extra field', async () => {
    const res = await request(app.callback())
      .post('/users/register')
      .send({
        username: 'unique_123',
        email: 'unique_123@example.com',
        password: 'password',
        extra: 'extra'
      })
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message',
     'instance is not allowed to have the additional property \"extra\"')
  })

  it('should fail due no password field', async () => {
    const res = await request(app.callback())
      .post('/users/register')
      .send({
        username: 'unique_123',
        email: 'unique_123@example.com'
      })
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message', 'instance requires property \"password\"')
  })
});

describe('Post user login', () => {
  it('should succeed for admin account', async () => {
    const res = await request(app.callback())
      .post('/users/login')
      .set('Authorization', 'Basic Y2FuaW5lX2FkbWluOnBhc3N3b3Jk')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(
      expect.objectContaining({loggedIn: true, ID: adminID,
       role: 'admin', username: 'canine_admin'}),
    )
    admin_token = res.body.token
  })
  
  it('should succeed for user account', async () => {
    const res = await request(app.callback())
      .post('/users/login')
      .set('Authorization', 'Basic Y2FuaW5lOnBhc3N3b3Jk')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(
      expect.objectContaining({loggedIn: true, ID: userID,
       role: 'user', username: 'canine'}),
    )
    user_token = res.body.token
  })

  it('should be prevented', async () => {
    const res = await request(app.callback())
      .post('/users/login')
      .set('Authorization', 'Basic Y2FuaW5lOnBhc3N3b3JkMQ===')
    expect(res.statusCode).toEqual(401)
  })
});

describe('Get all users', () => {
  it('should succeed with admin account', async () => {
    const res = await request(app.callback())
      .get('/users')
      .set('Authorization', admin_token)
    expect(res.statusCode).toEqual(200)
  })

  it('should not succeed with user account', async () => {
    const res = await request(app.callback())
      .get('/users')
      .set('Authorization', user_token)
    expect(res.statusCode).toEqual(403)
  })
});

describe('Get user by userID', () => {
  it('should get the admins account (admin)', async () => {
    const res = await request(app.callback())
      .get(`/users/${adminID}`)
      .set('Authorization', admin_token)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(
      expect.objectContaining({ID: adminID, role: 'admin',
       email: 'canine_admin@example.com', username: 'canine_admin'}),
    )
  })

  it('should get the users account (admin)', async () => {
    const res = await request(app.callback())
      .get(`/users/${userID}`)
      .set('Authorization', admin_token)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(
      expect.objectContaining({ID: userID, role: 'user',
       email: 'canine@example.com', username: 'canine'}),
    )
  })

  it('should get the user account (user)', async () => {
    const res = await request(app.callback())
    .get(`/users/${userID}`)
      .set('Authorization', user_token)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(
      expect.objectContaining({ID: userID, role: 'user',
       email: 'canine@example.com', username: 'canine'}),
    )
  })

  it('should fail to get the admin account (user)', async () => {
    const res = await request(app.callback())
    .get(`/users/${adminID}`)
      .set('Authorization', user_token)
    expect(res.statusCode).toEqual(403)
  })

  it('should fail due to unknown userID', async () => {
    const res = await request(app.callback())
      .get('/users/1000')
      .set('Authorization', admin_token)
    expect(res.statusCode).toEqual(404)
  })
});
