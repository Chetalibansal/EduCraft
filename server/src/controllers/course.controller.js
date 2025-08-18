import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Course } from "../models/course.model.js";
import {
  deleteMediaFromCloudinary,
  deleteVideoFromCloudinary,
  uploadMedia,
} from "../utils/cloudinary.js";
import { Lecture } from "../models/lecture.model.js";

export const createCourse = asyncHandler(async (req, res) => {
  const { courseTitle, category } = req.body;

  if (!courseTitle || !category)
    throw new ApiError(400, "Course title and category are required");

  const course = await Course.create({
    courseTitle,
    category,
    creator: req.id,
  });

  if (!course) throw new ApiError(500, "Course creation failed");

  return res.status(201).json(new ApiResponse(201, course, "Course created "));
});

export const getCreatorCourses = asyncHandler(async (req, res) => {
  const userId = req.id

  const courses = await Course.find({ creator: userId });
  if (!courses) throw new ApiError(404, "Course not found");

  return res.status(200).json({ courses, message: "Courses fetched" });
});

export const editCourse = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;
  const {
    courseTitle,
    subTitle,
    description,
    category,
    courseLevel,
    coursePrice,
  } = req.body;
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

export const getCourseByID = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;
  if (!courseId) throw new ApiError(400, "Course ID is required");

  const course = await Course.findById(courseId);

  if (!course) throw new ApiError(404, "Course not found");

  return res
    .status(200)
    .json(new ApiResponse(200, course, "Course fetched successfully"));
});

export const togglePublishCourse = asyncHandler(async(req,res) => {
  const {courseId} = req.params
  const {publish} = req.query   //true or false action
  const course = await Course.findById(courseId)

  if(!course) throw new ApiError(404, "Lecture Not found")

  // Publish status based on the query parameter
  course.isPublished = publish === "true"
  await course.save();

  const statusMessage = course.isPublished ? "Course published successfully" : "Course unpublished successfully";
  return res.status(200).json(new ApiResponse(200, course, statusMessage))
  
})

export const getPublishedCourses = asyncHandler(async(req, res)=>{
  const courses = await Course.find({isPublished:true}).populate(
    {path:"creator", select:"name photoUrl"}
  )
  if(!courses) throw new ApiError(404, "No published courses found");

  return res.status(200).json(new ApiResponse(200, courses, "Published courses fetched successfully"))
})

export const removeCourse = asyncHandler(async(req, res)=> {
  const {courseId} = req.params;
  const course = await Course.findById(courseId);
  if(!course) throw new ApiError(404, "Course not found");

  // Delete all lectures belonging to this course
  const lectures = await Lecture.find({_id: {$in: course.lectures}});

  for (const lec of lectures) {
    if (lec.publicId) {
      await deleteVideoFromCloudinary(lec.publicId);
    }
  }

  await Lecture.deleteMany({_id: {$in: course.lectures}})

  await Course.findByIdAndDelete(courseId);
  return res.status(200).json(new ApiResponse(200, null, "Course removed successfully"));
})

// Lecture controller logic

export const createLecture = asyncHandler(async (req, res) => {
  const { lectureTitle } = req.body;
  const courseId = req.params.courseId;

  if (!lectureTitle || !courseId)
    throw new ApiError(400, "Lecture title is required");

  const lecture = await Lecture.create({ lectureTitle,
    isPreviewFree: req.body.isPreviewFree ?? false,
   });

  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");
  course.lectures.push(lecture._id);
  await course.save();

  return res
    .status(201)
    .json(new ApiResponse(201, lecture, "lecture created successfully"));
});

export const getCourseLecture = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const course = await Course.findById(courseId).populate("lectures");

  if (!course) throw new ApiError(404, "Course not found");
  const lectures = course.lectures;
  return res
    .status(200)
    .json({ lectures, message: "Lectures fetched successfully" });
});

export const editLecture = asyncHandler(async (req, res) => {
  const { lectureTitle, videoInfo, isPreviewFree } = req.body;
  const { courseId, lectureId } = req.params;
  const lecture = await Lecture.findById(lectureId);
  if (!lecture) throw new ApiError(404, "Lecture not found");

  // update Lecture
  if (lectureTitle) lecture.lectureTitle = lectureTitle;
  if (videoInfo) {
    lecture.videoUrl = videoInfo.videoUrl ?? videoInfo.secure_url ?? null;
    lecture.publicId = videoInfo?.publicId ?? videoInfo.public_id ?? null;
  }
  if(isPreviewFree!==lecture.isPreviewFree) lecture.isPreviewFree = isPreviewFree

  await lecture.save();

  // Ensure the course still has the lecture id if it was not already added
  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");
  if (course && !course.lectures.includes(lecture._id)) {
    course.lectures.push(lecture._id);
    await course.save();
  }
  return res
    .status(200)
    .json(new ApiResponse(200, lecture, "Lecture updated successfully"));
});

export const removeLecture = asyncHandler(async (req, res) => {
  const { lectureId } = req.params;
  const lecture = await Lecture.findByIdAndDelete(lectureId);
  if (!lecture) throw new ApiError(404, "Lecture not found");

  // Delete lecture from cloudinary as well
  if (lecture.publicId) {
    await deleteVideoFromCloudinary(lecture.publicId);
  }

  // Remove the lecture reference from the associated course
  await Course.updateOne(
    { lectures: lectureId }, //find the course that has this lecture'
    { $pull: { lectures: lectureId } } //remove the lecture from the course's lectures array
  );

  return res.status(200).json({
    message: "Lecture removed successfully",
  });
});

export const getLectureById = asyncHandler(async (req, res) => {
  const { lectureId } = req.params;
  const lecture = await Lecture.findById(lectureId);
  if (!lecture) throw new ApiError(404, "Lecture not found");

  return res
    .status(200)
    .json(new ApiResponse(200, lecture, "Lecture fetched successfully"));
});


