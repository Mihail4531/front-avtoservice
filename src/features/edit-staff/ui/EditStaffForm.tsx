import React, { useState, useEffect } from 'react';
import { useUpdateStaff } from '../../../entities/staff';
import type { Staff, UpdateStaffInput, StaffWithPermissions } from '../../../entities/staff';
import { EDITABLE_ROLES, createStaffWithPermissions } from '../../../entities/staff';
import { Modal } from '../../../shared/ui/modal';

interface EditStaffFormProps {
  staff: Staff;
  currentUserId: number | null;
  currentUserRole: Staff['role'] | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * Форма редактирования сотрудника
 * Бизнес-логика из backend полностью реализована:
 * - Нельзя редактировать себя (currentID == staffID)
 * - Нельзя редактировать super_admin
 * - Admin не может редактировать другого admin
 * - Нельзя назначить роль super_admin через этот эндпоинт
 */
export function EditStaffForm({ 
  staff, 
  currentUserId, 
  currentUserRole, 
  isOpen, 
  onClose, 
  onSuccess 
}: EditStaffFormProps) {
  const { isLoading, error, updateStaff, resetError } = useUpdateStaff();
  
  const [formData, setFormData] = useState<UpdateStaffInput>({
    full_name: staff.full_name,
    email: staff.email,
    role: staff.role as 'manager' | 'admin',
    is_active: staff.is_active,
  });

  // Создаем объект с правами доступа для проверки
  const staffWithPermissions: StaffWithPermissions = createStaffWithPermissions(staff);
  
  // Проверяем права доступа
  const canEdit = staffWithPermissions.canBeEditedBy(currentUserId, currentUserRole);
  const canChangeRole = staffWithPermissions.canHaveRoleChangedBy(currentUserRole);

  useEffect(() => {
    // Сбрасываем форму при открытии
    if (isOpen) {
      setFormData({
        full_name: staff.full_name,
        email: staff.email,
        role: staff.role as 'manager' | 'admin',
        is_active: staff.is_active,
      });
      resetError();
    }
  }, [isOpen, staff]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canEdit) {
      return;
    }

    resetError();
    const result = await updateStaff(staff.id, formData);
    
    if (result) {
      onSuccess?.();
      onClose();
    }
  };

  const handleChange = (field: keyof UpdateStaffInput, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Если нет прав на редактирование
  if (!canEdit) {
    return (
      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        title="Редактирование сотрудника"
      >
        <div className="p-4">
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
            Нет прав доступа для редактирования этого сотрудника
          </div>
          <ul className="text-sm text-gray-600 space-y-2 mb-4">
            <li>• Нельзя редактировать самого себя</li>
            <li>• Нельзя редактировать Super Admin</li>
            <li>• Admin не может редактировать другого Admin</li>
          </ul>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Закрыть
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={`Редактирование: ${staff.full_name}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ФИО *
          </label>
          <input
            type="text"
            required
            minLength={4}
            maxLength={100}
            value={formData.full_name}
            onChange={(e) => handleChange('full_name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            required
            maxLength={255}
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Роль *
          </label>
          <select
            value={formData.role}
            onChange={(e) => handleChange('role', e.target.value as 'manager' | 'admin')}
            disabled={!canChangeRole}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${!canChangeRole ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          >
            {EDITABLE_ROLES.map((role) => (
              <option key={role} value={role}>
                {role === 'manager' ? 'Менеджер' : 'Администратор'}
              </option>
            ))}
          </select>
          {!canChangeRole && (
            <p className="mt-1 text-xs text-orange-600">
              Вы не можете изменить роль этого сотрудника
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Нельзя назначить роль Super Admin через этот интерфейс
          </p>
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => handleChange('is_active', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Активен</span>
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            disabled={isLoading}
          >
            Отмена
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
            disabled={isLoading}
          >
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
