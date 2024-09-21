const express = require("express");
const router = express.Router();
const Response = require("../lib/Response");
const CustomError = require("../lib/Error")
const Authors = require("../db/models/Authors");
const Enum = require("../config/Enum");
const auth = require("../lib/auth")();

router.all('*', auth.authenticate(), auth.checkRole(['admin', 'librarian']), (req, res, next) => {
  next();
})

router.get('/', async (req, res, next) => {

    try{
      let authors = await Authors.find({})
  
      res.json(Response.successResponse(authors));
    
    }catch(err){
  
      let errorResponse = Response.errorResponse(err);
      res.status(errorResponse.code).json(Response.errorResponse(err));
  
    }
    
});

router.post('/add', async (req, res) => {
    let body = req.body;
  
    try{
        if(!(body.name)) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "Title field must be filled");
        else if(!(body.biography)) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "Author field must be filled");
        else if(!(body.birth_date)) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "Published year field must be filled");
          
        let author = new Authors({
          name: body.name,
          biography: body.biography,
          birth_date: body.birth_date,
        });
  
        await author.save();
  
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
      if(body.biography){
        updates.biography = body.biography;
      }
      if(body.birth_date){
        updates.birth_date = body.birth_date;
      }
  
      await Authors.updateOne({_id: body._id}, updates);
      
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
  
      await Authors.deleteOne({ _id });
  
      res.json(Response.successResponse({success: true}));

    }catch(err){
      let errorResponse = Response.errorResponse(err);
      res.status(errorResponse.code).json(Response.errorResponse(err));
    }
});

module.exports = router;