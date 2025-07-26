import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { createCourse, editCourse, getCourseByID, getCreatorCourses } from '../controllers/course.controller.js';
import upload from '../utils/multer.js'

const router = express.Router();

router.use(isAuthenticated)

router.post("/", createCourse)
router.get("/", getCreatorCourses)
router.put("/:courseId", upload.single("courseThumbnail") ,editCourse)
router.get("/:courseId", getCourseByID)

export default router;