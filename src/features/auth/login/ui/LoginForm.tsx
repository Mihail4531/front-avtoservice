'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';

import { loginSchema, type LoginFormValues } from '../model/schema';
import { useLogin } from '@/entities/session';

export const LoginForm = () => {
    const { mutate, isPending } = useLogin();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    });

    const onSubmit = (data: LoginFormValues) => {
        mutate(data);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 w-full max-w-sm p-6 bg-card rounded-xl shadow-sm border border-border"
        >
            <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="admin@avtoservice.ru"
                    {...register('email')}
                    aria-invalid={!!errors.email}
                    className={cn(errors.email && 'border-destructive focus-visible:ring-destructive')}
                />
                {errors.email && (
                    <p className="text-xs font-medium text-destructive">{errors.email.message}</p>
                )}
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="password">Пароль</Label>
                <div className="relative">
                    <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••"
                        {...register('password')}
                        aria-invalid={!!errors.password}
                        className={cn(
                            'pr-10',
                            errors.password && 'border-destructive focus-visible:ring-destructive'
                        )}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                    >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-xs font-medium text-destructive">{errors.password.message}</p>
                )}
            </div>

            <Button type="submit" disabled={isPending} className="w-full mt-2">
                {isPending ? 'Вход...' : 'Войти'}
            </Button>

            <div className="text-center">
                <Button variant="link" size="sm" type="button">
                    Забыли пароль?
                </Button>
            </div>
        </form>
    );
};
