import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI } from '../services/api';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [coursesData, deptsData] = await Promise.all([
        courseAPI.getAllCourses(),
        courseAPI.getDepartments()
      ]);
      setCourses(coursesData.courses || []);
      setDepartments(deptsData.departments || []);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await courseAPI.searchCourses(searchQuery, selectedDept);
      setCourses(data.courses || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedDept('');
    loadData();
  };

  if (loading && courses.length === 0) {
    return <div style={styles.loading}>Loading courses...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Browse Courses</h1>

      <div style={styles.searchBox}>
        <input
          type="text"
          placeholder="Search by course name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          style={styles.select}
        >
          <option value="">All Departments</option>
          {departments.map(dept => (
            <option key={dept.id} value={dept.code}>
              {dept.code} - {dept.name}
            </option>
          ))}
        </select>

        <button onClick={handleSearch} style={styles.searchButton}>
          Search
        </button>
        <button onClick={handleReset} style={styles.resetButton}>
          Reset
        </button>
      </div>

      <div style={styles.results}>
        <p style={styles.count}>{courses.length} courses found</p>
      </div>

      <div style={styles.grid}>
        {courses.map(course => (
          <Link
            key={course.id}
            to={`/course/${course.id}`}
            style={styles.card}
          >
            <div style={styles.cardHeader}>
              <span style={styles.badge}>{course.department_code} {course.course_number}</span>
              {course.avg_rating && (
                <span style={styles.rating}>
                  ⭐ {course.avg_rating}
                </span>
              )}
            </div>

            <h3 style={styles.courseName}>{course.course_name}</h3>
            <p style={styles.description}>{course.description}</p>

            <div style={styles.cardFooter}>
              <span style={styles.credits}>{course.credits} credits</span>
              <span style={styles.reviews}>
                {course.review_count} {course.review_count === '1' ? 'review' : 'reviews'}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {courses.length === 0 && !loading && (
        <div style={styles.empty}>
          <p>No courses found. Try a different search.</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '2rem'
  },
  searchBox: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap'
  },
  searchInput: {
    flex: 1,
    minWidth: '250px',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '1rem'
  },
  select: {
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    minWidth: '200px'
  },
  searchButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.375rem',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer'
  },
  resetButton: {
    backgroundColor: '#6b7280',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.375rem',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer'
  },
  results: {
    marginBottom: '1rem'
  },
  count: {
    color: '#64748b',
    fontSize: '0.9rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '1.5rem'
  },
  card: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    display: 'block'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem'
  },
  badge: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    padding: '0.25rem 0.75rem',
    borderRadius: '0.25rem',
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  rating: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#1e293b'
  },
  courseName: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '0.5rem'
  },
  description: {
    color: '#64748b',
    fontSize: '0.9rem',
    lineHeight: '1.5',
    marginBottom: '1rem'
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    color: '#64748b'
  },
  credits: {},
  reviews: {},
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.1rem',
    color: '#64748b'
  },
  empty: {
    textAlign: 'center',
    padding: '3rem',
    color: '#64748b'
  }
};

export default Courses;
