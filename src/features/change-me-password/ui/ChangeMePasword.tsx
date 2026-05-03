'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldCheck, KeyRound, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '@/shared/api/api';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { cn } from '@/shared/lib/cn';
import { changePasswordSchema, type ChangePasswordFormValues } from '../model/schema';

export const SecurityTab = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(changePasswordSchema)
    });

    const onSubmit = async (values: ChangePasswordFormValues) => {
        setIsLoading(true);
        setStatus(null);
        try {
            // Поля соответствуют твоей структуре ChangePasswordRequest на Go
            await api.post('/dashboard/me/password', {
                old_password: values.old_password,
                password: values.password
            });

            setStatus({ type: 'success', msg: 'Пароль успешно изменен.' });
            reset();
        } catch (error: any) {
            setStatus({
                type: 'error',
                msg: error.response?.data?.message || 'Ошибка: проверьте текущий пароль'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden animate-in fade-in duration-500">
            {/* ... Header ... */}

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-8 max-w-md space-y-6"
                autoComplete="off" // 1. Отключаем автозаполнение для всей формы
            >
                {/* ... Status messages ... */}

                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <Label className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Текущий пароль</Label>
                        <Input
                            {...register('old_password')}
                            type="password"
                            placeholder="••••••••"
                            autoComplete="current-password" // 2. Подсказываем браузеру, что это текущий пароль
                        />
                        {errors.old_password && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.old_password.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Новый пароль</Label>
                        <Input
                            {...register('password')}
                            type="password"
                            placeholder="Минимум 6 символов"
                            autoComplete="new-password" // 3. Указываем, что это новый пароль (браузер перестанет подставлять старый)
                        />
                        {errors.password && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.password.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Подтверждение</Label>
                        <Input
                            {...register('confirm_password')}
                            type="password"
                            placeholder="••••••••"
                            autoComplete="new-password" // 4. Также для подтверждения
                        />
                        {errors.confirm_password && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.confirm_password.message}</p>}
                    </div>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full font-bold shadow-lg shadow-red-100 gap-2">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                    Обновить пароль
                </Button>
            </form>
        </div>
    );
};