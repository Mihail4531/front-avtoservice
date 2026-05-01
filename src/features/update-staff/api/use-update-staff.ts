import { useMutation, useQueryClient } from '@tanstack/react-query';
import { staffApi, UpdateStaffRequest } from '@/entities/staff';
import { ApiError } from '@/shared/api/errors';
import { toast } from 'sonner';
export const useUpdateStaff = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateStaffRequest) => staffApi.update(id, data),
    onSuccess: () => { toast.success('Данные обновлены'); queryClient.invalidateQueries({ queryKey: ['staffs', 'list'] }); queryClient.invalidateQueries({ queryKey: ['staff', id] }); },
    onError: (error: ApiError) => {
      if (error.isConflict()) toast.error('Email уже занят');
      else if (error.isForbidden()) toast.error('Недостаточно прав');
      else toast.error(error.message || 'Ошибка обновления');
    },
  });
};
