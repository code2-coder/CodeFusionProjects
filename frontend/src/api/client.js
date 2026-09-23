import axios from 'axios';

// Base API URL configuration
let rawBaseURL = import.meta.env.VITE_API_URL || '';
rawBaseURL = rawBaseURL.replace(/\/+$/, '');
if (rawBaseURL.endsWith('/api')) {
  rawBaseURL = rawBaseURL.slice(0, -4);
}

const isProduction = import.meta.env.PROD || (
  typeof window !== 'undefined' && 
  window.location.hostname !== 'localhost' && 
  window.location.hostname !== '127.0.0.1'
);

if (isProduction && (!rawBaseURL || rawBaseURL.includes('localhost') || rawBaseURL.includes('127.0.0.1'))) {
  rawBaseURL = 'https://codefusionprojects.onrender.com';
}

const api = axios.create({
  baseURL: rawBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Automatically ensure /api prefix is present and attach auth token
api.interceptors.request.use(
  (config) => {
    // Ensure all internal API endpoints route through /api
    if (config.url && !config.url.startsWith('http://') && !config.url.startsWith('https://')) {
      if (!config.url.startsWith('/api') && !config.url.startsWith('api/')) {
        config.url = `/api${config.url.startsWith('/') ? '' : '/'}${config.url}`;
      } else if (config.url.startsWith('api/')) {
        config.url = `/${config.url}`;
      }
    }

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
