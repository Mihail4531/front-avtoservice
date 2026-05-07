import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteArticle } from '../api/api';

export const useDeleteArticle = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => 
            deleteArticle(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['articles'] });
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Не удалось удалить статью';
            console.error(message);
        }
    });
};

