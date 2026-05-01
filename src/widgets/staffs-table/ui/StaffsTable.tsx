'use client';
import { useState } from 'react';
import { Staff } from '@/entities/staff';
import { UpdateStaffForm } from '@/features/update-staff';
import { ChangeStaffPasswordForm } from '@/features/change-staff-password';
import { Button } from '@/shared/ui/button';
interface Props { staffs: Staff[]; }
export const StaffsTable = ({ staffs }: Props) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  if (staffs.length === 0) return <p className="text-gray-500">Сотрудники не найдены</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead><tr className="border-b"><th className="text-left py-2 px-4">ID</th><th className="text-left py-2 px-4">ФИО</th><th className="text-left py-2 px-4">Email</th><th className="text-left py-2 px-4">Роль</th><th className="text-left py-2 px-4">Статус</th><th className="text-left py-2 px-4">Действия</th></tr></thead>
        <tbody>
          {staffs.map((staff) => (
            <tr key={staff.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{staff.id}</td>
              <td className="py-2 px-4">{staff.full_name}</td>
              <td className="py-2 px-4">{staff.email}</td>
              <td className="py-2 px-4">{staff.role}</td>
              <td className="py-2 px-4"><span className={`inline-flex px-2 py-1 rounded-full text-xs ${staff.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{staff.is_active ? 'Активен' : 'Неактивен'}</span></td>
              <td className="py-2 px-4">
                {editingId === staff.id ? (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-md min-w-[300px]">
                    <UpdateStaffForm staff={staff} />
                    <ChangeStaffPasswordForm staffId={staff.id} />
                    <button onClick={() => setEditingId(null)} className="text-sm text-gray-500 hover:text-gray-700">Закрыть</button>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setEditingId(staff.id)}>Редактировать</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
