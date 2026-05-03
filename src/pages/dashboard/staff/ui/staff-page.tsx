import { StaffTable } from '@/widgets/staff-table';
import { CreateStaffForm } from '@/features/create-staff';
import type { Staff, StaffRole } from '@/entities/staff';
import { useState, useEffect } from 'react';

// Моковые данные для текущего пользователя (в реальном приложении брать из session store)
const CURRENT_USER: { id: number; role: StaffRole } = {
  id: 1,
  role: 'admin' as StaffRole, // или 'super_admin' для полного доступа
};

/**
 * Страница управления персоналом
 * Функционал:
 * - Просмотр списка сотрудников
 * - Создание нового сотрудника (кнопка "Добавить")
 * - Редактирование сотрудника (кнопка рядом с пользователем)
 * 
 * Бизнес-логика полностью соответствует backend:
 * - Нельзя создать super_admin
 * - Нельзя редактировать себя, super_admin, admin другому admin
 */
export default function StaffPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const loadStaffList = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/dashboard/admin/staffs`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch staff list');
      }

      const data = await response.json();
      
      // Backend возвращает { items: [], total, limit, offset }
      if (data && Array.isArray(data.items)) {
        setStaffList(data.items);
      } else if (Array.isArray(data)) {
        setStaffList(data);
      } else {
        setStaffList([]);
      }
    } catch (error) {
      console.error('Failed to load staff list:', error);
      setStaffList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStaffList();
  }, []);

  const handleCreateSuccess = () => {
    loadStaffList();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Сотрудники</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <span className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Добавить сотрудника</span>
          </span>
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <StaffTable
          staffList={staffList}
          currentUserId={CURRENT_USER.id}
          currentUserRole={CURRENT_USER.role}
          onRefresh={loadStaffList}
        />
      </div>

      <CreateStaffForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
