import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const isAuthenticated = asyncHandler(async(req,res,next)=>{
    try{
        const token = req.cookies.token;

        if(!token) {
            throw new ApiError(401, "Unauthorized request")
        }

        const decode = jwt.verify(token, process.env.SECRET_KEY);

        if(!decode){
            throw new ApiError(401, "Invalid Token")
        }

        req.id = decode.userId;
        next();

    }catch(error){
        throw new ApiError(401, error?.message || "Invalid access Token")
    }
})

export default isAuthenticated