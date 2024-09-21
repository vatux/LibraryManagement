const BooksCopies = require("../db/models/BooksCopies");
const express = require("express");
const router = express.Router();
const Response = require("../lib/Response");
const CustomError = require("../lib/Error")
const Enum = require("../config/Enum");
const auth = require("../lib/auth")();

router.get('/', async (req, res, next) => {

    try{
      let bookscopies = await BooksCopies.find({}).populate('book_id', 'title');
  
      res.json(Response.successResponse(bookscopies));
    
    }catch(err){
  
      let errorResponse = Response.errorResponse(err);
      res.status(errorResponse.code).json(Response.errorResponse(err));
  
    }
  
});

router.post('/add', auth.authenticate(), auth.checkRole(['admin', 'librarian']), async (req, res) => {
  let body = req.body;

  try{
      if(!(body.book_id)) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "Title field must be filled");
      else if(!(body.copy_number)) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "Author field must be filled");
      else if(!(body.is_available)) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "Published year field must be filled");
      
      let bookscopies = new BooksCopies({
        book_id: body.book_id,
        copy_number: body.copy_number,
        is_available: body.is_available,
      });

      await bookscopies.save();

      res.json(Response.successResponse({success: true}));

  }catch(err){
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(Response.errorResponse(err));
  }
});

router.post('/update', auth.authenticate(), auth.checkRole(['admin', 'librarian']), async (req, res) => {
  let body = req.body;

  try{
    if(!(body._id)) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "_id field must be filled");

    let updates = {};

    if(body.book_id){
      updates.book_id = body.book_id;
    }
    if(body.copy_number){
      updates.copy_number = body.copy_number;
    }
    if(body.is_available){
      updates.is_available = body.is_available;
    }

    await BooksCopies.updateOne({_id: body._id}, updates);
    

    res.json(Response.successResponse({success: true}));

  }catch(err){
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(Response.errorResponse(err));
  }
});

router.post('/delete', auth.authenticate(), auth.checkRole(['admin', 'librarian']), async (req, res) => {
  const { _id } = req.body;

  try{
    if(!(_id)) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "_id field must be filled");

    await BooksCopies.deleteOne({_id});

    res.json(Response.successResponse({success: true}));

  }catch(err){
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(Response.errorResponse(err));
  }
});

module.exports = router;