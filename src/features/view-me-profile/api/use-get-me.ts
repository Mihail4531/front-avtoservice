import { useQuery } from '@tanstack/react-query';
import { staffApi } from '@/entities/staff';

export const GET_ME_KEY = ['staff', 'me'] as const;

export const useGetMe = () => {
    return useQuery({
        queryKey: GET_ME_KEY,
        queryFn: async () => {
            const res = await staffApi.getMe();
            return res.data;
        },
    });
}