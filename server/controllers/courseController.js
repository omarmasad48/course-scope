import pool from '../config/db.js';

// Get all courses with department info and average ratings
export const getAllCourses = async (req, res) => {
  try {
    const courses = await pool.query(`
      SELECT
        c.id,
        c.course_number,
        c.course_name,
        c.description,
        c.credits,
        d.code as department_code,
        d.name as department_name,
        COUNT(r.id) as review_count,
        ROUND(AVG(r.rating), 1) as avg_rating,
        ROUND(AVG(r.difficulty), 1) as avg_difficulty
      FROM courses c
      JOIN departments d ON c.department_id = d.id
      LEFT JOIN reviews r ON c.id = r.course_id
      GROUP BY c.id, d.code, d.name
      ORDER BY d.code, c.course_number
    `);

    res.json({ courses: courses.rows });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get single course with all reviews
export const getCourseById = async (req, res) => {
  const { id } = req.params;

  try {
    // Get course details
    const course = await pool.query(`
      SELECT
        c.id,
        c.course_number,
        c.course_name,
        c.description,
        c.credits,
        d.code as department_code,
        d.name as department_name
      FROM courses c
      JOIN departments d ON c.department_id = d.id
      WHERE c.id = $1
    `, [id]);

    if (course.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Get reviews for this course
    const reviews = await pool.query(`
      SELECT
        r.id,
        r.professor_name,
        r.semester,
        r.year,
        r.rating,
        r.difficulty,
        r.would_take_again,
        r.review_text,
        r.created_at,
        r.helpful_count,
        u.first_name,
        u.last_name,
        u.profile_picture_url
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.course_id = $1
      ORDER BY r.helpful_count DESC, r.created_at DESC
    `, [id]);

    // Calculate statistics
    const stats = await pool.query(`
      SELECT
        COUNT(*) as review_count,
        ROUND(AVG(rating), 1) as avg_rating,
        ROUND(AVG(difficulty), 1) as avg_difficulty,
        ROUND(AVG(CASE WHEN would_take_again THEN 1 ELSE 0 END) * 100) as would_take_again_percent
      FROM reviews
      WHERE course_id = $1
    `, [id]);

    res.json({
      course: course.rows[0],
      reviews: reviews.rows,
      stats: stats.rows[0]
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all departments
export const getDepartments = async (req, res) => {
  try {
    const departments = await pool.query(`
      SELECT
        d.id,
        d.code,
        d.name,
        COUNT(c.id) as course_count
      FROM departments d
      LEFT JOIN courses c ON d.id = c.department_id
      GROUP BY d.id
      ORDER BY d.code
    `);

    res.json({ departments: departments.rows });
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Search courses
export const searchCourses = async (req, res) => {
  const { query, department } = req.query;

  try {
    let sqlQuery = `
      SELECT
        c.id,
        c.course_number,
        c.course_name,
        c.description,
        c.credits,
        d.code as department_code,
        d.name as department_name,
        COUNT(r.id) as review_count,
        ROUND(AVG(r.rating), 1) as avg_rating
      FROM courses c
      JOIN departments d ON c.department_id = d.id
      LEFT JOIN reviews r ON c.id = r.course_id
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (query) {
      sqlQuery += ` AND (c.course_name ILIKE $${paramIndex} OR c.description ILIKE $${paramIndex})`;
      params.push(`%${query}%`);
      paramIndex++;
    }

    if (department) {
      sqlQuery += ` AND d.code = $${paramIndex}`;
      params.push(department);
      paramIndex++;
    }

    sqlQuery += ` GROUP BY c.id, d.code, d.name ORDER BY d.code, c.course_number`;

    const courses = await pool.query(sqlQuery, params);

    res.json({ courses: courses.rows });
  } catch (error) {
    console.error('Search courses error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
