import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCategoryArticle } from '../api/api';
import { type CreateCategoryArticleRequest } from '@/entities/category-article/model/types';

export const useCreateCategoryArticle = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCategoryArticleRequest) => 
            createCategoryArticle(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['category-articles'] });
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Не удалось создать категорию статей';
            console.error(message);
        }
    });
};
