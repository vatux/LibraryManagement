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
    const { email, password } = req.body;
    try {
        const user = await Users.findOne({ email });
        if (!user) throw new CustomError(Enum.HTTP_CODES.UNAUTHORIZED, "Invalid credentials!");
        
        const passFlag = bcrypt.compareSync(password, user.password);
        
        if (!passFlag) throw new CustomError(Enum.HTTP_CODES.UNAUTHORIZED, "Wrong password!");

        let payload = {
            id: user._id.toString(),
            exp: parseInt(Date.now() / 1000 ) * config.JWT.EXPIRE_TIME
        }
        
        const token = jwt.encode(payload, config.JWT.SECRET);

        let userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
        res.json(Response.successResponse({user: userData, token}));
    } catch (err) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(Response.errorResponse(err));
    }
});

module.exports = router;