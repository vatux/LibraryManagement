var express = require('express');
var router = express.Router();
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Users = require("../db/models/Users");
const bcrypt = require('bcrypt-nodejs');
const Enum = require("../config/Enum");
const auth = require("../lib/auth")();

router.all('*', auth.authenticate(), auth.checkRole(['admin']), (req, res, next) => {
  next();
})

router.get('/', async (req, res, next) => {

  try{
    let users = await Users.find({})

    res.json(Response.successResponse(users));
  
  }catch(err){

    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(Response.errorResponse(err));

  }

  
});

router.post('/add', async (req, res) => {
  let body = req.body;

  try{
      if(!(body.name)) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "Name field must be filled");
      else if(!(body.email)) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "Email field must be filled");
      else if(!(body.password)) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "Password field must be filled");
      else if(!(body.role)) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "Role field must be filled");

      let password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(8), null);

      let user = new Users({
        name: body.name,
        email: body.email,
        password,
        role: body.role
      });

      await user.save();

      res.json(Response.successResponse({success: true}));

  }catch(err){
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(Response.errorResponse(err));
  }
});

router.post('/update', async (req, res) => {
  let body = req.body;

  try{
    if(!(body._id)) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "_id field must be filled");

    let updates = {};

    if(body.name){
      updates.name = body.name;
    }
    if(body.email){
      updates.email = body.email;
    }
    if(body.password){
      updates.password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(8), null);
    }
    if(body.role){
      updates.role = body.role;
    }

    await Users.updateOne({_id: body._id}, updates);
    

    res.json(Response.successResponse({success: true}));

  }catch(err){
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(Response.errorResponse(err));
  }
});

router.post('/delete', async (req, res) => {
  
  const { _id } = req.body;

  try{
    if(!(_id)) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "_id field must be filled");

    await Users.deleteOne({ _id });

    res.json(Response.successResponse({success: true}));

  }catch(err){
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(Response.errorResponse(err));
  }
});

module.exports = router;
