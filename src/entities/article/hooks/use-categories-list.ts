'use client';

import { useQuery } from '@tanstack/react-query';
import { getCategoriesList } from '@/entities/article/api/api';
import type { CategoryArticleShort } from '@/entities/article/model/types';

export const useCategoriesList = () => {
    const { data, isLoading, error } = useQuery<{ items: CategoryArticleShort[] }, Error>({
        queryKey: ['categories-list'],
        queryFn: getCategoriesList,
        staleTime: 5 * 60 * 1000, // 5 минут
    });

    return {
        categories: data?.items ?? [],
        isLoading,
        error,
    };
};
