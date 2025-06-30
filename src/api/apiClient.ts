import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Function to handle logout and redirect
const handleTokenExpired = () => {
  // Clear all stored auth data
  localStorage.removeItem('orchid_user');
  localStorage.removeItem('orchid_access_token');
  localStorage.removeItem('orchid_refresh_token');
  
  // Redirect to homepage
  window.location.href = '/';
  
  // Show login modal by dispatching a custom event
  window.dispatchEvent(new CustomEvent('token-expired'));
};

// Request interceptor to add auth headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('orchid_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Check for 401 (Unauthorized) or 403 (Forbidden) status codes
      if (error.response.status === 401 || error.response.status === 403) {
        // Check if the error is related to token expiration
        const errorMessage = error.response.data?.message || error.response.data?.error || '';
        if (
          errorMessage.toLowerCase().includes('expired') ||
          errorMessage.toLowerCase().includes('invalid') ||
          errorMessage.toLowerCase().includes('unauthorized') ||
          error.response.status === 401
        ) {
          handleTokenExpired();
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
