import axios from 'axios';

// Check if we are in a production environment (Vercel deployed app)
const isProduction = window.location.hostname !== 'localhost';

const API = axios.create({
  baseURL: isProduction
    ? 'https://event-planner-app-backend.vercel.app/api'  // Deployed backend API URL
    : 'http://localhost:5000/api',                        // Local backend API URL
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
