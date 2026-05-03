'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '@/shared/api/api';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { cn } from '@/shared/lib/cn';
import { changeStaffPasswordSchema, type ChangeStaffPasswordFormValues } from '../model/schema';

interface Props {
    staffId: number;
    onSuccess?: () => void;
}

export const ChangeStaffPasswordForm = ({ staffId, onSuccess }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ChangeStaffPasswordFormValues>({
        resolver: zodResolver(changeStaffPasswordSchema)
    });

    const onSubmit = async (values: ChangeStaffPasswordFormValues) => {
        setIsLoading(true);
        setStatus(null);
        try {
            // Поле соответствует структуре ChangeStaffPasswordRequest на Go (password)
            await api.post(`/dashboard/admin/staffs/${staffId}/password`, {
                password: values.password
            });

            setStatus({ type: 'success', msg: 'Пароль сотрудника успешно изменен.' });
            reset();
            onSuccess?.();
        } catch (error: any) {
            setStatus({
                type: 'error',
                msg: error.response?.data?.message || 'Ошибка при смене пароля'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {status && (
                <div className={cn(
                    "p-4 rounded-xl border flex items-start gap-3",
                    status.type === 'success' 
                        ? "bg-green-50 border-green-200" 
                        : "bg-red-50 border-red-200"
                )}>
                    {status.type === 'success' 
                        ? <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        : <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    }
                    <p className={cn(
                        "text-sm font-medium",
                        status.type === 'success' ? "text-green-700" : "text-red-700"
                    )}>
                        {status.msg}
                    </p>
                </div>
            )}

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
                autoComplete="off"
            >
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <Label className="text-slate-500 text-xs font-bold uppercase tracking-wider">Новый пароль</Label>
                        <Input
                            {...register('password')}
                            type="password"
                            placeholder="Минимум 6 символов"
                            autoComplete="new-password"
                        />
                        {errors.password && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.password.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-slate-500 text-xs font-bold uppercase tracking-wider">Подтверждение</Label>
                        <Input
                            {...register('confirm_password')}
                            type="password"
                            placeholder="••••••••"
                            autoComplete="new-password"
                        />
                        {errors.confirm_password && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.confirm_password.message}</p>}
                    </div>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full font-bold shadow-lg shadow-red-100 gap-2 bg-[var(--red)] hover:bg-red-700">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                    Сменить пароль
                </Button>
            </form>
        </div>
    );
};
