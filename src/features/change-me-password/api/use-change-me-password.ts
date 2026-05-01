import { useMutation } from '@tanstack/react-query';
import { staffApi } from '@/entities/staff';
import { ApiError } from '@/shared/api/errors';
import { toast } from 'sonner';
export const useChangeMePassword = () => {
  return useMutation({
    mutationFn: staffApi.changePassword,
    onSuccess: () => { toast.success('Пароль изменён'); window.location.href = '/login'; },
    onError: (error: ApiError) => {
      if (error.isBadRequest()) toast.error('Неверный старый пароль');
      else toast.error(error.message || 'Ошибка смены пароля');
    },
  });
};
