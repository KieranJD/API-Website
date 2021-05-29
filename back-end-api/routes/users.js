/**
 * This module will handle user route API calls.
 * @module routes/users
 * @author Kieran Dhir
 * @see models/* for the models that are required for this module
 */

const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/users');
const auth = require('../controllers/auth');
const verifyToken = require('../controllers/token');
const issueJwt = require('../strategies/issueJwt')
const {validateUser} = require('../controllers/validation');
const can = require('../permissions/users');
const info = require('../config');

const prefix = '/users';
const router = Router({prefix: prefix});

/** Routes */
router.get('/', verifyToken, getAll);
router.post('/register', bodyParser(), validateUser, registerUser);
router.post('/login', bodyParser(), auth, loginUser);
router.get('/:id([0-9]{1,})', verifyToken, getById);

/**
 * Async utility function to get all users.
 * @param {object} ctx - the Koa request/response context object
 */
async function getAll(ctx) {
  const permission = can.readAll(ctx.state.user);
  if (!permission.granted) {
    ctx.status = 403;
  } else {
    const result = await model.getAll();
    if (result.length) {
      ctx.status = 200;
      ctx.body = permission.filter(result);
    }else{
      ctx.status = 404;
    }
  }
}

/**
 * Async utility function to get a user entry by userID.
 * @param {object} ctx - the Koa request/response context object
 */
async function getById(ctx) {
  const userID = ctx.params.id;
  const result = await model.getById(userID);
  if (result.length) {
    const data = result[0];
    const permission = can.read(ctx.state.user, data);
    if(!permission.granted){
      ctx.status = 403;
    }else{
      ctx.status = 200;
      ctx.body = permission.filter(data);
    }
  }else{
    ctx.status = 404;
  }
}

/**
 * Async utility function to register a new user.
 * @param {object} ctx - the Koa request/response context object
 */
async function registerUser(ctx) {
  const body = ctx.request.body;
  let username = await model.findByUsername(body.username);  /** Check if username exists in DB */ 
  let email = await model.findByEmail(body.email);  /** Check if email exists in DB */
  if(username.length == 0 && email.length == 0){ /** If username and/or email does not exist in DB */
    if(body.role){    
      if(body.role == info.config.adminCode){ /** Checks if admin codes match */
        ctx.request.body.role = 'admin'; /** Sets role to admin */
      }else{
        ctx.status = 409;
        ctx.body = {message: "Invalid admin code"};
        return; /** Exit */
      }
    }else { /** Prevents null values from being entered */
        ctx.request.body.role = 'user';
    }
    const result = await model.register(body);
    if (result.affectedRows) {
      const id = result.insertId;
      const jwt = issueJwt(id); /** Generate a jwt token for response body */
      ctx.status = 201;
      ctx.body = {ID: id, created: true, link: `${ctx.host}${prefix}/${id}`, username: body.username, role: ctx.request.body.role, token: jwt.token, expiresIn: jwt.expires};
    }
  }else{
    ctx.status = 409;
    if(username.length && email.length){
      ctx.body = {message: 'Username and Email already taken'};
    }else if(username.length){
      ctx.body = {message: 'Username already taken'};
    }else{
      ctx.body = {message: 'Email already taken'};
    }
  }
}

/**
 * Async utility function to login a user.
 * @param {object} ctx - the Koa request/response context object
 */
async function loginUser(ctx){
  if (ctx.state.user){
    const user = ctx.state.user;
    console.log(user.ID);
    const jwt = issueJwt(user.ID); /** Generate a jwt token for response body */
    const links = {
      self: `${ctx.protocol}://${ctx.host}${prefix}/${user.ID}`
    }
    ctx.status = 200;
    ctx.body = {ID: user.ID, loggedIn: true, links: links, username: user.username, role: user.role, token: jwt.token, expiresIn: jwt.expires};
  }else{
    ctx.status = 401;
    ctx.body = {message: "Incorrect username and/or password"};
  }
}

module.exports = router;