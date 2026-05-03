// features/staff-list/model/use-staff-list.ts
'use client';

import { useState, useEffect } from 'react';
import { api } from '@/shared/api/api';
import { type Staff, type StaffFilters } from '@/entities/staff/model/types';

interface StaffListAPIResponse {
    items: Staff[];
    total: number;
    limit: number;
    offset: number;
}

export const useStaffList = (initialLimit = 10) => {
    const [data, setData] = useState<Staff[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<StaffFilters>({
        search: '',
        is_active: undefined,
        page: 0
    });

    const fetchStaff = async () => {
        setIsLoading(true);
        try {
            const params = {
                limit: initialLimit,
                offset: filters.page ? filters.page * initialLimit : 0,
                search: filters.search || undefined,
                is_active: filters.is_active
            };

            const response = await api.get<StaffListAPIResponse>('/dashboard/admin/staffs', { params });
            setData(response.data.items);
            setTotal(response.data.total);
        } catch (error) {
            console.error("Failed to fetch staff", error);
            setData([]);
            setTotal(0);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(fetchStaff, 300); // Debounce для поиска
        return () => clearTimeout(timer);
    }, [filters]);

    return { data, total, isLoading, filters, setFilters, refresh: fetchStaff };
};