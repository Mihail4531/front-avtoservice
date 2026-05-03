// entities/staff/model/types.ts

export const STAFF_ROLES = ['manager', 'admin', 'super_admin'] as const;
export type StaffRole = typeof STAFF_ROLES[number];

export interface Staff {
    id: number;
    full_name: string;
    email: string;
    role: StaffRole;
    is_active: boolean;
    created_at: string;
}

/**
 * Тип для обновления сотрудника через админку.
 * Соответствует UpdateRequest в Go-сервисе.
 */
export interface UpdateStaffRequest {
    full_name: string;
    email: string;
    role: StaffRole;
    is_active: boolean;
}

export interface StaffListResponse {
    items: Staff[];
    total: number;
    limit: number;
    offset: number;
}

export interface StaffFilters {
    search?: string;
    role?: StaffRole;      // ← добавьте, если админ фильтрует по роли
    is_active?: boolean;
    page?: number;
    limit?: number;
}