import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

api.interceptors.request.use((config) => {
  // Check localStorage first, fallback to Cookie if not present
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('access_token') || Cookies.get('access_token')
    : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;