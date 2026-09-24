import apiClient from './apiClient';

export const trainingApi = {
  getToday: async () => {
    const res = await apiClient.get('/training/today');
    return res.data;
  },
  getWeekSchedule: async () => {
    const res = await apiClient.get('/training/schedule');
    return res.data;
  },
  logWorkout: async (exerciseId, logData) => {
    const res = await apiClient.post('/training/log', {
      exerciseId,
      ...logData
    });
    return res.data;
  }
};
