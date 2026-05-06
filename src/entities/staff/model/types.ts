// entities/staff/model/types.ts

export const STAFF_ROLES = ['manager', 'admin', 'super_admin'] as const;
export type StaffRole = typeof STAFF_ROLES[number];

export interface Staff {
    id: number;
    version: number;
    full_name: string;
    email: string;
    role: StaffRole;
    is_active: boolean;
    created_at: string;
}

/**
 * Тип для создания нового сотрудника через админку.
 * Соответствует CreateStaffRequest в Go-сервисе.
 */
export interface CreateStaffRequest {
    full_name: string;
    email: string;
    password: string;
    role: Exclude<StaffRole, 'super_admin'>; // cannot create superadmin
}

/**
 * Тип для обновления сотрудника через админку.
 * Соответствует UpdateRequest в Go-сервисе.
 * Включает version для оптимистической блокировки.
 */
export interface UpdateStaffRequest {
    full_name: string;
    email: string;
    role: StaffRole;
    is_active: boolean;
    version: number;
}

export interface StaffListResponse {
    items: Staff[];
    total: number;
    limit: number;
    offset: number;
}

export interface StaffFilters {
    search?: string;
    role?: StaffRole;
    is_active?: boolean;
    created_at_from?: string; // ISO 8601 format for backend *time.Time
    created_at_to?: string;   // ISO 8601 format for backend *time.Time
    page?: number;
    limit?: number;
}

/**
 * Расширенный интерфейс сотрудника с методами проверки прав доступа
 * на основе бизнес-логики backend (StaffService.Update)
 */
export interface StaffWithPermissions extends Staff {
    /**
     * Проверка возможности редактирования сотрудника текущим пользователем
     * Логика из backend:
     * - if currentID == staffID -> нельзя (используй /me)
     * - if staff.Role == SuperAdmin -> нельзя
     * - if currentRole == Admin && staff.Role == Admin -> нельзя
     */
    canBeEditedBy(currentUserId: number, currentUserRole: StaffRole): boolean;
    
    /**
     * Проверка возможности повышения до super_admin
     * Логика из backend: if in.Role == SuperAdmin -> нельзя
     */
    canBePromotedToSuperAdmin(): boolean;
    
    /**
     * Проверка возможности смены роли конкретным пользователем
     */
    canHaveRoleChangedBy(currentUserRole: StaffRole): boolean;
}

/**
 * Фабрика для создания сотрудника с проверкой прав доступа
 */
export const createStaffWithPermissions = (staff: Staff): StaffWithPermissions => ({
    ...staff,
    
    canBeEditedBy(currentUserId: number, currentUserRole: StaffRole): boolean {
        // "if currentID == staffID { return nil, fmt.Errorf("use /me endpoint for self") }"
        if (this.id === currentUserId) return false;
        
        // "if staff.Role == domain.RoleSuperAdmin { return nil, fmt.Errorf("cannot edit superadmin") }"
        if (this.role === 'super_admin') return false;
        
        // "if currentRole == domain.RoleAdmin && staff.Role == domain.RoleAdmin { return nil, fmt.Errorf("admin cannot edit another admin") }"
        if (currentUserRole === 'admin' && this.role === 'admin') {
            return false;
        }

        return true;
    },

    canBePromotedToSuperAdmin(): boolean {
        // "if in.Role == domain.RoleSuperAdmin { return nil, fmt.Errorf("cannot promote to superadmin") }"
        return false;
    },

    canHaveRoleChangedBy(currentUserRole: StaffRole): boolean {
        if (this.role === 'super_admin') return false;
        if (currentUserRole === 'admin' && this.role === 'admin') return false;
        return true;
    }
});