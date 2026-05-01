'use client';
import { useState } from 'react';
import { ListStaffsParams, mapStaffResponses } from '@/entities/staff';
import { useListStaffs, StaffFilters, StaffFilterFormData } from '@/features/list-staffs';
import { CreateStaffForm } from '@/features/create-staff';
import { StaffsTable } from '@/widgets/staffs-table';

export const AdminStaffsPage = () => {
  const [filters, setFilters] = useState<ListStaffsParams>({ limit: 20, offset: 0 });
  const { data, isLoading } = useListStaffs(filters);

  const handleFilter = (formData: StaffFilterFormData) => {
    setFilters({
      limit: 20,
      offset: 0,
      search: formData.search || undefined,
      is_active: formData.is_active === '' ? undefined : formData.is_active === 'true',
      created_at_from: formData.created_at_from || undefined,
      created_at_to: formData.created_at_to || undefined,
    });
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold mb-4">Новый сотрудник</h2>
        <CreateStaffForm />
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Список сотрудников</h2>
        <StaffFilters onFilter={handleFilter} />
        <div className="mt-4">
          {isLoading ? (
            <p>Загрузка...</p>
          ) : (
            <>
              <StaffsTable staffs={mapStaffResponses(data?.items ?? [])} />
              {data && data.total > 0 && (
                <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                  <span>Показано {data.items.length} из {data.total}</span>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 border rounded disabled:opacity-50"
                      disabled={filters.offset === 0}
                      onClick={() => setFilters((prev) => ({ ...prev, offset: Math.max(0, (prev.offset ?? 0) - (prev.limit ?? 20)) }))}
                    >
                      Назад
                    </button>
                    <button
                      className="px-3 py-1 border rounded disabled:opacity-50"
                      disabled={(filters.offset ?? 0) + (filters.limit ?? 20) >= data.total}
                      onClick={() => setFilters((prev) => ({ ...prev, offset: (prev.offset ?? 0) + (prev.limit ?? 20) }))}
                    >
                      Вперёд
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};