import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

router.use(isAuthenticated)

router.post("/", createCourse)

export default router;