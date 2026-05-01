import { useMutation, useQueryClient } from '@tanstack/react-query';
import { staffApi, CreateStaffRequest } from '@/entities/staff';
import { ApiError } from '@/shared/api/errors';
import { toast } from 'sonner';
export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStaffRequest) => staffApi.create(data),
    onSuccess: () => { toast.success('Сотрудник создан'); queryClient.invalidateQueries({ queryKey: ['staffs', 'list'] }); },
    onError: (error: ApiError) => {
      if (error.isConflict()) toast.error('Сотрудник с таким email уже существует');
      else if (error.isForbidden()) toast.error('Недостаточно прав');
      else toast.error(error.message || 'Не удалось создать сотрудника');
    },
  });
};
