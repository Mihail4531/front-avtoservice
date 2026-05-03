import { api } from '@/shared/api/api';
import type { LoginFormValues } from '@/features/auth/login/model/schema';

export const authApi = {
    login: (data: LoginFormValues) => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout'),
    refresh: () => api.post('/auth/refresh'),
    getMe: () => api.get('/dashboard/me'),
    updateMe: (data: { full_name: string; email: string }) => api.put('/dashboard/me', data),
};
