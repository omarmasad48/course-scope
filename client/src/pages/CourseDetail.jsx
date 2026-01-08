import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseAPI, reviewAPI, voteAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userVotes, setUserVotes] = useState([]);
  const [reviewForm, setReviewForm] = useState({
    professorName: '',
    semester: '',
    year: new Date().getFullYear(),
    rating: 5,
    difficulty: 3,
    wouldTakeAgain: true,
    reviewText: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCourse();
    if (user) {
      loadUserVotes();
    }
  }, [id, user]);

  const loadCourse = async () => {
    try {
      const result = await courseAPI.getCourseById(id);
      setData(result);
    } catch (error) {
      console.error('Error loading course:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserVotes = async () => {
    try {
      const result = await voteAPI.getUserVotesForCourse(id);
      setUserVotes(result.votedReviewIds || []);
    } catch (error) {
      console.error('Error loading votes:', error);
    }
  };

  const handleVote = async (reviewId) => {
    if (!user) return;

    try {
      const result = await voteAPI.toggleHelpfulVote(reviewId);

      // Update local votes state
      if (result.voted) {
        setUserVotes([...userVotes, reviewId]);
      } else {
        setUserVotes(userVotes.filter(id => id !== reviewId));
      }

      // Update review count in data
      setData(prevData => ({
        ...prevData,
        reviews: prevData.reviews.map(review =>
          review.id === reviewId
            ? { ...review, helpful_count: review.helpful_count + (result.voted ? 1 : -1) }
            : review
        )
      }));
    } catch (error) {
      console.error('Error toggling vote:', error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const result = await reviewAPI.createReview(id, reviewForm);
      if (result.review) {
        setShowReviewForm(false);
        setReviewForm({
          professorName: '',
          semester: '',
          year: new Date().getFullYear(),
          rating: 5,
          difficulty: 3,
          wouldTakeAgain: true,
          reviewText: ''
        });
        loadCourse();
      } else {
        setError(result.error || 'Failed to submit review');
      }
    } catch (err) {
      setError('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (!data || !data.course) {
    return <div style={styles.error}>Course not found</div>;
  }

  const { course, reviews, stats } = data;
  const hasReviewed = user && reviews?.some(r => r.first_name === user.first_name && r.last_name === user.last_name);

  return (
    <div style={styles.container}>
      <Link to="/courses" style={styles.backLink}>← Back to Courses</Link>

      <div style={styles.header}>
        <div>
          <span style={styles.badge}>
            {course.department_code} {course.course_number}
          </span>
          <h1 style={styles.title}>{course.course_name}</h1>
          <p style={styles.description}>{course.description}</p>
          <p style={styles.credits}>{course.credits} credits</p>
        </div>

        {stats && stats.review_count > 0 && (
          <div style={styles.statsBox}>
            <div style={styles.statItem}>
              <div style={styles.statValue}>⭐ {stats.avg_rating}</div>
              <div style={styles.statLabel}>Average Rating</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statValue}>{stats.avg_difficulty}/5</div>
              <div style={styles.statLabel}>Difficulty</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statValue}>{stats.would_take_again_percent}%</div>
              <div style={styles.statLabel}>Would Take Again</div>
            </div>
          </div>
        )}
      </div>

      <div style={styles.reviewsSection}>
        <div style={styles.reviewsHeader}>
          <h2 style={styles.sectionTitle}>
            Student Reviews ({reviews?.length || 0})
          </h2>
          {user && !hasReviewed && !showReviewForm && (
            <button
              onClick={() => setShowReviewForm(true)}
              style={styles.addButton}
            >
              Write a Review
            </button>
          )}
        </div>

        {!user && (
          <div style={styles.loginPrompt}>
            <Link to="/login" style={styles.loginLink}>Login</Link> to write a review
          </div>
        )}

        {hasReviewed && (
          <div style={styles.notice}>
            You have already reviewed this course
          </div>
        )}

        {showReviewForm && (
          <form onSubmit={handleReviewSubmit} style={styles.reviewForm}>
            <h3 style={styles.formTitle}>Write Your Review</h3>

            {error && <div style={styles.formError}>{error}</div>}

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Professor Name *</label>
                <input
                  type="text"
                  required
                  value={reviewForm.professorName}
                  onChange={(e) => setReviewForm({ ...reviewForm, professorName: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Semester *</label>
                <select
                  required
                  value={reviewForm.semester}
                  onChange={(e) => setReviewForm({ ...reviewForm, semester: e.target.value })}
                  style={styles.input}
                >
                  <option value="">Select...</option>
                  <option value="Fall">Fall</option>
                  <option value="Spring">Spring</option>
                  <option value="Summer">Summer</option>
                  <option value="Winter">Winter</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Year *</label>
                <input
                  type="number"
                  required
                  min="2020"
                  max="2030"
                  value={reviewForm.year}
                  onChange={(e) => setReviewForm({ ...reviewForm, year: parseInt(e.target.value) })}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Rating (1-5) *</label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
                  style={styles.input}
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Good</option>
                  <option value="3">3 - Average</option>
                  <option value="2">2 - Below Average</option>
                  <option value="1">1 - Poor</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Difficulty (1-5) *</label>
                <select
                  value={reviewForm.difficulty}
                  onChange={(e) => setReviewForm({ ...reviewForm, difficulty: parseInt(e.target.value) })}
                  style={styles.input}
                >
                  <option value="1">1 - Very Easy</option>
                  <option value="2">2 - Easy</option>
                  <option value="3">3 - Moderate</option>
                  <option value="4">4 - Hard</option>
                  <option value="5">5 - Very Hard</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Would Take Again? *</label>
                <select
                  value={reviewForm.wouldTakeAgain}
                  onChange={(e) => setReviewForm({ ...reviewForm, wouldTakeAgain: e.target.value === 'true' })}
                  style={styles.input}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Your Review</label>
              <textarea
                rows="4"
                value={reviewForm.reviewText}
                onChange={(e) => setReviewForm({ ...reviewForm, reviewText: e.target.value })}
                style={styles.textarea}
                placeholder="Share your experience with this course..."
              />
            </div>

            <div style={styles.formButtons}>
              <button type="submit" disabled={submitting} style={styles.submitButton}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                style={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div style={styles.reviewsList}>
          {reviews && reviews.length > 0 ? (
            reviews.map(review => (
              <div key={review.id} style={styles.reviewCard}>
                <div style={styles.reviewHeader}>
                  <div style={styles.reviewAuthorSection}>
                    {review.profile_picture_url ? (
                      <img
                        src={review.profile_picture_url}
                        alt={`${review.first_name} ${review.last_name}`}
                        style={styles.reviewAvatar}
                      />
                    ) : (
                      <div style={styles.reviewAvatarPlaceholder}>
                        {review.first_name[0]}{review.last_name[0]}
                      </div>
                    )}
                    <div>
                      <div style={styles.reviewAuthor}>
                        {review.first_name} {review.last_name}
                      </div>
                      <div style={styles.reviewMeta}>
                        Professor {review.professor_name} • {review.semester} {review.year}
                      </div>
                    </div>
                  </div>
                  <div style={styles.reviewRating}>⭐ {review.rating}/5</div>
                </div>

                {review.review_text && (
                  <p style={styles.reviewText}>{review.review_text}</p>
                )}

                <div style={styles.reviewStats}>
                  <span style={styles.reviewStat}>Difficulty: {review.difficulty}/5</span>
                  <span style={styles.reviewStat}>
                    Would take again: {review.would_take_again ? 'Yes' : 'No'}
                  </span>
                </div>

                <div style={styles.voteSection}>
                  {user ? (
                    <button
                      onClick={() => handleVote(review.id)}
                      style={{
                        ...styles.voteButton,
                        ...(userVotes.includes(review.id) ? styles.voteButtonActive : {})
                      }}
                    >
                      👍 Helpful ({review.helpful_count || 0})
                    </button>
                  ) : (
                    <div style={styles.voteText}>
                      👍 Helpful ({review.helpful_count || 0})
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div style={styles.noReviews}>
              No reviews yet. Be the first to review this course!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem 1rem'
  },
  backLink: {
    color: '#2563eb',
    textDecoration: 'none',
    marginBottom: '1rem',
    display: 'inline-block'
  },
  header: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '2rem'
  },
  badge: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    padding: '0.25rem 0.75rem',
    borderRadius: '0.25rem',
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: '1rem',
    marginBottom: '0.5rem'
  },
  description: {
    color: '#64748b',
    fontSize: '1rem',
    lineHeight: '1.6',
    marginBottom: '0.5rem'
  },
  credits: {
    color: '#64748b',
    fontSize: '0.9rem'
  },
  statsBox: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    marginTop: '1.5rem',
    padding: '1rem',
    backgroundColor: '#f8fafc',
    borderRadius: '0.375rem'
  },
  statItem: {
    textAlign: 'center'
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1e293b'
  },
  statLabel: {
    fontSize: '0.8rem',
    color: '#64748b',
    marginTop: '0.25rem'
  },
  reviewsSection: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  reviewsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1e293b'
  },
  addButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    border: 'none',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer'
  },
  loginPrompt: {
    backgroundColor: '#dbeafe',
    padding: '1rem',
    borderRadius: '0.375rem',
    marginBottom: '1rem',
    textAlign: 'center'
  },
  loginLink: {
    color: '#2563eb',
    fontWeight: '600',
    textDecoration: 'none'
  },
  notice: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    padding: '1rem',
    borderRadius: '0.375rem',
    marginBottom: '1rem'
  },
  reviewForm: {
    backgroundColor: '#f8fafc',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    marginBottom: '2rem'
  },
  formTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '1rem'
  },
  formError: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: '0.75rem',
    borderRadius: '0.375rem',
    marginBottom: '1rem'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
    marginBottom: '1rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#374151'
  },
  input: {
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.9rem'
  },
  textarea: {
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    resize: 'vertical'
  },
  formButtons: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem'
  },
  submitButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.375rem',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer'
  },
  cancelButton: {
    backgroundColor: '#6b7280',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.375rem',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer'
  },
  reviewsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  reviewCard: {
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    padding: '1.5rem'
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem'
  },
  reviewAuthorSection: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  },
  reviewAvatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #e5e7eb'
  },
  reviewAvatarPlaceholder: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#2563eb',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    fontWeight: 'bold',
    border: '2px solid #e5e7eb'
  },
  reviewAuthor: {
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '0.25rem'
  },
  reviewMeta: {
    fontSize: '0.85rem',
    color: '#64748b'
  },
  reviewRating: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#1e293b'
  },
  reviewText: {
    color: '#374151',
    lineHeight: '1.6',
    marginBottom: '1rem'
  },
  reviewStats: {
    display: 'flex',
    gap: '1.5rem',
    fontSize: '0.85rem',
    color: '#64748b',
    marginBottom: '1rem'
  },
  reviewStat: {},
  voteSection: {
    paddingTop: '1rem',
    borderTop: '1px solid #e5e7eb'
  },
  voteButton: {
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  voteButtonActive: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    borderColor: '#93c5fd'
  },
  voteText: {
    color: '#64748b',
    fontSize: '0.85rem',
    padding: '0.5rem 0'
  },
  noReviews: {
    textAlign: 'center',
    padding: '2rem',
    color: '#64748b'
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.1rem',
    color: '#64748b'
  },
  error: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.1rem',
    color: '#991b1b'
  }
};

export default CourseDetail;
