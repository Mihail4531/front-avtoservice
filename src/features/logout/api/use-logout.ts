import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/entities/auth';
import { toast } from 'sonner';
export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => { queryClient.clear(); toast.success('Вы вышли из системы'); window.location.href = '/login'; },
    onError: () => { queryClient.clear(); window.location.href = '/login'; },
  });
};
