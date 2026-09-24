import axios from 'axios';

// Create central Axios client
const apiClient = axios.create({
  baseURL: '/api'
});

// Interceptor to attach Authorization header if token exists
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;
