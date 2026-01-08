import pool from '../config/db.js';

// Create a review
export const createReview = async (req, res) => {
  const { courseId } = req.params;
  const { professorName, semester, year, rating, difficulty, wouldTakeAgain, reviewText } = req.body;
  const userId = req.user.id;

  try {
    // Validate input
    if (!rating || !difficulty || !professorName || !semester || !year) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (rating < 1 || rating > 5 || difficulty < 1 || difficulty > 5) {
      return res.status(400).json({ error: 'Rating and difficulty must be between 1 and 5' });
    }

    // Check if course exists
    const course = await pool.query('SELECT * FROM courses WHERE id = $1', [courseId]);
    if (course.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if user already reviewed this course
    const existingReview = await pool.query(
      'SELECT * FROM reviews WHERE course_id = $1 AND user_id = $2',
      [courseId, userId]
    );

    if (existingReview.rows.length > 0) {
      return res.status(400).json({ error: 'You have already reviewed this course' });
    }

    // Insert review
    const newReview = await pool.query(
      `INSERT INTO reviews
       (course_id, user_id, professor_name, semester, year, rating, difficulty, would_take_again, review_text)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [courseId, userId, professorName, semester, year, rating, difficulty, wouldTakeAgain, reviewText]
    );

    res.status(201).json({
      message: 'Review created successfully',
      review: newReview.rows[0]
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update a review
export const updateReview = async (req, res) => {
  const { id } = req.params;
  const { professorName, semester, year, rating, difficulty, wouldTakeAgain, reviewText } = req.body;
  const userId = req.user.id;

  try {
    // Check if review exists and belongs to user
    const review = await pool.query(
      'SELECT * FROM reviews WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (review.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found or unauthorized' });
    }

    // Validate ratings if provided
    if ((rating && (rating < 1 || rating > 5)) || (difficulty && (difficulty < 1 || difficulty > 5))) {
      return res.status(400).json({ error: 'Rating and difficulty must be between 1 and 5' });
    }

    // Update review
    const updatedReview = await pool.query(
      `UPDATE reviews
       SET professor_name = COALESCE($1, professor_name),
           semester = COALESCE($2, semester),
           year = COALESCE($3, year),
           rating = COALESCE($4, rating),
           difficulty = COALESCE($5, difficulty),
           would_take_again = COALESCE($6, would_take_again),
           review_text = COALESCE($7, review_text),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [professorName, semester, year, rating, difficulty, wouldTakeAgain, reviewText, id]
    );

    res.json({
      message: 'Review updated successfully',
      review: updatedReview.rows[0]
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // Check if review exists and belongs to user
    const review = await pool.query(
      'SELECT * FROM reviews WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (review.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found or unauthorized' });
    }

    // Delete review
    await pool.query('DELETE FROM reviews WHERE id = $1', [id]);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user's reviews
export const getUserReviews = async (req, res) => {
  const userId = req.user.id;

  try {
    const reviews = await pool.query(
      `SELECT
        r.*,
        c.course_name,
        c.course_number,
        d.code as department_code
       FROM reviews r
       JOIN courses c ON r.course_id = c.id
       JOIN departments d ON c.department_id = d.id
       WHERE r.user_id = $1
       ORDER BY r.created_at DESC`,
      [userId]
    );

    res.json({ reviews: reviews.rows });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
