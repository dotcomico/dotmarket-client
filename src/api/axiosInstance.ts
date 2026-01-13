import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT } from './apiConfig';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add JWT token to every request
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

// Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
     if (error.response?.status === 403) {
      console.error('Access denied');
    }

    if (error.response?.status === 500) {
      console.error('Server error');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;