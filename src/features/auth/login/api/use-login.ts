import { useState } from 'react';
import { api } from '@/shared/api/api'; // ← замени на реальный путь к твоему axios.create()
import type { LoginFormValues } from '../model/schema';

export const useLogin = () => {
    const [isPending, setIsPending] = useState(false);

    const mutate = async (
        data: LoginFormValues,
        options?: { onSuccess?: () => void; onError?: (msg: string) => void }
    ) => {
        setIsPending(true);
        try {
            // Бэкенд возвращает 204, куки сохранятся автоматически (withCredentials: true)
            await api.post('/auth/login', data);
            options?.onSuccess?.();
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Неверный email или пароль';
            options?.onError?.(msg);
        } finally {
            setIsPending(false);
        }
    };

    return { mutate, isPending };
};