import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {User} from "../models/user.model.js"
import { generateToken } from "../utils/generateToken.js";


const register = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body

    if([name,email,password].some((field)=>field?.trim() === ""))
    {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{email},{name}]
    })

    if(existedUser) {
        throw new ApiError(409, "User already exists with this username or email");
    }

   const user =  await User.create({
        name,
        email,
        password
    })

    if(!user) throw new ApiError(500, "User creation failed")

    return res
    .status(201)
    .json(new ApiResponse(200, user, "User registered successfully"))

});

const login = asyncHandler(async(req,res)=>{
    const {email, password} = req.body

    if(!email) throw new ApiError(400, "email is required")

    const user = await User.findOne({email});
    if(!user) throw new ApiError(404, "User does not exist")
    
    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid) throw new ApiError(401, "Invalid user credentials")

    generateToken(res, user, `Welcome back, ${user.name}`)
})

const logout = asyncHandler(async(_,res)=>{
    return res.status(200).cookie("token", "", {maxAge:0}).json(
        new ApiResponse(200, {}, "Logged out successfully")
    )
})

const getUserProfile = asyncHandler(async(req,res)=>{
    const userId = req.id;
    const user  =await User.findById(userId).select("-password");
    if(!user)
        throw new ApiError(404, "User not found");

    return res.status(200).json(new ApiResponse(200, user,"User profile fetched successfully"))

})

const updateProfile = asyncHandler(async(req,res)=>{
  const userId = req.id
  const {name} = req.body;
  const profilePhoto = req.file  

  const user = await User.findById(userId);

  if(!user){
    throw new ApiError(404, "User not found");
  }

  const updatedData = {name,photoUrl}

})

export { register, login,logout, getUserProfile };
