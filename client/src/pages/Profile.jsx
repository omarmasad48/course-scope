import { useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { uploadAPI } from '../services/api';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB');
      return;
    }

    setError('');
    setSuccess('');
    setUploading(true);

    try {
      const result = await uploadAPI.uploadProfilePicture(file);

      if (result.user) {
        // Update user context with new profile picture
        const updatedUser = { ...user, profile_picture_url: result.user.profile_picture_url };
        setUser(updatedUser);
        setSuccess('Profile picture updated successfully!');
      } else {
        setError(result.error || 'Upload failed');
      }
    } catch (err) {
      setError('Failed to upload image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to remove your profile picture?')) {
      return;
    }

    setError('');
    setSuccess('');
    setUploading(true);

    try {
      const result = await uploadAPI.deleteProfilePicture();

      if (result.user) {
        const updatedUser = { ...user, profile_picture_url: null };
        setUser(updatedUser);
        setSuccess('Profile picture removed');
      } else {
        setError(result.error || 'Failed to remove picture');
      }
    } catch (err) {
      setError('Failed to remove picture');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Profile</h1>

      <div style={styles.card}>
        <div style={styles.profileSection}>
          <div style={styles.avatarContainer}>
            {user.profile_picture_url ? (
              <img
                src={user.profile_picture_url}
                alt="Profile"
                style={styles.avatar}
              />
            ) : (
              <div style={styles.avatarPlaceholder}>
                {user.first_name[0]}{user.last_name[0]}
              </div>
            )}
          </div>

          <div style={styles.uploadButtons}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={styles.fileInput}
              disabled={uploading}
            />
            <button
              onClick={() => fileInputRef.current.click()}
              disabled={uploading}
              style={styles.uploadButton}
            >
              {uploading ? 'Uploading...' : 'Upload New Picture'}
            </button>
            {user.profile_picture_url && (
              <button
                onClick={handleDelete}
                disabled={uploading}
                style={styles.deleteButton}
              >
                Remove Picture
              </button>
            )}
          </div>

          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={styles.success}>{success}</div>}

          <div style={styles.helpText}>
            Accepted formats: JPG, PNG, GIF (max 5MB)
          </div>
        </div>

        <div style={styles.infoSection}>
          <h2 style={styles.sectionTitle}>Account Information</h2>

          <div style={styles.infoItem}>
            <span style={styles.label}>Name:</span>
            <span style={styles.value}>{user.first_name} {user.last_name}</span>
          </div>

          <div style={styles.infoItem}>
            <span style={styles.label}>Email:</span>
            <span style={styles.value}>{user.email}</span>
          </div>

          <div style={styles.infoItem}>
            <span style={styles.label}>Member since:</span>
            <span style={styles.value}>
              {new Date(user.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem 1rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '2rem'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  },
  profileSection: {
    padding: '2rem',
    borderBottom: '1px solid #e5e7eb',
    textAlign: 'center'
  },
  avatarContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.5rem'
  },
  avatar: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid #e5e7eb'
  },
  avatarPlaceholder: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    backgroundColor: '#2563eb',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3rem',
    fontWeight: 'bold',
    border: '4px solid #e5e7eb'
  },
  uploadButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginBottom: '1rem'
  },
  fileInput: {
    display: 'none'
  },
  uploadButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.375rem',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer'
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.375rem',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer'
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: '0.75rem',
    borderRadius: '0.375rem',
    marginTop: '1rem',
    fontSize: '0.9rem'
  },
  success: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    padding: '0.75rem',
    borderRadius: '0.375rem',
    marginTop: '1rem',
    fontSize: '0.9rem'
  },
  helpText: {
    fontSize: '0.85rem',
    color: '#64748b',
    marginTop: '1rem'
  },
  infoSection: {
    padding: '2rem'
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '1.5rem'
  },
  infoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 0',
    borderBottom: '1px solid #f3f4f6'
  },
  label: {
    fontWeight: '500',
    color: '#64748b'
  },
  value: {
    color: '#1e293b'
  }
};

export default Profile;
