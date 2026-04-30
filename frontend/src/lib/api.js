import axios from 'axios';

// Centralized API base URL - single source of truth
export const API_BASE = process.env.REACT_APP_BACKEND_URL || '';
export const API = `${API_BASE}/api`;

// Pre-configured axios instance with credentials
const apiClient = axios.create({
  baseURL: API,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for centralized error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optionally trigger logout/redirect globally here
    }
    return Promise.reject(error);
  }
);

export default apiClient;