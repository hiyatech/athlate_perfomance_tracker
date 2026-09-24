import apiClient from './apiClient';

export const intelligenceApi = {
  getSports: async () => {
    const res = await apiClient.get('/sports');
    return res.data;
  },
  getGoals: async (sportId) => {
    const url = sportId ? `/goals?sportId=${sportId}` : '/goals';
    const res = await apiClient.get(url);
    return res.data;
  },
  generatePlan: async (data) => {
    const res = await apiClient.post('/intelligence/generate', data);
    return res.data;
  },
  savePlan: async (data) => {
    const res = await apiClient.post('/intelligence/plan/save', data);
    return res.data;
  },
  getPlans: async () => {
    const res = await apiClient.get('/intelligence/plans');
    return res.data;
  },
  getPlanById: async (planId) => {
    const res = await apiClient.get(`/intelligence/plans/${planId}`);
    return res.data;
  },
  updatePlan: async (planId, data) => {
    const res = await apiClient.put(`/intelligence/plans/${planId}`, data);
    return res.data;
  },
  deletePlan: async (planId) => {
    const res = await apiClient.delete(`/intelligence/plans/${planId}`);
    return res.data;
  },
  activatePlan: async (planId) => {
    const res = await apiClient.put(`/intelligence/plans/${planId}/activate`);
    return res.data;
  },
  getExercises: async () => {
    const res = await apiClient.get('/exercises');
    return res.data;
  }
};
