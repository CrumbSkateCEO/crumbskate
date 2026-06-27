import axios from 'axios';
import { getApiUrl } from '../utils/apiUrl';

const api = axios.create({
  baseURL: getApiUrl(),
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('crumbskate_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
