import { useMutation, useQueryClient } from '@tanstack/react-query';
import { staffApi } from '@/entities/staff';
import { ApiError } from '@/shared/api/errors';
import { toast } from 'sonner';
export const useChangeStaffPassword = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (password: string) => staffApi.changeStaffPassword(id, { password }),
    onSuccess: () => { toast.success('Пароль изменён'); queryClient.invalidateQueries({ queryKey: ['staff', id] }); },
    onError: (error: ApiError) => {
      if (error.isForbidden()) toast.error('Недостаточно прав');
      else toast.error(error.message || 'Ошибка смены пароля');
    },
  });
};
