import { useState } from 'react';
import type { Staff } from '../../../entities/staff';
import { createStaffWithPermissions } from '../../../entities/staff';
import { EditStaffForm } from '../../../features/edit-staff';

interface StaffTableProps {
  staffList: Staff[];
  currentUserId: number | null;
  currentUserRole: Staff['role'] | null;
  onRefresh?: () => void;
}

/**
 * Таблица сотрудников с кнопкой редактирования
 * Бизнес-логика отображения кнопки редактирования:
 * - Кнопка показывается только если у пользователя есть права на редактирование
 * - Если прав нет - показывается "—"
 */
export function StaffTable({ 
  staffList, 
  currentUserId, 
  currentUserRole,
  onRefresh 
}: StaffTableProps) {
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditClick = (staff: Staff) => {
    setEditingStaff(staff);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingStaff(null);
  };

  const handleEditSuccess = () => {
    onRefresh?.();
    handleCloseEditModal();
  };

  const getRoleBadgeColor = (role: Staff['role']) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: Staff['role']) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'admin':
        return 'Администратор';
      case 'manager':
        return 'Менеджер';
      default:
        return role;
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ФИО
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Роль
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {staffList.map((staff) => {
              const staffWithPermissions = createStaffWithPermissions(staff);
              const canEdit = staffWithPermissions.canBeEditedBy(currentUserId, currentUserRole);

              return (
                <tr key={staff.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{staff.full_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{staff.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(staff.role)}`}>
                      {getRoleLabel(staff.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      staff.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {staff.is_active ? 'Активен' : 'Неактивен'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {canEdit ? (
                      <button
                        onClick={() => handleEditClick(staff)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Редактировать"
                      >
                        <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span className="ml-1">Изменить</span>
                      </button>
                    ) : (
                      <span className="text-gray-300" title="Нет прав для редактирования">
                        —
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {editingStaff && (
        <EditStaffForm
          staff={editingStaff}
          currentUserId={currentUserId}
          currentUserRole={currentUserRole}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
}
