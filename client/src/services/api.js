const API_URL = import.meta.env.VITE_API_URL;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Auth API
export const authAPI = {
  register: async (userData) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  login: async (credentials) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return res.json();
  },

  getCurrentUser: async () => {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    return res.json();
  }
};

// Course API
export const courseAPI = {
  getAllCourses: async () => {
    const res = await fetch(`${API_URL}/courses`);
    return res.json();
  },

  getCourseById: async (id) => {
    const res = await fetch(`${API_URL}/courses/${id}`);
    return res.json();
  },

  getDepartments: async () => {
    const res = await fetch(`${API_URL}/courses/departments`);
    return res.json();
  },

  searchCourses: async (query, department) => {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (department) params.append('department', department);

    const res = await fetch(`${API_URL}/courses/search?${params}`);
    return res.json();
  }
};

// Review API
export const reviewAPI = {
  createReview: async (courseId, reviewData) => {
    const res = await fetch(`${API_URL}/reviews/course/${courseId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reviewData)
    });
    return res.json();
  },

  updateReview: async (reviewId, reviewData) => {
    const res = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(reviewData)
    });
    return res.json();
  },

  deleteReview: async (reviewId) => {
    const res = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  getUserReviews: async () => {
    const res = await fetch(`${API_URL}/reviews/my-reviews`, {
      headers: getAuthHeaders()
    });
    return res.json();
  }
};

// Vote API
export const voteAPI = {
  toggleHelpfulVote: async (reviewId) => {
    const res = await fetch(`${API_URL}/votes/review/${reviewId}/toggle`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  getUserVotesForCourse: async (courseId) => {
    const res = await fetch(`${API_URL}/votes/course/${courseId}/user-votes`, {
      headers: getAuthHeaders()
    });
    return res.json();
  }
};

// Upload API
export const uploadAPI = {
  uploadProfilePicture: async (file) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('profilePicture', file);

    const res = await fetch(`${API_URL}/upload/profile-picture`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: formData
    });
    return res.json();
  },

  deleteProfilePicture: async () => {
    const res = await fetch(`${API_URL}/upload/profile-picture`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.json();
  }
};
