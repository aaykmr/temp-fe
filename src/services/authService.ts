import api from './api';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  bio: string;
  photoUrl: string;
  interests: string[];
}

export interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  register: (data: RegisterData) => api.post('/auth/register', data),
  login: (data: LoginData) => api.post('/auth/login', data),
};
