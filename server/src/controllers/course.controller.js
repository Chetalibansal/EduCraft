import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Course } from "../models/course.model.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

export const createCourse = asyncHandler(async (req, res) => {
  const { courseTitle, category } = req.body;

  if (!courseTitle || !category)
    throw new ApiError(400, "Course title and category are required");

  const course = await Course.create({
    courseTitle,
    category,
    creator: req.user?._id,
  });

  if (!course) throw new ApiError(500, "Course creation failed");

  return res.status(201).json(new ApiResponse(201, course, "Course created "));
});

export const getCreatorCourses = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const courses = await Course.find({ creator: userId });
  if (!courses) throw new ApiError(404, "Course not found");

  return res.status(200).json({ courses, message: "Courses fetched" });
});

export const editCourse = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;
  const { courseTitle, subTitle, description, category, courseLevel, coursePrice } =
    req.body;
  const thumbnail = req.file?.path;

  let course = await Course.findById(courseId);

  if (!course) throw new ApiError(404, "Course not found");

  let courseThumbnail;
  if (thumbnail) {
    if (course.courseThumbnail) {
      const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
      console.log(publicId);
      await deleteMediaFromCloudinary(publicId);
    }
    courseThumbnail = await uploadMedia(thumbnail);
  }

  const updateData = {
    courseTitle,
    subTitle,
    description,
    category,
    courseLevel,
    coursePrice,
    courseThumbnail: courseThumbnail?.secure_url,
  };

  course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });
  if (!course) throw new ApiError(500, "Course update failed");

  return res
    .status(200)
    .json(new ApiResponse(200, course, "Course updated successfully"));
});

export const getCourseByID = asyncHandler(async(req,res)=> {
  const courseId = req.params.courseId;
  if(!courseId) throw new ApiError(400, "Course ID is required");

  const course =await Course.findById(courseId)

  if(!course) throw new ApiError(404, "Course not found");

  return res.status(200).json(new ApiResponse(200, course, "Course fetched successfully"));

})
