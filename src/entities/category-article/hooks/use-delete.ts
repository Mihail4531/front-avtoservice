import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCategoryArticle } from '../api/api';

export const useDeleteCategoryArticle = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => 
            deleteCategoryArticle(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['category-articles'] });
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Не удалось удалить категорию статей';
            console.error(message);
        }
    });
};
