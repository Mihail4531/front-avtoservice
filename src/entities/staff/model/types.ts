// Domain types for Staff entity

export type StaffRole = 'manager' | 'admin' | 'super_admin';

export interface Staff {
  id: number;
  full_name: string;
  email: string;
  role: StaffRole;
  is_active: boolean;
  created_at: string;
}

/**
 * Staff с методами проверки прав доступа на основе бизнес-логики backend
 */
export interface StaffWithPermissions extends Staff {
  /**
   * Можно ли редактировать этого сотрудника текущим пользователем
   * Бизнес-логика из backend:
   * - Нельзя редактировать себя (currentID == staffID)
   * - Нельзя редактировать super_admin
   * - Admin не может редактировать другого admin
   */
  canBeEditedBy(currentUserId: number | null, currentUserRole: StaffRole | null): boolean;
  
  /**
   * Можно ли повысить до super_admin
   * Бизнес-логика: всегда false (нельзя назначить super_admin через этот эндпоинт)
   */
  canBePromotedToSuperAdmin(): false;
  
  /**
   * Может ли текущий пользователь изменить роль этого сотрудника
   * Бизнес-логика: admin не может менять роль другому admin
   */
  canHaveRoleChangedBy(currentUserRole: StaffRole | null): boolean;
}

/**
 * Фабрика для создания StaffWithPermissions
 */
export function createStaffWithPermissions(staff: Staff): StaffWithPermissions {
  return {
    ...staff,
    
    canBeEditedBy(currentUserId, currentUserRole) {
      // Нельзя редактировать super_admin
      if (staff.role === 'super_admin') {
        return false;
      }
      
      // Admin не может редактировать другого admin
      if (currentUserRole === 'admin' && staff.role === 'admin') {
        return false;
      }
      
      return true;
    },
    
    canBePromotedToSuperAdmin() {
      return false as const;
    },
    
    canHaveRoleChangedBy(currentUserRole) {
      // Admin не может менять роль другому admin
      if (currentUserRole === 'admin' && staff.role === 'admin') {
        return false;
      }
      
      return true;
    }
  };
}

/**
 * Input для создания сотрудника (соответствует CreateStaffRequest в backend)
 */
export interface CreateStaffInput {
  full_name: string;
  email: string;
  password: string;
  role: 'manager' | 'admin'; // super_admin исключен на уровне типа
}

/**
 * Input для обновления сотрудника (соответствует UpdateInput в backend)
 */
export interface UpdateStaffInput {
  full_name: string;
  email: string;
  role: 'manager' | 'admin'; // super_admin исключен
  is_active: boolean;
}

/**
 * Доступные роли для создания/редактирования (исключая super_admin)
 */
export const EDITABLE_ROLES: StaffRole[] = ['manager', 'admin'];

/**
 * Массив ролей для использования в zod enum
 */
export const STAFF_ROLES = ['manager', 'admin', 'super_admin'] as const;

/**
 * Ответ API со списком сотрудников (соответствует StaffListResponse в backend)
 */
export interface StaffListResponse {
  items: Staff[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Фильтры для списка сотрудников
 */
export interface StaffFilters {
  search?: string;
  is_active?: boolean;
  page?: number;
}
