// features/staff-list/model/use-staff-list.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/api';
import { type StaffListResponse, type StaffFilters } from '@/entities/staff/model/types';

interface UseStaffListOptions {
    initialLimit?: number;
    filters?: Partial<StaffFilters>;
}

export const useStaffList = ({ initialLimit = 10, filters }: UseStaffListOptions = {}) => {
    const fetchStaff = async () => {
        const params: Record<string, string | number | boolean | undefined> = {
            limit: initialLimit,
            offset: (filters?.page ?? 0) * initialLimit,
            search: filters?.search || undefined,
            is_active: filters?.is_active
        };

        // Добавляем фильтры по дате создания, если они указаны
        if (filters?.created_at_from) {
            params.created_at_from = filters.created_at_from;
        }
        if (filters?.created_at_to) {
            params.created_at_to = filters.created_at_to;
        }

        // Добавляем фильтр по роли, если указан
        if (filters?.role) {
            params.role = filters.role;
        }

        const response = await api.get<StaffListResponse>('/dashboard/admin/staffs', { params });
        return response.data;
    };

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['staffs', initialLimit, filters?.page, filters?.search, filters?.is_active, filters?.role, filters?.created_at_from, filters?.created_at_to],
        queryFn: fetchStaff,
        staleTime: 0, // Данные всегда считаются устаревшими для мгновенного обновления
    });

    return { 
        data, 
        isLoading, 
        filters: filters ?? { search: '', is_active: undefined, page: 0 },
        refresh: refetch
    };
};