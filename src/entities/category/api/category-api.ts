import { api } from '@/shared/api/api';

export interface Category {
    id: number;
    title: string;
    slug: string;
}

export const getCategories = async (): Promise<Category[]> => {
    const response = await api.get('/dashboard/admin/categories');
    return response.data;
};
