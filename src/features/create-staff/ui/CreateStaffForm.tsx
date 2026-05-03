import React, { useState } from 'react';
import { useCreateStaff } from '../../../entities/staff';
import type { CreateStaffInput } from '../../../entities/staff';
import { EDITABLE_ROLES } from '../../../entities/staff';
import { Modal } from '../../../shared/ui/modal';

interface CreateStaffFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * Форма создания сотрудника
 * Бизнес-логика:
 * - Можно создать только manager или admin (super_admin исключен)
 * - Пароль минимум 6 символов (валидация на backend)
 */
export function CreateStaffForm({ isOpen, onClose, onSuccess }: CreateStaffFormProps) {
  const { isLoading, error, createStaff, resetError } = useCreateStaff();
  
  const [formData, setFormData] = useState<CreateStaffInput>({
    full_name: '',
    email: '',
    password: '',
    role: 'manager',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetError();

    const result = await createStaff(formData);
    
    if (result) {
      onSuccess?.();
      onClose();
      setFormData({
        full_name: '',
        email: '',
        password: '',
        role: 'manager',
      });
    }
  };

  const handleChange = (field: keyof CreateStaffInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Создание сотрудника"
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
            placeholder="Иванов Иван Иванович"
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
            placeholder="example@company.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Пароль *
          </label>
          <input
            type="password"
            required
            minLength={6}
            maxLength={200}
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Минимум 6 символов"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Роль *
          </label>
          <select
            value={formData.role}
            onChange={(e) => handleChange('role', e.target.value as 'manager' | 'admin')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {EDITABLE_ROLES.map((role) => (
              <option key={role} value={role}>
                {role === 'manager' ? 'Менеджер' : 'Администратор'}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Нельзя создать роль Super Admin через этот интерфейс
          </p>
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
            {isLoading ? 'Создание...' : 'Создать'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
