import pool from '../config/db.js';

export const uploadProfilePicture = async (req, res) => {
  const userId = req.user.id;

  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = req.file.path; // Cloudinary URL

    // Update user's profile picture URL in database
    const result = await pool.query(
      'UPDATE users SET profile_picture_url = $1 WHERE id = $2 RETURNING id, email, first_name, last_name, profile_picture_url',
      [imageUrl, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Profile picture uploaded successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload profile picture' });
  }
};

export const deleteProfilePicture = async (req, res) => {
  const userId = req.user.id;

  try {
    // Remove profile picture URL from database
    const result = await pool.query(
      'UPDATE users SET profile_picture_url = NULL WHERE id = $1 RETURNING id, email, first_name, last_name, profile_picture_url',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Profile picture removed successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Delete profile picture error:', error);
    res.status(500).json({ error: 'Failed to remove profile picture' });
  }
};
