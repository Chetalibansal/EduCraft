import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { createCourse } from '../controllers/course.controller.js';

const router = express.Router();

router.use(isAuthenticated)

router.post("/", createCourse)

export default router;