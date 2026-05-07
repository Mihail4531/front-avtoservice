import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createArticle } from '../api/api';
import { type CreateArticleRequest } from '@/entities/article/model/types';

export const useCreateArticle = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateArticleRequest) => 
            createArticle(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['articles'] });
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Не удалось создать статью';
            console.error(message);
        }
    });
};

