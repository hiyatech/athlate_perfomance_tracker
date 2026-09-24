import apiClient from './apiClient';

export const authApi = {
  signup: async (data) => {
    const res = await apiClient.post('/auth/signup', data);
    return res.data;
  },
  login: async (data) => {
    const res = await apiClient.post('/auth/login', data);
    return res.data;
  },
  logout: async () => {
    const res = await apiClient.post('/auth/logout');
    return res.data;
  },
  getMe: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  }
};
