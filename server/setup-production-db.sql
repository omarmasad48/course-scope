-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  profile_picture_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments table
CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL
);

-- Courses table
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
  course_number VARCHAR(20) NOT NULL,
  course_name VARCHAR(255) NOT NULL,
  description TEXT,
  credits INTEGER DEFAULT 3,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(department_id, course_number)
);

-- Reviews table
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  professor_name VARCHAR(100),
  semester VARCHAR(20),
  year INTEGER,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  difficulty INTEGER CHECK (difficulty >= 1 AND difficulty <= 5),
  would_take_again BOOLEAN,
  review_text TEXT,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(course_id, user_id)
);

-- Review votes table
CREATE TABLE review_votes (
  id SERIAL PRIMARY KEY,
  review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(review_id, user_id)
);

-- Indexes
CREATE INDEX idx_courses_department ON courses(department_id);
CREATE INDEX idx_reviews_course ON reviews(course_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_review_votes_review ON review_votes(review_id);
CREATE INDEX idx_review_votes_user ON review_votes(user_id);

-- Sample data
INSERT INTO departments (code, name) VALUES
  ('CS', 'Computer Science'),
  ('MATH', 'Mathematics'),
  ('ENGL', 'English'),
  ('HIST', 'History'),
  ('BIOL', 'Biology'),
  ('CHEM', 'Chemistry'),
  ('PHYS', 'Physics'),
  ('PSYC', 'Psychology');

INSERT INTO courses (department_id, course_number, course_name, description, credits) VALUES
  (1, '101', 'Introduction to Computer Science', 'Fundamentals of programming and problem solving', 3),
  (1, '150', 'Data Structures and Algorithms', 'Study of data structures, algorithms, and their applications', 4),
  (1, '200', 'Web Development', 'Modern web development using HTML, CSS, and JavaScript', 3),
  (1, '250', 'Database Systems', 'Design and implementation of database systems', 3),
  (2, '101', 'College Algebra', 'Algebraic concepts and problem solving', 3),
  (2, '150', 'Calculus I', 'Introduction to differential calculus', 4),
  (3, '101', 'English Composition', 'Writing and critical thinking skills', 3),
  (4, '101', 'US History I', 'American history from colonial times to Civil War', 3);
