import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCategoryArticle } from '../api/api';
import { type UpdateCategoryArticleRequest } from '@/entities/category-article/model/types';

export const useUpdateCategoryArticle = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateCategoryArticleRequest }) => 
            updateCategoryArticle(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['category-articles'] });
            queryClient.invalidateQueries({ queryKey: ['category-article'] });
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Не удалось обновить категорию статей';
            console.error(message);
        }
    });
};
