'use client';
import { useForm } from 'react-hook-form';
import { StaffFilterFormData } from '../model/types';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';
interface Props { onFilter: (data: StaffFilterFormData) => void; }
export const StaffFilters = ({ onFilter }: Props) => {
  const { register, handleSubmit } = useForm<StaffFilterFormData>({ defaultValues: { search: '', is_active: '', created_at_from: '', created_at_to: '' } });
  return (
    <form onSubmit={handleSubmit(onFilter)} className="flex flex-wrap gap-4 items-end">
      <div className="space-y-1"><Label htmlFor="search">Поиск</Label><Input id="search" placeholder="ФИО или email" {...register('search')} className="w-64" /></div>
      <div className="space-y-1"><Label htmlFor="is_active">Статус</Label><select id="is_active" {...register('is_active')} className="flex h-10 w-40 rounded-md border border-input bg-background px-3 py-2 text-sm"><option value="">Все</option><option value="true">Активные</option><option value="false">Неактивные</option></select></div>
      <div className="space-y-1"><Label htmlFor="created_at_from">С</Label><Input id="created_at_from" type="date" {...register('created_at_from')} /></div>
      <div className="space-y-1"><Label htmlFor="created_at_to">По</Label><Input id="created_at_to" type="date" {...register('created_at_to')} /></div>
      <Button type="submit">Применить</Button>
    </form>
  );
};
