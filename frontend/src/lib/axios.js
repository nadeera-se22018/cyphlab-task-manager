import axios from 'axios';
import Cookies from 'js-cookie';

const getApiBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (url) {
    return url.endsWith('/') ? url.slice(0, -1) : url;
  }
  // Remove the localhost fallback in production
  return process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';
};

const api = axios.create({
  baseURL: `${getApiBaseUrl()}/api`,
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
