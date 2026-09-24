import apiClient from './apiClient';

export const dashboardApi = {
  getStats: async () => {
    const res = await apiClient.get('/dashboard/stats');
    return res.data;
  },
  getWeeklyGoal: async () => {
    const res = await apiClient.get('/dashboard/weekly-goal');
    return res.data;
  },
  getOverallGrowth: async () => {
    const res = await apiClient.get('/dashboard/overall-growth');
    return res.data;
  },
  getInsight: async () => {
    const res = await apiClient.get('/dashboard/insight');
    return res.data;
  },
  getBestDay: async () => {
    const res = await apiClient.get('/dashboard/best-day');
    return res.data;
  },
  getWeekCalendar: async () => {
    const res = await apiClient.get('/dashboard/week-calendar');
    return res.data;
  }
};
