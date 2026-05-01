'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateMeSchema, UpdateMeFormData } from '../model/schema';
import { useUpdateMeProfile } from '../api/use-update-me-profile';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';

interface Props {
  defaultValues?: Partial<UpdateMeFormData>;
}

export const UpdateMeProfileForm = ({ defaultValues }: Props) => {
  const { mutate, isPending } = useUpdateMeProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateMeFormData>({
    resolver: zodResolver(updateMeSchema),
    defaultValues: {
      full_name: '',
      email: '',
      ...defaultValues,
    },
  });

  const onSubmit = (data: UpdateMeFormData) => mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <div className="space-y-2">
        <Label htmlFor="full_name">ФИО</Label>
        <Input
          id="full_name"
          placeholder="Иванов Иван Иванович"
          {...register('full_name')}
          className="bg-gray-50 border-gray-200 focus:bg-white"
        />
        {errors.full_name && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.full_name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="ivan@avtoservice.ru"
          {...register('email')}
          className="bg-gray-50 border-gray-200 focus:bg-white"
        />
        {errors.email && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={isPending} className="shadow-sm">
          {isPending ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Сохранение...
            </span>
          ) : 'Сохранить изменения'}
        </Button>
      </div>
    </form>
  );
};