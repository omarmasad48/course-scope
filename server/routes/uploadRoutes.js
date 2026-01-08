import express from 'express';
import { uploadProfilePicture, deleteProfilePicture } from '../controllers/uploadController.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// All upload routes require authentication
router.use(authenticateToken);

// Upload profile picture
router.post('/profile-picture', upload.single('profilePicture'), uploadProfilePicture);

// Delete profile picture
router.delete('/profile-picture', deleteProfilePicture);

export default router;
