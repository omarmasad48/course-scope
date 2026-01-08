import express from 'express';
import {
  getAllCourses,
  getCourseById,
  getDepartments,
  searchCourses
} from '../controllers/courseController.js';

const router = express.Router();

// Public routes
router.get('/', getAllCourses);
router.get('/search', searchCourses);
router.get('/departments', getDepartments);
router.get('/:id', getCourseById);

export default router;
