import pool from '../config/db.js';

// Toggle helpful vote on a review
export const toggleHelpfulVote = async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user.id;

  try {
    // Check if vote already exists
    const existingVote = await pool.query(
      'SELECT * FROM review_votes WHERE review_id = $1 AND user_id = $2',
      [reviewId, userId]
    );

    if (existingVote.rows.length > 0) {
      // Remove vote
      await pool.query(
        'DELETE FROM review_votes WHERE review_id = $1 AND user_id = $2',
        [reviewId, userId]
      );

      // Decrement helpful_count
      await pool.query(
        'UPDATE reviews SET helpful_count = GREATEST(helpful_count - 1, 0) WHERE id = $1',
        [reviewId]
      );

      res.json({ message: 'Vote removed', voted: false });
    } else {
      // Add vote
      await pool.query(
        'INSERT INTO review_votes (review_id, user_id) VALUES ($1, $2)',
        [reviewId, userId]
      );

      // Increment helpful_count
      await pool.query(
        'UPDATE reviews SET helpful_count = helpful_count + 1 WHERE id = $1',
        [reviewId]
      );

      res.json({ message: 'Vote added', voted: true });
    }
  } catch (error) {
    console.error('Toggle vote error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user's votes for a course's reviews
export const getUserVotesForCourse = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  try {
    const votes = await pool.query(
      `SELECT rv.review_id
       FROM review_votes rv
       JOIN reviews r ON rv.review_id = r.id
       WHERE r.course_id = $1 AND rv.user_id = $2`,
      [courseId, userId]
    );

    const reviewIds = votes.rows.map(v => v.review_id);
    res.json({ votedReviewIds: reviewIds });
  } catch (error) {
    console.error('Get user votes error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
