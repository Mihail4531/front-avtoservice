'use client';

import { StaffResponse } from '@/entities/staff';

interface Props {
    staff: StaffResponse;
    onEdit: () => void;
}

export const MeProfileCard = ({ staff, onEdit }: Props) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header с градиентом */}
            <div className="h-24 bg-gradient-to-r from-primary to-primary/80" />

            <div className="px-6 pb-6">
                {/* Аватар */}
                <div className="relative -mt-12 mb-4">
                    <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md">
                        <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-600">
                            {staff.full_name.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>

                {/* Имя и роль */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">{staff.full_name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                            {staff.role === 'super_admin' ? 'Супер-админ' : staff.role === 'admin' ? 'Администратор' : 'Менеджер'}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${staff.is_active
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                            }`}>
                            {staff.is_active ? 'Активен' : 'Неактивен'}
                        </span>
                    </div>
                </div>

                {/* Данные */}
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">ID</div>
                            <div className="text-sm font-semibold text-gray-900">#{staff.id}</div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Email</div>
                            <div className="text-sm font-semibold text-gray-900">{staff.email}</div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Создан</div>
                            <div className="text-sm font-semibold text-gray-900">
                                {new Date(staff.created_at).toLocaleDateString('ru-RU', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Кнопка редактирования */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <button
                        onClick={onEdit}
                        className="inline-flex items-center justify-center px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Редактировать профиль
                    </button>
                </div>
            </div>
        </div>
    );
};