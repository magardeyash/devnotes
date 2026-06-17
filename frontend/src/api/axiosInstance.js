import axios from 'axios';

// Normalize the base URL:
// - Strip any trailing slash
// - Ensure it always ends with /api
// This makes the code tolerant of VITE_API_URL being set with or without /api
function buildBaseURL() {
  const raw = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const stripped = raw.replace(/\/+$/, ''); // remove trailing slashes
  // If the user set the URL without /api (e.g. https://xyz.onrender.com), append it
  return stripped.endsWith('/api') ? stripped : `${stripped}/api`;
}

const BASE_URL = buildBaseURL();

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // 30 s timeout to handle Render free-tier cold starts
  timeout: 30000,
});

// ── Request interceptor: attach JWT token ────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 (expired / invalid token) ───────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
