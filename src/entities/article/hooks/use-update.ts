import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateArticle } from '../api/api';
import { type UpdateArticleRequest } from '@/entities/article/model/types';

export const useUpdateArticle = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateArticleRequest }) => 
            updateArticle(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['articles'] });
            queryClient.invalidateQueries({ queryKey: ['article'] });
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Не удалось обновить статью';
            console.error(message);
        }
    });
};

