// features/staff-list/model/use-staff-list.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/api';
import { type StaffListResponse, type StaffFilters } from '@/entities/staff/model/types';

interface UseStaffListOptions {
    initialLimit?: number;
    filters?: Partial<StaffFilters>;
}

// Helper function to convert YYYY-MM-DD to RFC3339 (start of day UTC)
const formatDateToRFC3339 = (dateString: string, isEndOfDay: boolean = false): string | undefined => {
    if (!dateString) return undefined;
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return undefined;
    
    if (isEndOfDay) {
        // Set to end of day (23:59:59) for created_at_to
        date.setHours(23, 59, 59, 999);
    } else {
        // Set to start of day (00:00:00) for created_at_from
        date.setHours(0, 0, 0, 0);
    }
    
    return date.toISOString();
};

export const useStaffList = ({ initialLimit = 10, filters }: UseStaffListOptions = {}) => {
    const fetchStaff = async () => {
        const params: Record<string, string | number | boolean | undefined> = {
            limit: initialLimit,
            offset: (filters?.page ?? 0) * initialLimit,
            search: filters?.search || undefined,
            is_active: filters?.is_active
        };

        // Добавляем фильтры по дате создания, если они указаны
        // Преобразуем YYYY-MM-DD в RFC3339 формат
        if (filters?.created_at_from) {
            params.created_at_from = formatDateToRFC3339(filters.created_at_from, false);
        }
        if (filters?.created_at_to) {
            params.created_at_to = formatDateToRFC3339(filters.created_at_to, true);
        }

        // Фильтр по роли не отправляется на бэкенд, так как не поддерживается API

        const response = await api.get<StaffListResponse>('/dashboard/admin/staffs', { params });
        return response.data;
    };

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['staffs', initialLimit, filters?.page, filters?.search, filters?.is_active, filters?.created_at_from, filters?.created_at_to],
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