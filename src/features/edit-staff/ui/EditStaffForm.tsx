'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { editStaffSchema, type EditStaffSchema } from '../model/schema';
import { useUpdateStaff } from '@/entities/staff/hooks/use-update';
import { Button } from '@/shared/ui/button';
import { User as UserIcon, Mail, Shield, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { type Staff, STAFF_ROLES, createStaffWithPermissions } from '@/entities/staff/model/types';
import { cn } from '@/shared/lib/cn';
import { useSessionStore } from '@/entities/session/model/store';

interface Props {
    staff: Staff;
    onSuccess?: () => void;
}

export const EditStaffForm = ({ staff, onSuccess }: Props) => {
    const { mutate: updateStaff, isPending, error } = useUpdateStaff();
    const currentUser = useSessionStore((state) => state.user);

    // Создаем объект с правами доступа для проверки бизнес-логики
    const staffWithPermissions = createStaffWithPermissions(staff);

    // Проверяем, может ли текущий пользователь редактировать этого сотрудника
    const canEdit = currentUser 
        ? staffWithPermissions.canBeEditedBy(currentUser.id, currentUser.role as any)
        : false;

    // Проверяем, можно ли менять роль на super_admin (всегда false по бизнес-логике)
    const canPromoteToSuperAdmin = staffWithPermissions.canBePromotedToSuperAdmin();

    // Фильтруем доступные роли для выбора
    const availableRoles = STAFF_ROLES.filter(role => {
        // Если пытаемся редактировать супер-админа или повышать до супер-админа - блокируем
        if (role === 'super_admin') return false;
        return true;
    });

    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<EditStaffSchema>({
        resolver: zodResolver(editStaffSchema),
        defaultValues: {
            full_name: staff.full_name,
            email: staff.email,
            role: staff.role,
            is_active: staff.is_active,
        },
    });

    const isActive = watch('is_active');
    const selectedRole = watch('role');

    const onSubmit = (data: EditStaffSchema) => {
        // Дополнительная проверка на клиенте перед отправкой
        if (!canEdit) {
            console.error('У вас нет прав для редактирования этого сотрудника');
            return;
        }

        // Блокируем попытку установить роль super_admin
        if (data.role === 'super_admin') {
            console.error('Нельзя назначить роль super_admin через этот эндпоинт');
            return;
        }

        updateStaff(
            { staffId: staff.id, data },
            {
                onSuccess: () => onSuccess?.(),
            }
        );
    };

    // Если у пользователя нет прав на редактирование - показываем сообщение
    if (!canEdit) {
        return (
            <div className="space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-4">
                    <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-bold text-red-800 mb-1">Нет прав доступа</h3>
                        <p className="text-sm text-red-600">
                            Вы не можете редактировать этого сотрудника согласно правилам системы.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Предупреждение о бизнес-ограничениях */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-xs text-slate-500 font-medium">
                    <strong>Обратите внимание:</strong> Нельзя назначить роль Super Admin и редактировать суперадминов через эту форму.
                </p>
            </div>

            <div className="space-y-5">
                {/* Поле Имя */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                        Полное имя
                    </label>
                    <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            {...register('full_name')}
                            className={cn(
                                "w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all font-semibold text-slate-900",
                                errors.full_name ? 'border-red-500' : 'border-slate-200 focus:border-[var(--red)]'
                            )}
                        />
                    </div>
                    {errors.full_name && (
                        <p className="text-red-500 text-[10px] font-bold uppercase ml-1">
                            {errors.full_name.message}
                        </p>
                    )}
                </div>

                {/* Поле Email */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                        Email адрес
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            {...register('email')}
                            className={cn(
                                "w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all font-semibold text-slate-900",
                                errors.email ? 'border-red-500' : 'border-slate-200 focus:border-[var(--red)]'
                            )}
                        />
                    </div>
                    {errors.email && (
                        <p className="text-red-500 text-[10px] font-bold uppercase ml-1">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {/* Поле Роль */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                        Роль
                    </label>
                    <div className="relative">
                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                            {...register('role')}
                            disabled={!staffWithPermissions.canHaveRoleChangedBy(currentUser?.role as any)}
                            className={cn(
                                "w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all font-semibold text-slate-900 appearance-none cursor-pointer",
                                errors.role ? 'border-red-500' : 'border-slate-200 focus:border-[var(--red)]',
                                !staffWithPermissions.canHaveRoleChangedBy(currentUser?.role as any) && 'opacity-50 cursor-not-allowed bg-slate-100'
                            )}
                        >
                            {availableRoles.map((role) => (
                                <option key={role} value={role}>
                                    {role === 'super_admin' ? 'Super Admin' : role.charAt(0).toUpperCase() + role.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                    {!staffWithPermissions.canHaveRoleChangedBy(currentUser?.role as any) && (
                        <p className="text-slate-400 text-[10px] font-bold uppercase ml-1">
                            Вы не можете изменить роль этого сотрудника
                        </p>
                    )}
                    {errors.role && (
                        <p className="text-red-500 text-[10px] font-bold uppercase ml-1">
                            {errors.role.message}
                        </p>
                    )}
                </div>

                {/* Поле Статус (Активен/Заблокирован) */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                        Статус аккаунта
                    </label>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setValue('is_active', true)}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold transition-all",
                                isActive === true
                                    ? "bg-green-50 border-green-500 text-green-700"
                                    : "bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300"
                            )}
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Активен
                        </button>
                        <button
                            type="button"
                            onClick={() => setValue('is_active', false)}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold transition-all",
                                isActive === false
                                    ? "bg-red-50 border-red-500 text-red-700"
                                    : "bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300"
                            )}
                        >
                            <XCircle className="w-4 h-4" />
                            Заблокирован
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-sm text-red-600 font-medium">
                        {(error as any)?.response?.data?.message || 'Произошла ошибка при сохранении'}
                    </p>
                </div>
            )}

            <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-[var(--red)] hover:bg-red-600 text-white font-bold py-6 rounded-xl shadow-lg shadow-red-100 transition-all active:scale-[0.98]"
            >
                {isPending ? 'Сохранение...' : 'Сохранить изменения'}
            </Button>
        </form>
    );
};
