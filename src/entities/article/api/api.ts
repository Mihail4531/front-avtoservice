import { api } from '@/shared/api/api';
import { type CreateArticleRequest, type SlugPreviewResponse, type UpdateArticleRequest, type ArticleListResponse, type ArticleFilters } from '@/entities/article/model/types';
import type { CategoryArticleShort } from '@/entities/article/model/types';

export const createArticle = async (data: CreateArticleRequest) => {
    const response = await api.post('/dashboard/admin/articles', data);
    return response.data;
};

export const updateArticle = async (id: number, data: UpdateArticleRequest) => {
    const response = await api.put(`/dashboard/admin/articles/${id}`, data);
    return response.data;
};

export const deleteArticle = async (id: number) => {
    const response = await api.delete(`/dashboard/admin/articles/${id}`);
    return response.data;
};

export const getArticleById = async (id: number) => {
    const response = await api.get(`/dashboard/admin/articles/${id}`);
    return response.data;
};

export const getArticlesList = async (filters?: ArticleFilters): Promise<ArticleListResponse> => {
    const response = await api.get<ArticleListResponse>('/dashboard/admin/articles', {
        params: filters
    });
    return response.data;
};

export const getCategoriesList = async (): Promise<{ items: CategoryArticleShort[] }> => {
    const response = await api.get<{ items: CategoryArticleShort[] }>('/dashboard/admin/categories/articles', {
        params: { limit: 1000 } // Получаем все категории
    });
    return response.data;
};

export const previewSlug = async (title: string): Promise<SlugPreviewResponse> => {
    const response = await api.get<SlugPreviewResponse>('/dashboard/admin/slug-preview', {
        params: { title }
    });
    return response.data;
};

export const uploadFile = async (file: File, folder: string): Promise<{ path: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await api.post<{ path: string }>(
        '/dashboard/admin/uploads',
        formData
    );

    return response.data;
};

