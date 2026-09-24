import apiClient from './apiClient';

export const profileApi = {
  getProfile: async () => {
    const res = await apiClient.get('/profile');
    return res.data;
  },
  updateProfile: async (data) => {
    const res = await apiClient.put('/profile', data);
    return res.data;
  },
  updatePhoto: async (photoUrl) => {
    const res = await apiClient.post('/profile/photo', { photoUrl });
    return res.data;
  },
  updateGoal: async (goal) => {
    const res = await apiClient.put('/profile/goal', { goal });
    return res.data;
  },
  updateDiet: async (followsDiet, dietType) => {
    const res = await apiClient.put('/profile/diet', { followsDiet, dietType });
    return res.data;
  },
  addInjury: async (injury) => {
    const res = await apiClient.post('/profile/injury', { injury });
    return res.data;
  },
  removeInjury: async (id) => {
    const res = await apiClient.delete(`/profile/injury/${id}`);
    return res.data;
  },
  updateAvailability: async (daysAvailablePerWeek) => {
    const res = await apiClient.put('/profile/availability', { daysAvailablePerWeek });
    return res.data;
  }
};
