import api from './api';

export interface Interest {
  name: string;
  weight: number;
}

export const interestService = {
  // Get all interests
  getAllInterests: () => api.get('/interests'),

  // Get interest details
  getInterestDetails: (interestId: string) =>
    api.get(`/interests/${interestId}`),

  // Create interest (admin only)
  createInterest: (data: Interest) => api.post('/interests', data),

  // Update interest (admin only)
  updateInterest: (interestId: string, data: Interest) =>
    api.put(`/interests/${interestId}`, data),

  // Delete interest (admin only)
  deleteInterest: (interestId: string) =>
    api.delete(`/interests/${interestId}`),

  // Select interest for user
  selectInterest: (userId: string) => api.post(`/interests/user/${userId}`),

  // Remove interest from user
  removeInterest: (userId: string) => api.delete(`/interests/user/${userId}`),

  // Get interests by user
  getUserInterests: () => api.get('/interests/user'),
};
