import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMeProfile, updateStaff, createStaff } from '../api/api';
import { useSessionStore } from '@/entities/session/model/store';
import { type UpdateStaffRequest, type CreateStaffRequest } from '@/entities/staff/model/types';

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

export const useUpdateStaff = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ staffId, data }: { staffId: number; data: UpdateStaffRequest }) => 
            updateStaff(staffId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['staffs'] });
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Не удалось обновить сотрудника';
            console.error(message);
        }
    });
};

export const useCreateStaff = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateStaffRequest) => 
            createStaff(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['staffs'] });
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Не удалось создать сотрудника';
            console.error(message);
        }
    });
};