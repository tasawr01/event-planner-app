import axios from 'axios';

// Creating an instance of axios to add base URL and authentication token
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Backend API URL
});

// Intercepting request to add auth token in headers
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['x-auth-token'] = token; // Attach token in headers for authorization
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
