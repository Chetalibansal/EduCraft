import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError}from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { Course } from "../models/course.model.js"

export const createCourse = asyncHandler(async(requestAnimationFrame,res)=>{
    const {courseTitle, category} = req.body 

    if(!courseTitle || !category) throw new ApiError(400, "Course title and category are required")

    const course = await Course.create({
        courseTitle,
        category,
        creator:req.user._id
    })

    if(!course) throw new ApiError(500, "Course creation failed")

    return res.status(201).json(new ApiResponse(201, course, "Course created successfully"))
})