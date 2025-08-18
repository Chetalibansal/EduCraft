import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { createCourse, createLecture, editCourse, editLecture, getCourseByID, getCourseLecture, getCreatorCourses, getLectureById, getPublishedCourses, removeCourse, removeLecture, togglePublishCourse } from '../controllers/course.controller.js';
import upload from '../utils/multer.js'

const router = express.Router();

router.use(isAuthenticated)

router.post("/", createCourse)
router.get("/published-courses", getPublishedCourses)
router.get("/", getCreatorCourses)
router.put("/:courseId", upload.single("courseThumbnail") ,editCourse)
router.get("/:courseId", getCourseByID)
router.patch("/:courseId", togglePublishCourse)
router.delete("/course/:courseId", removeCourse)

router.post("/:courseId/lecture", createLecture)
router.get("/:courseId/lecture", getCourseLecture)
router.post("/:courseId/lecture/:lectureId", editLecture )
router.delete("/lecture/:lectureId", removeLecture )
router.get("/lecture/:lectureId", getLectureById)


export default router;