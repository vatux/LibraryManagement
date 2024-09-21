const express = require("express");
const router = express.Router();
const Response = require("../lib/Response");
const CustomError = require("../lib/Error")
const Loans = require("../db/models/Loans");
const Enum = require("../config/Enum");
const BooksCopies = require("../db/models/BooksCopies");
const Books = require("../db/models/Books");

router.get('/', async (req, res, next) => {

    try{
      let loans = await Loans.find({}).populate('book_id', 'title');
  
      res.json(Response.successResponse(loans));
    
    }catch(err){
  
      let errorResponse = Response.errorResponse(err);
      res.status(errorResponse.code).json(Response.errorResponse(err));
  
    }
  
    
});

router.post('/add', async (req, res) => {
    let body = req.body;
  
    try{
        if(!(body.user_id)) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "User Id field must be filled");
        else if(!(body.book_id)) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "Book Id field must be filled");
        else if(!(body.loan_date)) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "Loan Date field must be filled");
        else if(!(body.return_date)) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "Return Date field must be filled");
        
        const book = await Books.findById(body.book_id);
        if (!book) throw new CustomError(Enum.HTTP_CODES.NOT_FOUND, "Book not found");

        // Check available copy in bookcopies
        const availableCopy = await BooksCopies.findOne({ book_id: body.book_id, is_available: true });
        if (!availableCopy) {
            throw new CustomError(Enum.HTTP_CODES.NOT_FOUND, "No available copies for this book");
        }

        // Check book quantity
        if (book.quantity <= 0) {
          throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "No more books available for borrowing");
        }
        book.quantity -= 1;
        await book.save();

        // Copy borrowed
        availableCopy.is_available = false;
        await availableCopy.save();

        let loan = new Loans({
          user_id: body.user_id,
          book_id: body.book_id,
          loan_date: new Date(),
          return_date: body.return_date,
          returned_at: body.returned_at,
          status: body.status
        });
  
        await loan.save();
  
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
  
      if(body.user_id){
        updates.user_id = body.user_id;
      }
      if(body.loan_date){
        updates.loan_date = body.loan_date;
      }
      if(body.return_date){
        updates.return_date = body.return_date;
      }
      if(body.returned_at){
        updates.returned_at = body.returned_at;
      }
      if(body.status){
        updates.status = body.status;
      }
  
      await Loans.updateOne({_id: body._id}, updates);
      
  
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
  
      await Loans.deleteOne({ _id });
  
      res.json(Response.successResponse({success: true}));

    }catch(err){
      let errorResponse = Response.errorResponse(err);
      res.status(errorResponse.code).json(Response.errorResponse(err));
    }
});

module.exports = router;