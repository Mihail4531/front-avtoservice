import { useQuery } from '@tanstack/react-query';
import { getCategoryArticleById } from '../api/api';

export const useCategoryArticleById = (id: number | null) => {
    return useQuery({
        queryKey: ['category-article', id],
        queryFn: () => {
            if (id === null) {
                throw new Error('ID категории не указан');
            }
            return getCategoryArticleById(id);
        },
        enabled: id !== null,
    });
};
