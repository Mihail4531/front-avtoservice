import { api } from '../../../shared/api';
import type { Staff, CreateStaffInput, UpdateStaffInput } from '../model';

/**
 * API для работы с сотрудниками
 * Соответствует backend endpoints:
 * - POST /dashboard/admin/staffs - создание
 * - PUT /dashboard/admin/staffs/{id} - обновление
 * - GET /dashboard/admin/staffs - получение списка
 */
export const staffApi = {
  /**
   * Создание нового сотрудника
   * POST /dashboard/admin/staffs
   * Бизнес-логика backend:
   * - Нельзя создать super_admin (только manager или admin)
   * - Пароль должен быть минимум 6 символов
   */
  create: async (data: CreateStaffInput): Promise<Staff> => {
    const response = await api.post<Staff>('/dashboard/admin/staffs', data);
    return response.data;
  },

  /**
   * Обновление сотрудника
   * PUT /dashboard/admin/staffs/{id}
   * Бизнес-логика backend:
   * - Нельзя редактировать себя
   * - Нельзя редактировать super_admin
   * - Admin не может редактировать другого admin
   * - Нельзя повысить до super_admin
   */
  update: async (id: number, data: UpdateStaffInput): Promise<Staff> => {
    const response = await api.put<Staff>(`/dashboard/admin/staffs/${id}`, data);
    return response.data;
  },

  /**
   * Получение списка сотрудников
   * GET /dashboard/admin/staffs
   * Примечание: backend возвращает { items: [], total, limit, offset }
   */
  getAll: async (): Promise<Staff[]> => {
    const response = await api.get('/dashboard/admin/staffs');
    
    // Проверка, что данные существуют и это объект
    if (!response.data || typeof response.data !== 'object' || Array.isArray(response.data)) {
      console.error('Unexpected response format:', response.data);
      return [];
    }
    
    // Извлекаем массив из поля items
    const items = response.data.items;
    if (!Array.isArray(items)) {
      console.error('items is not an array:', items);
      return [];
    }
    
    return items;
  },

  /**
   * Получение сотрудника по ID
   * GET /dashboard/admin/staffs/{id}
   */
  getById: async (id: number): Promise<Staff> => {
    const response = await api.get<Staff>(`/dashboard/admin/staffs/${id}`);
    return response.data;
  },
};
