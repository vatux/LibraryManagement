const passport = require("passport");
const { ExtractJwt, Strategy } = require("passport-jwt");

const config = require("../config");
const Users = require("../db/models/Users");
const CustomError = require("./Error");
const { HTTP_CODES } = require("../config/Enum");

module.exports = function(){
    let strategy = new Strategy({
        secretOrKey: config.JWT.SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }, async(payload, done) => {
        try{

            let user = await Users.findById(payload.id);
    
            if(user){
                done(null, {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    exp: Math.floor(Date.now() / 1000) + (60 * 60)
                });
            }
            else{
                console.log("User not found for id: ", payload._id);
                done(new Error("User not found"), null);
            }

        } catch(err){
            done(err, null);
        }
    });

    passport.use(strategy);

    return {
        initialize: function(){
            return passport.initialize();
        },
        authenticate: function(){
            return passport.authenticate("jwt", { session: false });
        },
        checkRole: (roles = []) => {
            return (req, res, next) => {
                // Check if the user is authenticated
                if(!req.user){
                    let response = Response.errorResponse(new CustomError(HTTP_CODES.UNAUTHORIZED), "Need Permission!");
                    return res.status(response.code),json(response);
                }
                // Check if the user has the required role
                if(roles.length && !roles.includes(req.user.role)){
                    console.log("User role:", req.user.role); // Debugging
                    console.log("Name: ", req.user.name);
                    console.log("Required roles:", roles); // Debugging
                    let response = Response.errorResponse(new CustomError(HTTP_CODES.FORBIDDEN), "FORBIDDEN");
                    return res.status(response.code),json(response);
                }

                next(); // Authorized and Permission not needed
            }
        }
    }
}