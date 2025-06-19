import axios from 'axios';

// Set default axios configuration
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Set a longer timeout for report generation (5 minutes)
axios.defaults.timeout = 300000; // 300 seconds = 5 minutes

// Add request interceptor to add auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't show timeout errors as failures if the request might still be processing
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      console.log('Request timed out, but processing may continue on server');
    }
    return Promise.reject(error);
  }
);

export default axios;