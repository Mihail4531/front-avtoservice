'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileSchema, type UpdateProfileSchema } from '../model/schema';
import { useUpdateMe } from '@/entities/staff';
import { Button } from '@/shared/ui/button';
import { User as UserIcon, Mail } from 'lucide-react';

interface Props {
    initialData: UpdateProfileSchema;
    onSuccess?: () => void;
}

export const ProfileForm = ({ initialData, onSuccess }: Props) => {
    const { mutate: updateProfile, isPending } = useUpdateMe();

    const { register, handleSubmit, formState: { errors } } = useForm<UpdateProfileSchema>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: initialData,
    });

    const onSubmit = (data: UpdateProfileSchema) => {
        updateProfile(data, {
            onSuccess: () => onSuccess?.(),
        });
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
                            className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all font-semibold text-slate-900 ${errors.full_name ? 'border-red-500' : 'border-slate-200 focus:border-[var(--red)]'
                                }`}
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
                            className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all font-semibold text-slate-900 ${errors.email ? 'border-red-500' : 'border-slate-200 focus:border-[var(--red)]'
                                }`}
                        />
                    </div>
                    {errors.email && (
                        <p className="text-red-500 text-[10px] font-bold uppercase ml-1">
                            {errors.email.message}
                        </p>
                    )}
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