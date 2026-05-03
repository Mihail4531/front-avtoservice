import { useState, useCallback } from 'react';
import { staffApi } from '../api';
import type { UpdateStaffInput, Staff } from '../model';

interface UseUpdateStaffResult {
  isLoading: boolean;
  error: string | null;
  updateStaff: (id: number, data: UpdateStaffInput) => Promise<Staff | null>;
  resetError: () => void;
}

/**
 * Хук для обновления сотрудника
 * Используется в features/edit-staff
 */
export function useUpdateStaff(): UseUpdateStaffResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStaff = useCallback(async (id: number, data: UpdateStaffInput): Promise<Staff | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const staff = await staffApi.update(id, data);
      return staff;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при обновлении сотрудника';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return { isLoading, error, updateStaff, resetError };
}

/**
 * Хук для обновления текущего пользователя (через /me endpoint)
 * Используется в features/update-me-profile
 */
export function useUpdateMe() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = (data: { full_name: string; email: string }, options?: { onSuccess?: () => void }) => {
    setIsPending(true);
    setError(null);

    // В реальном проекте здесь будет вызов API для /me endpoint
    // Пока используем заглушку
    setTimeout(() => {
      setIsPending(false);
      if (options?.onSuccess) {
        options.onSuccess();
      }
    }, 500);
  };

  return { mutate, isPending, error };
}
