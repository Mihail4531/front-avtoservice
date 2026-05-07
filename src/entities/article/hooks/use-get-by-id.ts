import { useQuery } from '@tanstack/react-query';
import { getArticleById } from '../api/api';

export const useArticleById = (id: number | null) => {
    return useQuery({
        queryKey: ['article', id],
        queryFn: () => {
            if (id === null) {
                throw new Error('ID статьи не указан');
            }
            return getArticleById(id);
        },
        enabled: id !== null,
    });
};

