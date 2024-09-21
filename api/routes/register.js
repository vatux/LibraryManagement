const express = require('express');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Users = require("../db/models/Users");
const Enum = require("../config/Enum");
const config = require('../config');
const router = express.Router();

router.post('/', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await Users.findOne({ email });
        if (user) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "User already exists!");
        
        let cryptedPass = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

        user = new Users({ name, email, password: cryptedPass, role: "user" });
        await user.save();

        res.json(Response.successResponse({success: true}));
    } catch (err) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(Response.errorResponse(err));
    }
});

module.exports = router;