import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCategoryArticle } from '../api/api';

export const useDeleteCategoryArticle = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteCategoryArticle(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['category-articles'] });
        },
    });
};