import { useState, useCallback } from 'react';
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
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/dashboard/admin/staffs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка при обновлении сотрудника');
      }

      const staff = await response.json();
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

  const mutate = async (data: { full_name: string; email: string }, options?: { onSuccess?: () => void }) => {
    setIsPending(true);
    setError(null);

    try {
      // Вызываем реальный API для обновления профиля текущего пользователя
      // Backend endpoint: PUT /dashboard/me
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/dashboard/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка при обновлении профиля');
      }
      
      if (options?.onSuccess) {
        options.onSuccess();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при обновлении профиля';
      setError(errorMessage);
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending, error };
}
