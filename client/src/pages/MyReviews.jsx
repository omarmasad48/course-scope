import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { reviewAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadReviews();
    }
  }, [user]);

  const loadReviews = async () => {
    try {
      const data = await reviewAPI.getUserReviews();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await reviewAPI.deleteReview(reviewId);
      setReviews(reviews.filter(r => r.id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    }
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return <div style={styles.loading}>Loading your reviews...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Reviews</h1>

      {reviews.length === 0 ? (
        <div style={styles.empty}>
          <p>You haven't written any reviews yet.</p>
          <Link to="/courses" style={styles.browsLink}>
            Browse courses to get started
          </Link>
        </div>
      ) : (
        <div style={styles.reviewsList}>
          {reviews.map(review => (
            <div key={review.id} style={styles.reviewCard}>
              <div style={styles.cardHeader}>
                <div>
                  <Link
                    to={`/course/${review.course_id}`}
                    style={styles.courseLink}
                  >
                    <span style={styles.courseBadge}>
                      {review.department_code} {review.course_number}
                    </span>
                    <h3 style={styles.courseName}>{review.course_name}</h3>
                  </Link>
                  <div style={styles.meta}>
                    Professor {review.professor_name} • {review.semester} {review.year}
                  </div>
                </div>
                <div style={styles.rating}>⭐ {review.rating}/5</div>
              </div>

              {review.review_text && (
                <p style={styles.reviewText}>{review.review_text}</p>
              )}

              <div style={styles.stats}>
                <span style={styles.stat}>Difficulty: {review.difficulty}/5</span>
                <span style={styles.stat}>
                  Would take again: {review.would_take_again ? 'Yes' : 'No'}
                </span>
              </div>

              <div style={styles.cardFooter}>
                <span style={styles.date}>
                  Posted: {new Date(review.created_at).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleDelete(review.id)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem 1rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '2rem'
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.1rem',
    color: '#64748b'
  },
  empty: {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  browseLink: {
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: '500',
    marginTop: '1rem',
    display: 'inline-block'
  },
  reviewsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  reviewCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem'
  },
  courseLink: {
    textDecoration: 'none',
    color: 'inherit'
  },
  courseBadge: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    padding: '0.25rem 0.75rem',
    borderRadius: '0.25rem',
    fontSize: '0.85rem',
    fontWeight: '600',
    marginRight: '0.5rem'
  },
  courseName: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: '0.5rem',
    marginBottom: '0.5rem'
  },
  meta: {
    fontSize: '0.85rem',
    color: '#64748b',
    marginTop: '0.25rem'
  },
  rating: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#1e293b'
  },
  reviewText: {
    color: '#374151',
    lineHeight: '1.6',
    marginBottom: '1rem'
  },
  stats: {
    display: 'flex',
    gap: '1.5rem',
    fontSize: '0.85rem',
    color: '#64748b',
    marginBottom: '1rem'
  },
  stat: {},
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '1rem',
    borderTop: '1px solid #e5e7eb'
  },
  date: {
    fontSize: '0.85rem',
    color: '#64748b'
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    border: 'none',
    fontSize: '0.85rem',
    fontWeight: '500',
    cursor: 'pointer'
  }
};

export default MyReviews;
