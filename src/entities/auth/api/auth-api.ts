import { api } from '@/shared/api/base-api';
import { LoginRequest } from '../model/types';
export const authApi = {
  login: (data: LoginRequest) => api.post<void>('/auth/login', data),
  refresh: () => api.post<void>('/auth/refresh'),
  logout: () => api.post<void>('/auth/logout'),
};
