import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Welcome to CourseScope</h1>
        <p style={styles.subtitle}>
          Discover the best courses at San Diego Community College District through authentic student reviews
        </p>
        <div style={styles.buttons}>
          <Link to="/courses" style={{ ...styles.button, ...styles.primaryButton }}>
            Browse Courses
          </Link>
          <Link to="/register" style={{ ...styles.button, ...styles.secondaryButton }}>
            Get Started
          </Link>
        </div>
      </div>

      <div style={styles.features}>
        <div style={styles.feature}>
          <h3 style={styles.featureTitle}>Real Student Reviews</h3>
          <p style={styles.featureText}>
            Read honest reviews from fellow SDCCD students about courses, professors, and difficulty
          </p>
        </div>
        <div style={styles.feature}>
          <h3 style={styles.featureTitle}>Make Informed Decisions</h3>
          <p style={styles.featureText}>
            Use ratings and reviews to plan your schedule and choose the right courses for you
          </p>
        </div>
        <div style={styles.feature}>
          <h3 style={styles.featureTitle}>Share Your Experience</h3>
          <p style={styles.featureText}>
            Help other students by sharing your experiences with courses you've taken
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem'
  },
  hero: {
    textAlign: 'center',
    padding: '4rem 0',
    backgroundColor: '#f8fafc',
    borderRadius: '0.5rem',
    marginBottom: '3rem'
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '1rem'
  },
  subtitle: {
    fontSize: '1.25rem',
    color: '#64748b',
    marginBottom: '2rem',
    maxWidth: '600px',
    margin: '0 auto 2rem'
  },
  buttons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center'
  },
  button: {
    padding: '0.75rem 1.5rem',
    borderRadius: '0.375rem',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer'
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    color: 'white'
  },
  secondaryButton: {
    backgroundColor: 'white',
    color: '#2563eb',
    border: '2px solid #2563eb'
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem'
  },
  feature: {
    padding: '2rem',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  featureTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '0.5rem'
  },
  featureText: {
    color: '#64748b',
    lineHeight: '1.6'
  }
};

export default Home;
