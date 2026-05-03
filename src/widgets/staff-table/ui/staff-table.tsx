'use client';

import { useStaffList } from '@/features/staff-list/model/use-staff-list';
import { Search, UserPlus, ShieldCheck, ChevronLeft, ChevronRight, Pencil, Calendar, KeyRound } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { cn } from '@/shared/lib/cn';
import { useState } from 'react';
import { Modal } from '@/shared/ui/modal';
import { EditStaffForm } from '@/features/edit-staff/ui/EditStaffForm';
import { CreateStaffForm } from '@/features/create-staff/ui/CreateStaffForm';
import { ChangeStaffPasswordForm } from '@/features/change-staff-password/ui/ChangeStaffPasswordForm';
import { type Staff, createStaffWithPermissions } from '@/entities/staff/model/types';
import { useSessionStore } from '@/entities/session/model/store';

export const StaffTable = () => {
    // Используем лимит 10 по умолчанию
    const [filters, setFilters] = useState({
        search: '',
        is_active: undefined as boolean | undefined,
        created_at_from: '',
        created_at_to: '',
        page: 0
    });
    
    const { data, isLoading, refresh } = useStaffList({ 
        initialLimit: 10,
        filters
    });
    
    const currentUser = useSessionStore((state) => state.user);
    
    // Состояние для модального окна редактирования
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    // Состояние для модального окна смены пароля
    const [changingPasswordStaff, setChangingPasswordStaff] = useState<Staff | null>(null);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    
    // Состояние для модального окна создания
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Расчет общего количества страниц на основе данных из Go
    const totalPages = data ? Math.ceil(data.total / 10) : 0;

    const handleEditClick = (staff: Staff) => {
        setEditingStaff(staff);
        setIsEditModalOpen(true);
    };

    const handleChangePasswordClick = (staff: Staff) => {
        setChangingPasswordStaff(staff);
        setIsPasswordModalOpen(true);
    };

    const handleEditSuccess = () => {
        setIsEditModalOpen(false);
        setEditingStaff(null);
        refresh(); // Обновляем список после редактирования
    };

    const handleChangePasswordSuccess = () => {
        setIsPasswordModalOpen(false);
        setChangingPasswordStaff(null);
    };
    
    const handleCreateSuccess = () => {
        setIsCreateModalOpen(false);
        refresh(); // Обновляем список после создания
    };

    // Проверка возможности редактирования сотрудника
    const canEditStaff = (staff: Staff): boolean => {
        if (!currentUser) return false;
        const staffWithPermissions = createStaffWithPermissions(staff);
        return staffWithPermissions.canBeEditedBy(currentUser.id, currentUser.role as any);
    };

    const handleFilterChange = (newFilters: Partial<typeof filters>) => {
        setFilters(prev => ({ ...prev, ...newFilters, page: newFilters.page !== undefined ? newFilters.page : prev.page }));
    };

    return (
        <div className="space-y-6">
            {/* Панель управления: Поиск + Фильтры статуса + Добавление */}
            <div className="flex flex-col gap-4 bg-white p-4 rounded-xl border border-border shadow-sm">
                <div className="flex flex-col gap-4">
                    {/* Верхняя строка: Поиск + Кнопка Добавить */}
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        {/* Тот самый инпут из image_974c1f.png */}
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Поиск сотрудников..."
                                className="pl-10"
                                value={filters.search}
                                onChange={(e) => handleFilterChange({ search: e.target.value, page: 0 })}
                            />
                        </div>

                        <Button 
                            className="gap-2 font-bold bg-[var(--red)] hover:bg-red-700 w-full md:w-auto"
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            <UserPlus className="w-4 h-4" />
                            Добавить
                        </Button>
                    </div>

                    {/* Нижняя строка: Фильтры */}
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Фильтрация по активности */}
                        <div className="flex bg-slate-50 p-1 rounded-lg border border-border">
                            {[
                                { label: 'Все', value: undefined },
                                { label: 'Активные', value: true },
                                { label: 'Заблокированные', value: false },
                            ].map((tab) => (
                                <button
                                    key={tab.label}
                                    onClick={() => handleFilterChange({ is_active: tab.value, page: 0 })}
                                    className={cn(
                                        "px-3 py-1.5 text-xs font-bold rounded-md transition-all",
                                        filters.is_active === tab.value
                                            ? "bg-white text-slate-900 shadow-sm"
                                            : "text-slate-400 hover:text-slate-600"
                                    )}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Фильтр по дате создания - ОТ */}
                        <div className="relative">
                            <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <input
                                type="date"
                                value={filters.created_at_from}
                                onChange={(e) => handleFilterChange({ created_at_from: e.target.value, page: 0 })}
                                className="pl-8 pr-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 hover:border-slate-300 transition-colors"
                                placeholder="С даты"
                            />
                        </div>

                        {/* Фильтр по дате создания - ДО */}
                        <div className="relative">
                            <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <input
                                type="date"
                                value={filters.created_at_to}
                                onChange={(e) => handleFilterChange({ created_at_to: e.target.value, page: 0 })}
                                className="pl-8 pr-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 hover:border-slate-300 transition-colors"
                                placeholder="По дату"
                            />
                        </div>

                        {/* Кнопка сброса фильтров */}
                        {(filters.search || filters.created_at_from || filters.created_at_to || filters.is_active !== undefined) && (
                            <button
                                onClick={() => setFilters({ search: '', is_active: undefined, role: undefined, created_at_from: '', created_at_to: '', page: 0 })}
                                className="px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                Сбросить
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50 border-b border-border">
                        <tr>
                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Сотрудник</th>
                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Роль</th>
                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Дата регистрации</th>
                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Статус</th>
                            <th className="p-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-sm">
                        {isLoading ? (
                            [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                        ) : data?.items.map((staff) => {
                            const canEdit = canEditStaff(staff);
                            
                            return (
                                <tr key={staff.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 uppercase">
                                                {staff.full_name[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{staff.full_name}</p>
                                                <p className="text-xs text-slate-500">{staff.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-1.5">
                                            <ShieldCheck className={cn(
                                                "w-4 h-4",
                                                staff.role === 'admin' ? "text-blue-500" : "text-slate-400"
                                            )} />
                                            <span className="font-medium text-slate-700 capitalize">{staff.role}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-500 font-medium">
                                        {new Date(staff.created_at).toLocaleDateString('ru-RU')}
                                    </td>
                                    <td className="p-4">
                                        <span className={cn(
                                            "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border",
                                            staff.is_active
                                                ? "bg-green-50 text-green-600 border-green-100"
                                                : "bg-slate-50 text-slate-400 border-slate-100"
                                        )}>
                                            {staff.is_active ? 'Активен' : 'Заблокирован'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-1">
                                            {canEdit ? (
                                                <button 
                                                    onClick={() => handleEditClick(staff)}
                                                    className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-border transition-all"
                                                    title="Редактировать сотрудника"
                                                >
                                                    <Pencil className="w-4 h-4 text-slate-400 hover:text-[var(--red)]" />
                                                </button>
                                            ) : (
                                                <div className="p-2" title="Нет прав для редактирования">
                                                    <span className="text-xs text-slate-300">—</span>
                                                </div>
                                            )}
                                            {canEdit && (
                                                <button 
                                                    onClick={() => handleChangePasswordClick(staff)}
                                                    className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-border transition-all"
                                                    title="Сменить пароль сотрудника"
                                                >
                                                    <KeyRound className="w-4 h-4 text-slate-400 hover:text-[var(--red)]" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* Footer с пагинацией (Лимит и Оффсет) */}
                <div className="flex items-center justify-between p-4 border-t border-border bg-slate-50/30">
                    <div className="text-xs font-bold text-slate-400 uppercase">
                        Всего: {data?.total || 0}
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-xs text-slate-500 font-medium">
                            Страница {(filters.page || 0) + 1} из {totalPages || 1}
                        </span>
                        <div className="flex gap-1">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={filters.page === 0}
                                onClick={() => handleFilterChange({ page: (filters.page || 0) - 1 })}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={(filters.page || 0) + 1 >= totalPages}
                                onClick={() => handleFilterChange({ page: (filters.page || 0) + 1 })}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Модальное окно редактирования сотрудника */}
            {editingStaff && (
                <Modal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setEditingStaff(null);
                    }}
                    title="Редактирование сотрудника"
                >
                    <EditStaffForm 
                        staff={editingStaff} 
                        onSuccess={handleEditSuccess}
                    />
                </Modal>
            )}
            
            {/* Модальное окно смены пароля сотрудника */}
            {changingPasswordStaff && (
                <Modal
                    isOpen={isPasswordModalOpen}
                    onClose={() => {
                        setIsPasswordModalOpen(false);
                        setChangingPasswordStaff(null);
                    }}
                    title={`Смена пароля: ${changingPasswordStaff.full_name}`}
                >
                    <ChangeStaffPasswordForm 
                        staffId={changingPasswordStaff.id} 
                        onSuccess={handleChangePasswordSuccess}
                    />
                </Modal>
            )}
            
            {/* Модальное окно создания сотрудника */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Создание сотрудника"
            >
                <CreateStaffForm onSuccess={handleCreateSuccess} />
            </Modal>
        </div>
    );
};

const SkeletonRow = () => (
    <tr className="animate-pulse">
        <td className="p-4"><div className="h-10 w-40 bg-slate-100 rounded-lg" /></td>
        <td className="p-4"><div className="h-6 w-20 bg-slate-100 rounded-lg" /></td>
        <td className="p-4"><div className="h-6 w-24 bg-slate-100 rounded-lg" /></td>
        <td className="p-4"><div className="h-6 w-16 bg-slate-100 rounded-full" /></td>
        <td className="p-4"><div className="h-8 w-8 bg-slate-100 rounded-lg" /></td>
    </tr>
);