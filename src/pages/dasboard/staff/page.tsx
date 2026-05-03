import { StaffTable } from '@/widgets/staff-table';
import { useSession } from '@/entities/session';
import { staffApi } from '@/entities/staff';
import type { Staff, StaffRole } from '@/entities/staff';
import { useState, useEffect } from 'react';

export default function StaffPage() {
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useSession();

    const loadStaffList = async () => {
        setIsLoading(true);
        try {
            console.log('Fetching staff list...');
            const data = await staffApi.getAll();
            console.log('Staff list loaded:', data);
            setStaffList(data);
        } catch (error) {
            console.error('Failed to load staff list:', error);
            // Если ошибка 401 или 403 - показываем сообщение о недостатке прав, но не делаем logout
            const status = (error as any)?.response?.status;
            if (status === 401 || status === 403) {
                console.warn('Access denied: insufficient permissions or expired session');
                // Не делаем logout глобально, просто показываем пустой список с сообщением
                setStaffList([]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadStaffList();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Загрузка...</div>
            </div>
        );
    }

    // Если пользователь не admin или super_admin, показываем сообщение
    const canViewStaff = user?.role === 'admin' || user?.role === 'super_admin';
    
    if (!canViewStaff) {
        return (
            <main className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900">Персонал</h1>
                    <p className="text-slate-500">Управление сотрудниками и их правами доступа</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <p className="text-yellow-800">У вас нет прав для просмотра этого раздела. Требуются права admin или super_admin.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Персонал</h1>
                <p className="text-slate-500">Управление сотрудниками и их правами доступа</p>
            </div>

            {staffList.length === 0 ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <p className="text-blue-800">Сотрудники не найдены или у вас нет прав на просмотр списка.</p>
                </div>
            ) : (
                <StaffTable
                    staffList={staffList}
                    currentUserId={user?.id || null}
                    currentUserRole={(user?.role as StaffRole) || null}
                    onRefresh={loadStaffList}
                />
            )}
        </main>
    );
}