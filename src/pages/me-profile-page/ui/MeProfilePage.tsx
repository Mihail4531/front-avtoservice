'use client';

import { useState } from 'react';
import { useGetMe, MeProfileCard } from '@/features/view-me-profile';
import { UpdateMeProfileForm } from '@/features/update-me-profile';
import { ChangeMePasswordForm } from '@/features/change-me-password';

export const MeProfilePage = () => {
  const { data: staff, isLoading } = useGetMe();
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-24 bg-gray-200 rounded-t-xl" />
          <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-6 space-y-4">
            <div className="h-20 w-20 bg-gray-200 rounded-full -mt-16 mb-4" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="h-16 bg-gray-100 rounded-lg" />
              <div className="h-16 bg-gray-100 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <svg className="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-medium text-red-800">Не удалось загрузить профиль</h3>
          <p className="text-sm text-red-600 mt-1">Попробуйте обновить страницу</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Заголовок страницы */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Профиль</h1>
          <p className="text-sm text-gray-500 mt-1">Управление вашей учётной записью</p>
        </div>
      </div>

      {isEditing ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Редактирование профиля</h2>
              <p className="text-sm text-gray-500">Обновите ваши личные данные</p>
            </div>
          </div>
          <UpdateMeProfileForm
            defaultValues={{
              full_name: staff.full_name,
              email: staff.email,
            }}
          />
          <button
            onClick={() => setIsEditing(false)}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Вернуться к профилю
          </button>
        </div>
      ) : (
        <MeProfileCard staff={staff} onEdit={() => setIsEditing(true)} />
      )}

      <ChangeMePasswordForm />
    </div>
  );
};