import { AppHeader } from '@/widgets/app-header';
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <main className="container mx-auto py-6">{children}</main>
    </div>
  );
}
