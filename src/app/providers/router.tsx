import { useEffect, useState } from 'react'; // Добавили useState
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // 1. Добавили провайдер
import { useSessionStore } from '@/entities/session/model/store';
import { LoginPage } from '@/pages/(auth)/login/page';
import { ProfilePage } from '@/pages/dasboard/profile/page';
import { Sidebar } from '@/widgets/sidebar/ui/sidebar';
import StaffPage from '@/pages/dasboard/staff/page';

export const AppRouter = () => {
    const { isAuth, isInitialized, initAuth, logout } = useSessionStore();

    // 2. Создаем клиент один раз, чтобы хуки TanStack Query заработали
    const [queryClient] = useState(() => new QueryClient());

    useEffect(() => {
        initAuth();
    }, [initAuth]);

    // Обработчик события истечения сессии
    useEffect(() => {
        const handleAuthExpired = () => {
            logout();
        };

        window.addEventListener('auth:expired', handleAuthExpired);
        return () => {
            window.removeEventListener('auth:expired', handleAuthExpired);
        };
    }, [logout]);

    if (!isInitialized) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        // 3. Оборачиваем BrowserRouter, чтобы ProfilePage перестал падать
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/login"
                        element={isAuth ? <Navigate to="/dashboard" replace /> : <LoginPage />}
                    />

                    <Route
                        path="/dashboard"
                        element={isAuth ? (
                            <div className="flex min-h-screen bg-[#F8FAFC]">
                                <Sidebar />
                                <main className="flex-1 p-8 overflow-y-auto">
                                    <Outlet />
                                </main>
                            </div>
                        ) : <Navigate to="/login" replace />}
                    >
                        <Route index element={<div>Общая статистика автосервиса</div>} />
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="admin/staff" element={<StaffPage />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
};