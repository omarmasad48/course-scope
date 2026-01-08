import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          CourseScope
        </Link>

        <div style={styles.links}>
          <Link to="/courses" style={styles.link}>
            Browse Courses
          </Link>

          {user ? (
            <>
              <Link to="/my-reviews" style={styles.link}>
                My Reviews
              </Link>
              <Link to="/profile" style={styles.profileLink}>
                {user.profile_picture_url ? (
                  <img src={user.profile_picture_url} alt="Profile" style={styles.avatar} />
                ) : (
                  <div style={styles.avatarPlaceholder}>
                    {user.first_name[0]}{user.last_name[0]}
                  </div>
                )}
              </Link>
              <button onClick={logout} style={styles.button}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>
                Login
              </Link>
              <Link to="/register" style={styles.button}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: '#2563eb',
    padding: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    color: 'white',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textDecoration: 'none'
  },
  links: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1rem'
  },
  profileLink: {
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid white',
    cursor: 'pointer'
  },
  avatarPlaceholder: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'white',
    color: '#2563eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    border: '2px solid white',
    cursor: 'pointer'
  },
  user: {
    color: 'white',
    fontSize: '0.9rem'
  },
  button: {
    backgroundColor: 'white',
    color: '#2563eb',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500'
  }
};

export default Navbar;
