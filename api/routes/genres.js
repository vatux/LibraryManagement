const express = require("express");
const router = express.Router();
const Response = require("../lib/Response");
const CustomError = require("../lib/Error")
const Genres = require("../db/models/Genres");
const Enum = require("../config/Enum");
const auth = require("../lib/auth")();

/* router.all('/deneme', auth.authenticate(), (req, res, next) => {
  next();
}) */

router.get('/', async (req, res, next) => {

    try{
      let genres = await Genres.find({})
  
      res.json(Response.successResponse(genres));
    
    }catch(err){
  
      let errorResponse = Response.errorResponse(err);
      res.status(errorResponse.code).json(Response.errorResponse(err));
  
    }
  
    
});

router.post('/add', async (req, res) => {
    let body = req.body;
  
    try{
        if(!(body.name)) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "Title field must be filled");
        
        let genre = new Genres({
          name: body.name,
        });
  
        await genre.save();
  
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
  
      await Genres.updateOne({_id: body._id}, updates);
      
  
      res.json(Response.successResponse({success: true}));
  
    }catch(err){
      let errorResponse = Response.errorResponse(err);
      res.status(errorResponse.code).json(Response.errorResponse(err));
    }
});

router.post('/delete', async (req, res) => {
    let body = req.body;
  
    try{
      if(!(body._id)) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "_id field must be filled");
  
      await Genres.deleteOne({_id: body._id});
  
      res.json(Response.successResponse({success: true}));

    }catch(err){
      let errorResponse = Response.errorResponse(err);
      res.status(errorResponse.code).json(Response.errorResponse(err));
    }
});

module.exports = router;