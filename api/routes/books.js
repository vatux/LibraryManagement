const express = require("express");
const router = express.Router();
const Response = require("../lib/Response");
const CustomError = require("../lib/Error")
const Books = require("../db/models/Books");
const Enum = require("../config/Enum");
const auth = require("../lib/auth")();

/* GET books listing. */
router.get('/', async (req, res, next) => {

    try{
      let books = await Books.find({})
  
      res.json(Response.successResponse(books));
    
    }catch(err){
  
      let errorResponse = Response.errorResponse(err);
      res.status(errorResponse.code).json(Response.errorResponse(err));
  
    }
  
    
});
  
  router.post('/add', auth.authenticate(), auth.checkRole(['admin', 'librarian']), async (req, res) => {
    let body = req.body;
  
    try{
        if(!(body.title)) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "Title field must be filled");
        else if(!(body.author)) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "Author field must be filled");
        else if(!(body.published_year)) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "Published year field must be filled");
        else if(!(body.genre)) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "Genre field must be filled");
        else if(!(body.isbn)) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "ISBN field must be filled");
        else if(!(body.quantity)) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "Quantity field must be filled");
        
        let book = new Books({
          title: body.title,
          author: body.author,
          published_year: body.published_year,
          genre: body.genre,
          isbn: body.isbn,
          quantity: body.quantity,
        });
  
        await book.save();
  
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
  
      if(body.title){
        updates.title = body.title;
      }
      if(body.author){
        updates.author = body.author;
      }
      if(body.published_year){
        updates.published_year = body.published_year;
      }
      if(body.genre){
        updates.genre = body.genre;
      }
      if(body.isbn){
        updates.isbn = body.isbn;
      }
      if(body.quantity){
        updates.quantity = body.quantity;
      }
  
      await Books.updateOne({_id: body._id}, updates);
      
  
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
  
      await Books.deleteOne({ _id });
  
      res.json(Response.successResponse({success: true}));

    }catch(err){
      let errorResponse = Response.errorResponse(err);
      res.status(errorResponse.code).json(Response.errorResponse(err));
    }
  });

module.exports = router;