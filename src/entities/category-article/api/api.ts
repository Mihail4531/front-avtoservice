import { api } from '@/shared/api/api';
import { type CreateCategoryArticleRequest, type SlugPreviewResponse, type UpdateCategoryArticleRequest, type CategoryArticleListResponse, type CategoryArticleFilters } from '@/entities/category-article/model/types';

export const createCategoryArticle = async (data: CreateCategoryArticleRequest) => {
    const response = await api.post('/dashboard/admin/categories/articles', data);
    return response.data;
};

export const updateCategoryArticle = async (id: number, data: UpdateCategoryArticleRequest) => {
    const response = await api.put(`/dashboard/admin/categories/articles/${id}`, data);
    return response.data;
};

export const deleteCategoryArticle = async (id: number) => {
    const response = await api.delete(`/dashboard/admin/categories/articles/${id}`);
    return response.data;
};

export const getCategoryArticleById = async (id: number) => {
    const response = await api.get(`/dashboard/admin/categories/articles/${id}`);
    return response.data;
};

export const getCategoryArticlesList = async (filters?: CategoryArticleFilters): Promise<CategoryArticleListResponse> => {
    const response = await api.get<CategoryArticleListResponse>('/dashboard/admin/categories/articles', {
        params: filters
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
