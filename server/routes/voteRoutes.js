import express from 'express';
import { toggleHelpfulVote, getUserVotesForCourse } from '../controllers/voteController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All vote routes require authentication
router.use(authenticateToken);

router.post('/review/:reviewId/toggle', toggleHelpfulVote);
router.get('/course/:courseId/user-votes', getUserVotesForCourse);

export default router;
