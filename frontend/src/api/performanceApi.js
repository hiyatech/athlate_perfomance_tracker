import apiClient from './apiClient';

export const performanceApi = {
  getSummary: async () => {
    const res = await apiClient.get('/performance/summary');
    return res.data;
  },
  getExerciseGrowth: async () => {
    const res = await apiClient.get('/performance/exercise-growth');
    return res.data;
  },
  getMonthlySessions: async () => {
    const res = await apiClient.get('/performance/monthly-sessions');
    return res.data;
  },
  getMoodTrend: async () => {
    const res = await apiClient.get('/performance/mood-trend');
    return res.data;
  },
  getWeeklyScore: async () => {
    const res = await apiClient.get('/performance/weekly-score');
    return res.data;
  }
};
