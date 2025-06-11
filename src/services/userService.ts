import api from './api';

export interface LocationPreferences {
  latitude: number;
  longitude: number;
  radius: number;
  minAge: number;
  maxAge: number;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const userService = {
  // Get all users (admin only)
  getAllUsers: (page: number = 1, limit: number = 20) =>
    api.get(`/users?page=${page}&limit=${limit}`),

  // Get nearby users
  getNearbyUsers: () => api.get('/users/nearby'),

  // Get user details
  getUserDetails: (userId: string) => api.get(`/users/${userId}`),

  // Update location preferences
  updateLocationPreferences: (data: LocationPreferences) =>
    api.put('/users/location', data),

  // Update profile
  updateProfile: (userId: string, data: UpdateProfileData) =>
    api.put(`/users/${userId}`, data),

  // Update password
  updatePassword: (userId: string, data: UpdatePasswordData) =>
    api.patch(`/users/${userId}/password`, data),

  // Delete user (admin only)
  deleteUser: (userId: string) => api.delete(`/users/${userId}`),
};
