import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMeProfile } from '../api/api';
import { useSessionStore } from '@/entities/session/model/store';

export const useUpdateMe = () => {
    const queryClient = useQueryClient();
    const initAuth = useSessionStore((state) => state.initAuth); 

    return useMutation({
        mutationFn: updateMeProfile,
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['me'] });
            await initAuth();
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Не удалось обновить профиль';
            console.error(message);
        }
    });
};