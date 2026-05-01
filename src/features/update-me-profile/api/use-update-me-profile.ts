import { useMutation, useQueryClient } from '@tanstack/react-query';
import { staffApi, UpdateMeRequest } from '@/entities/staff';
import { ApiError } from '@/shared/api/errors';
import { toast } from 'sonner';
export const UPDATE_ME_PROFILE_KEY = ['staff', 'me'] as const;
export const useUpdateMeProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateMeRequest) => staffApi.updateMe(data),
    onSuccess: () => { toast.success('Профиль обновлён'); queryClient.invalidateQueries({ queryKey: UPDATE_ME_PROFILE_KEY }); },
    onError: (error: ApiError) => {
      if (error.isConflict()) toast.error('Этот email уже используется');
      else if (error.isBadRequest()) toast.error('Некорректные данные');
      else toast.error(error.message || 'Не удалось обновить профиль');
    },
  });
};
