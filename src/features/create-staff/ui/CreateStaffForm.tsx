'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createStaffSchema, CreateStaffFormData } from '../model/schema';
import { useCreateStaff } from '../api/use-create-staff';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';
export const CreateStaffForm = () => {
  const { mutate, isPending } = useCreateStaff();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateStaffFormData>({ resolver: zodResolver(createStaffSchema) });
  const onSubmit = (data: CreateStaffFormData) => { mutate(data, { onSuccess: () => reset() }); };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <div className="space-y-2"><Label htmlFor="full_name">ФИО</Label><Input id="full_name" {...register('full_name')} />{errors.full_name && <p className="text-sm text-red-500">{errors.full_name.message}</p>}</div>
      <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" {...register('email')} />{errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}</div>
      <div className="space-y-2"><Label htmlFor="password">Пароль</Label><Input id="password" type="password" {...register('password')} />{errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}</div>
      <div className="space-y-2"><Label htmlFor="role">Роль</Label><select id="role" {...register('role')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"><option value="">Выберите роль</option><option value="manager">Менеджер</option><option value="admin">Администратор</option></select>{errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}</div>
      <Button type="submit" disabled={isPending}>{isPending ? 'Создание...' : 'Создать сотрудника'}</Button>
    </form>
  );
};
