import axios from 'axios';

// Base API URL configuration
const baseURL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Automatically attach token if present
api.interceptors.request.use(
  (config) => {
    try {
      const userInfoStr = localStorage.getItem('userInfo');
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        if (userInfo?.token) {
          config.headers.Authorization = `Bearer ${userInfo.token}`;
        }
      }
    } catch (err) {
      console.warn('Failed to parse userInfo for auth token:', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Extract consistent error message
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 Unauthorized, we can optionally clear expired token if needed
    if (error.response?.status === 401) {
      console.warn('Session expired or unauthorized request.');
    }
    return Promise.reject(error);
  }
);

export default api;
