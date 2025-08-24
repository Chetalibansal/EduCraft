import { Course } from "../models/course.model.js";
import { CourseProgress } from "../models/courseProgress.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getCourseProgress = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.id;

  // fetch the user course progress
  let courseProgress = await CourseProgress.findOne({
    courseId,
    userId,
  }).populate("courseId");

  const courseDetails = await Course.findById(courseId).populate("lectures");

  if (!courseDetails) throw new ApiError(404, "Course not found");

  // If no progress found, return course details with an empty progress
  if (!courseProgress)
    return res.status(200).json({
      data: {
        courseDetails,
        progress: [],
        completed: false,
      },
    });

  // return user course progress along with courseDetails
  return res.status(200).json({
    data: {
      courseDetails,
      progress: courseProgress.lectureProgress,
      completed: courseProgress.completed,
    },
  });
});

export const updateLectureProgress = asyncHandler(async (req, res) => {
  const { courseId, lectureId } = req.params;
  const userId = req.id;

  // fetch or create course progress
  let courseProgress = await CourseProgress.findOne({ courseId, userId });

  if (!courseProgress) {
    // If no progress exist, create a new record
    courseProgress = new CourseProgress({
      userId,
      courseId,
      completed: false,
      lectureProgress: [],
    });
  }

  // find lecture progress in courseProgress
  const lectureIndex = courseProgress.lectureProgress.findIndex(
    (lecture) => lecture.lectureId === lectureId
  );

  if (lectureIndex !== -1) {
    // update status o lecture if it already exists
    courseProgress.lectureProgress[lectureIndex].viewed = true;
  } else {
    // Add new lecture Progress
    courseProgress.lectureProgress.push({
      lectureId,
      viewed: true,
    });
  }

  //   if all lecture is completed
  const lectureProgressLength = courseProgress.lectureProgress.filter(
    (lectureProg) => lectureProg.viewed
  ).length;

  const course = await Course.findById(courseId);
  if (lectureProgressLength === course.lectures.length)
    courseProgress.completed = true;

  
  courseProgress.markModified("lectureProgress");
  await courseProgress.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Lecture progress updated successfully"));
});

export const markAsCompleted = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.id;

  const courseProgress = await CourseProgress.findOne({ courseId, userId });
  if (!courseProgress)
    return res.status(404).json({ message: "Course progress not found" });

  courseProgress.lectureProgress.forEach(
    (lectureProgress) => (lectureProgress.viewed = true)
  );
  courseProgress.completed = true;
  await courseProgress.save();

  return res.status(200).json({ message: "Course marked as completed" });
});

export const markAsInComplete = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.id;

  const courseProgress = await CourseProgress.findOne({ courseId, userId });
  if (!courseProgress)
    return res.status(404).json({ message: "Course progress not found" });

  courseProgress.lectureProgress.forEach(
    (lectureProgress) => (lectureProgress.viewed = false)
  );
  courseProgress.completed = false;
  courseProgress.markModified("lectureProgress");
  await courseProgress.save();

  return res.status(200).json({ message: "Course marked as Incomplete" });
});
