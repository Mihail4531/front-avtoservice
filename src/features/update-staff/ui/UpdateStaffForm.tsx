'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateStaffSchema, UpdateStaffFormData } from '../model/schema';
import { useUpdateStaff } from '../api/use-update-staff';
import { Staff } from '@/entities/staff';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';
interface Props { staff: Staff; }
export const UpdateStaffForm = ({ staff }: Props) => {
  const { mutate, isPending } = useUpdateStaff(staff.id);
  const { register, handleSubmit, formState: { errors } } = useForm<UpdateStaffFormData>({ resolver: zodResolver(updateStaffSchema), defaultValues: { full_name: staff.full_name, email: staff.email, role: staff.role, is_active: staff.is_active } });
  const onSubmit = (data: UpdateStaffFormData) => mutate(data);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2"><Label htmlFor="full_name">ФИО</Label><Input id="full_name" {...register('full_name')} />{errors.full_name && <p className="text-sm text-red-500">{errors.full_name.message}</p>}</div>
      <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" {...register('email')} />{errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}</div>
      <div className="space-y-2"><Label htmlFor="role">Роль</Label><select id="role" {...register('role')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"><option value="manager">Менеджер</option><option value="admin">Администратор</option><option value="super_admin">Супер-администратор</option></select>{errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}</div>
      <div className="flex items-center space-x-2"><input id="is_active" type="checkbox" {...register('is_active')} className="h-4 w-4 rounded border-gray-300" /><Label htmlFor="is_active">Активен</Label></div>
      <Button type="submit" disabled={isPending}>{isPending ? 'Сохранение...' : 'Сохранить'}</Button>
    </form>
  );
};
