import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/entities/auth';
import { ApiError } from '@/shared/api/errors';
import { toast } from 'sonner';
export const useLogin = () => {
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: () => { toast.success('Вход выполнен'); window.location.href = '/me/profile'; },
    onError: (error: ApiError) => {
      if (error.isUnauthorized() || error.isBadRequest()) toast.error('Неверный email или пароль');
      else toast.error(error.message || 'Ошибка входа');
    },
  });
};
