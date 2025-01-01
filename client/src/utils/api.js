import axios from 'axios';

const isProduction = window.location.hostname !== 'localhost';

const API = axios.create({
  baseURL: isProduction
    ? 'https://event-planner-app-backend.vercel.app/api'
    : 'http://localhost:5000/api',
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
