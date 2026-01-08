import express from 'express';
import {
  createReview,
  updateReview,
  deleteReview,
  getUserReviews
} from '../controllers/reviewController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All review routes require authentication
router.use(authenticateToken);

router.post('/course/:courseId', createReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);
router.get('/my-reviews', getUserReviews);

export default router;
