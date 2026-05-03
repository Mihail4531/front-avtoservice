import { useState, useCallback } from 'react';
import type { CreateStaffInput, Staff } from '../model';

interface UseCreateStaffResult {
  isLoading: boolean;
  error: string | null;
  createStaff: (data: CreateStaffInput) => Promise<Staff | null>;
  resetError: () => void;
}

/**
 * Хук для создания сотрудника
 * Используется в features/create-staff
 */
export function useCreateStaff(): UseCreateStaffResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createStaff = useCallback(async (data: CreateStaffInput): Promise<Staff | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/dashboard/admin/staffs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка при создании сотрудника');
      }

      const staff = await response.json();
      return staff;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при создании сотрудника';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return { isLoading, error, createStaff, resetError };
}
