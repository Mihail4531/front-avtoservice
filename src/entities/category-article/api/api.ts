import { api } from '@/shared/api/api';
import { type CreateCategoryArticleRequest, type SlugPreviewResponse } from '@/entities/category-article/model/types';

export const createCategoryArticle = async (data: CreateCategoryArticleRequest) => {
    const response = await api.post('/dashboard/admin/categories/articles', data);
    return response.data;
};

export const previewSlug = async (title: string): Promise<SlugPreviewResponse> => {
    const response = await api.get<SlugPreviewResponse>('/dashboard/admin/categories/articles/slug-preview', {
        params: { title }
    });
    return response.data;
};

export const uploadFile = async (file: File, folder?: string): Promise<{ path: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) {
        formData.append('folder', folder);
    }
    
    const response = await api.post<{ path: string }>('/dashboard/admin/uploads', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    
    return response.data;
};
