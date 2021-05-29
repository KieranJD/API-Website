/**
 * This module will handle dog route API calls.
 * @module routes/dogs
 * @author Kieran Dhir
 * @see models/* for the models that are required for this module
 */

const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/dogs');
const verifyToken = require('../controllers/token');
const {validateDog} = require('../controllers/validation');
const can = require('../permissions/dogs'); 

const prefix = '/dogs';
const router = Router({prefix: prefix});

/** Routes */
router.get('/', getAll);
router.get('/search', search);
router.post('/upload', verifyToken, bodyParser(), validateDog, addDog);
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})', verifyToken, bodyParser(), validateDog, updateDog);
router.del('/:id([0-9]{1,})', verifyToken, deleteDog);

/**
 * Async utility function to get all dog entries.
 * @param {object} ctx - the Koa request/response context object
 */
async function getAll(ctx) {
  const result = await model.getAll();
  if (result.length) {
    ctx.status = 200;
    ctx.body = result;
  }else{
    ctx.status = 404;
  }
}

/**
 * Async utility function to get all dog entries matching a query.
 * @param {object} ctx - the Koa request/response context object
 * @param {function} next - text middleware
 * @returns {function} - the next middleware
 */
async function search(ctx, next) {
  let {q} = ctx.request.query;
  if (q && q.length < 3){
    ctx.status = 400;
    ctx.body = {message: "Search must be 3 or more characters"}
    return next();
  }
  let result = await model.search(q);
  if (result.length){
    ctx.status = 200;  
    ctx.body = result;
  }else{
    ctx.status = 404;
  }
}

/**
 * Async utility function to get a dog entry by dogID.
 * @param {object} ctx - the Koa request/response context object
 */
async function getById(ctx) {
  const dogID = ctx.params.id;
  const result = await model.getById(dogID);
  if (result.length) {
    const dog = result[0];
    ctx.status = 200;
    ctx.body = dog;
  }else{
    ctx.status = 404;
  }
}

/**
 * Async utility function to create a dog entry.
 * @param {object} ctx - the Koa request/response context object
 */
async function addDog(ctx) {
  const permission = can.add(ctx.state.user);
  if(!permission.granted){
    ctx.status = 403;
  }else{
    const body = ctx.request.body;
    const result = await model.add(body);
    if (result.affectedRows) {
      const dogID = result.insertId;
      ctx.status = 201;
      ctx.body = {ID: dogID, created: true, link: `${ctx.host}${ctx.request.path}/${dogID}`};
    }
  }
}

/**
 * Async utility function to update dog entry by dogID.
 * @param {object} ctx - the Koa request/response context object
 */
async function updateDog(ctx) {
  const dogID = ctx.params.id;
  let result = await model.getById(dogID); /** Check dogID entry exists in DB */
  if (result.length) {
    let data = result[0];
    const permission = can.update(ctx.state.user);
    if(!permission.granted){
      ctx.status = 403;
    }else{
      /** Exclude fields that should not be updated */
      const {ID, dateRegistered, ...body} = ctx.request.body;
      Object.assign(data, body); /** Overwrite updatable fields with body data */
      result = await model.update(data);
      if (result.affectedRows) {
        ctx.status = 200;
        ctx.body = {ID: dogID, updated: true, link: `${ctx.host}${ctx.request.path}`};
      }
    }
  }else{
    ctx.status = 404;
  }
}

/**
 * Async utility function to delete dog entry by dogID.
 * @param {object} ctx - the Koa request/response context object
 */
async function deleteDog(ctx) {
  const dogID = ctx.params.id;
  let result = await model.getById(dogID); /** Check dogID entry exists in DB */
  if (result.length) {
    const permission = can.delete(ctx.state.user);
    if(!permission.granted){
      ctx.status = 403;
    }else{
      const result = await model.delById(dogID);
      if (result.affectedRows) {
        ctx.status = 200;
        ctx.body = {ID: dogID, deleted: true}
      }
    }
  }else{
    ctx.status = 404;
  }
}

module.exports = router;
