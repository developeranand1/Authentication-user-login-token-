const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const JWT_KEY = "hsdfkj";

const validateToken = asyncHandler(async(req, res, next) => {
    let token ;

    let authHeader = req.headers.Authorization || req.headers.authorization;

    if(authHeader && authHeader.startsWith("Bearer")){
        token=authHeader.split(" ")[1];
        jwt.verify(token, JWT_KEY, (err, decoded) => {
            if(err){
                res.status(401);
                throw new Error("User is not authorized!")
            }
            // console.log(decoded);
            req.datas=decoded.datas;

            next();
        });

        if(!token){
            res.status(401);

            throw new Error("User is not authorized or token is missing!")
        }
    }


});


module.exports=validateToken;