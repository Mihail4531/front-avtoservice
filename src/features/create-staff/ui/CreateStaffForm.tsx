'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createStaffSchema, type CreateStaffSchema } from '../model/schema';
import { useCreateStaff } from '@/entities/staff/hooks/use-update';
import { Button } from '@/shared/ui/button';
import { User as UserIcon, Mail, Shield, Lock } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

interface Props {
    onSuccess?: () => void;
}

export const CreateStaffForm = ({ onSuccess }: Props) => {
    const { mutate: createStaff, isPending, error } = useCreateStaff();

    // Доступные роли для выбора (без super_admin)
    const availableRoles = ['manager', 'admin'] as const;

    const { register, handleSubmit, formState: { errors } } = useForm<CreateStaffSchema>({
        resolver: zodResolver(createStaffSchema),
        defaultValues: {
            full_name: '',
            email: '',
            password: '',
            role: 'manager',
        },
    });

    const onSubmit = (data: CreateStaffSchema) => {
        createStaff(data, {
            onSuccess: () => onSuccess?.(),
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Информация о бизнес-ограничениях */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-xs text-slate-500 font-medium">
                    <strong>Обратите внимание:</strong> Нельзя создать сотрудника с ролью Super Admin.
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
                            placeholder="Иван Иванов"
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
                            placeholder="example@mail.com"
                            type="email"
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

                {/* Поле Пароль */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                        Пароль
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            {...register('password')}
                            placeholder="••••••••"
                            type="password"
                            className={cn(
                                "w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all font-semibold text-slate-900",
                                errors.password ? 'border-red-500' : 'border-slate-200 focus:border-[var(--red)]'
                            )}
                        />
                    </div>
                    {errors.password && (
                        <p className="text-red-500 text-[10px] font-bold uppercase ml-1">
                            {errors.password.message}
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
                            className={cn(
                                "w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all font-semibold text-slate-900 appearance-none cursor-pointer",
                                errors.role ? 'border-red-500' : 'border-slate-200 focus:border-[var(--red)]'
                            )}
                        >
                            {availableRoles.map((role) => (
                                <option key={role} value={role}>
                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                    {errors.role && (
                        <p className="text-red-500 text-[10px] font-bold uppercase ml-1">
                            {errors.role.message}
                        </p>
                    )}
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-sm text-red-600 font-medium">
                        {(error as any)?.response?.data?.message || 'Произошла ошибка при создании'}
                    </p>
                </div>
            )}

            <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-[var(--red)] hover:bg-red-600 text-white font-bold py-6 rounded-xl shadow-lg shadow-red-100 transition-all active:scale-[0.98]"
            >
                {isPending ? 'Создание...' : 'Создать сотрудника'}
            </Button>
        </form>
    );
};
