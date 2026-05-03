import { StaffTable } from '@/widgets/staff-table';
import { useSession } from '@/entities/session';
import { staffApi } from '@/entities/staff';
import type { Staff } from '@/entities/staff';
import { useState, useEffect } from 'react';

export default function StaffPage() {
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useSession();

    const loadStaffList = async () => {
        setIsLoading(true);
        try {
            const data = await staffApi.getAll();
            setStaffList(data);
        } catch (error) {
            console.error('Failed to load staff list:', error);
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

    return (
        <main className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Персонал</h1>
                <p className="text-slate-500">Управление сотрудниками и их правами доступа</p>
            </div>

            <StaffTable
                staffList={staffList}
                currentUserId={user?.id || null}
                currentUserRole={user?.role || null}
                onRefresh={loadStaffList}
            />
        </main>
    );
}