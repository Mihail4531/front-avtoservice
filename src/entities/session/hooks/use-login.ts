import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth-api';
import { useSessionStore } from '../model/store';
import type { LoginFormValues } from '@/features/auth/login/model/schema';

export const useLogin = () => {
    const navigate = useNavigate();
    const initAuth = useSessionStore((s) => s.initAuth);

    return useMutation({
        mutationFn: authApi.login,
        onSuccess: async () => {
            await initAuth();
            navigate('/', { replace: true });
        },
        onError: (error: any) => {
            const msg = error.response?.data?.message || 'Неверный email или пароль';
            console.error(msg);
        },
    });
};
