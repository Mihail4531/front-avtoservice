import { StaffTable } from '@/widgets/staff-table/ui/staff-table';

export default function StaffPage() {
    return (
        <main className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">Персонал</h1>
                <p className="text-muted-foreground">Управление сотрудниками и их правами доступа</p>
            </div>

            <StaffTable />
        </main>
    );
}