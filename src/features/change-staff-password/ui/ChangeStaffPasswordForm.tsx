'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changeStaffPasswordSchema, ChangeStaffPasswordFormData } from '../model/schema';
import { useChangeStaffPassword } from '../api/use-change-staff-password';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';
interface Props { staffId: number; }
export const ChangeStaffPasswordForm = ({ staffId }: Props) => {
  const { mutate, isPending } = useChangeStaffPassword(staffId);
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ChangeStaffPasswordFormData>({ resolver: zodResolver(changeStaffPasswordSchema) });
  const onSubmit = (data: ChangeStaffPasswordFormData) => { mutate(data.password, { onSuccess: () => { reset(); setShowForm(false); } }); };
  if (!showForm) return <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>Сменить пароль</Button>;
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 max-w-xs">
      <div className="space-y-1"><Label htmlFor="password">Новый пароль</Label><Input id="password" type="password" {...register('password')} />{errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}</div>
      <div className="flex gap-2"><Button type="submit" size="sm" disabled={isPending}>{isPending ? '...' : 'OK'}</Button><Button type="button" size="sm" variant="ghost" onClick={() => setShowForm(false)}>Отмена</Button></div>
    </form>
  );
};
