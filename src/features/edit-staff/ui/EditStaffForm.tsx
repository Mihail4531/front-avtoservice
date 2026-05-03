'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { editStaffSchema, type EditStaffSchema } from '../model/schema';
import { useUpdateStaff } from '@/entities/staff/hooks/use-update';
import { Button } from '@/shared/ui/button';
import { User as UserIcon, Mail, Shield, CheckCircle2, XCircle } from 'lucide-react';
import { type Staff, STAFF_ROLES } from '@/entities/staff/model/types';
import { cn } from '@/shared/lib/cn';

interface Props {
    staff: Staff;
    onSuccess?: () => void;
}

export const EditStaffForm = ({ staff, onSuccess }: Props) => {
    const { mutate: updateStaff, isPending } = useUpdateStaff();

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

    const onSubmit = (data: EditStaffSchema) => {
        updateStaff(
            { staffId: staff.id, data },
            {
                onSuccess: () => onSuccess?.(),
            }
        );
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                            className={cn(
                                "w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all font-semibold text-slate-900 appearance-none cursor-pointer",
                                errors.role ? 'border-red-500' : 'border-slate-200 focus:border-[var(--red)]'
                            )}
                        >
                            {STAFF_ROLES.map((role) => (
                                <option key={role} value={role}>
                                    {role === 'super_admin' ? 'Super Admin' : role.charAt(0).toUpperCase() + role.slice(1)}
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
