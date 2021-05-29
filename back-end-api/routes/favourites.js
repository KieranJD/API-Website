/**
 * This module will handle favourite route API calls.
 * @module routes/favourites
 * @author Kieran Dhir
 * @require models/* for the models that are required for this module
 */

const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const favModel = require('../models/favourites');
const dogModel = require('../models/dogs');
const verifyToken = require('../controllers/token');
const can = require('../permissions/favourites');

const prefix = '/users/:userid([0-9]{1,})/favourites';
const router = Router({prefix: prefix});

/** Routes */
router.get('/', verifyToken ,getAllByUserID);
router.post('/:id([0-9]{1,})', verifyToken, bodyParser(), addFav);
router.del('/:id([0-9]{1,})', verifyToken, deleteFav);

/**
 * Async utility function to get all a user's favourite dog entries.
 * @param {object} ctx - the Koa request/response context object
 */
async function getAllByUserID(ctx) {
  const userID = ctx.params.userid;
  let result = await favModel.getAll(userID);
  if (result.length) {
    const data = result[0];
    const permission = can.readAll(ctx.state.user, data);
    if(!permission.granted){
      ctx.status = 403;
    }else{
      result = permission.filter(result);
      let dogs = [];
      var i;
      for (i = 0; i < result.length; i++) {
        dogs.push(result[i].dogID);
      }
      result = await dogModel.getFavList(dogs);
      ctx.body = result;
    }
  }else{
    ctx.status = 404;
  }
}

/**
 * Async utility function to add a favourite dog entry for a user.
 * @param {object} ctx - the Koa request/response context object
 */
async function addFav(ctx) {
  const dogID = parseInt(ctx.params.id);
  const userID = parseInt(ctx.params.userid);
  const permission = can.add(ctx.state.user, userID);
  if(!permission.granted){
    ctx.status = 403;
  }else{
      let check = await dogModel.getById(dogID); /** Check dogID entry exists in DB */
      if(check.length){
      let result = await favModel.getById(userID, dogID); /** Check if dog entry dogID is already favourited */
      if(result.length == 0 ){
        const result = await favModel.add(userID, dogID);
        if (result.affectedRows) {
          ctx.status = 201;
          ctx.body = {ID: dogID, created: true, link: `${ctx.host}${ctx.request.path}`};
        }
      }else {
        console.log('already exists')
        ctx.status = 401;
      }
    }else{
      console.log('Dog does not exists')
      ctx.status = 404;
    }
  }
}

/**
 * Async utility function to delete a favourite dog entry for a user.
 * @param {object} ctx - the Koa request/response context object
 */
async function deleteFav(ctx){
  const dogID = parseInt(ctx.params.id);
  const userID = parseInt(ctx.params.userid);
  const permission = can.add(ctx.state.user, userID);
  if(!permission.granted){
    ctx.status = 403;
  }else{
    let result = await favModel.getById(userID, dogID) /** Check dogID entry exists in DB */
    if(result.length){
      result = await favModel.delById(userID, dogID);
      if (result.affectedRows) {
        ctx.status = 200;
        ctx.body = {ID: dogID, deleted: true}
      }
    }else {
      ctx.status = 404;
    }
  }
}

module.exports = router;