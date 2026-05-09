import { useEffect, useState } from 'react'; // Добавили useState
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // 1. Добавили провайдер
import { useSessionStore } from '@/entities/session/model/store';
import { useThemeStore } from '@/entities/theme';
import { LoginPage } from '@/pages/(auth)/login/page';
import { ProfilePage } from '@/pages/dasboard/profile/page';
import { Sidebar } from '@/widgets/sidebar/ui/sidebar';
import StaffPage from '@/pages/dasboard/staff/page';
import CategoryArticlesPage from '@/pages/dasboard/category-articles/page';
import { SettingsPage } from '@/pages/dasboard/settings/page';
import ArticlesPage from '@/pages/dasboard/articles/page';
import ArticleViewPage from '@/pages/dasboard/articles/view/page';

export const AppRouter = () => {
    const { isAuth, isInitialized, initAuth } = useSessionStore();
    const { theme } = useThemeStore();

    // 2. Создаем клиент один раз, чтобы хуки TanStack Query заработали
    const [queryClient] = useState(() => new QueryClient());

    useEffect(() => {
        initAuth();
    }, [initAuth]);

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
                <div className={theme}>
                    <Routes>
                        <Route
                            path="/login"
                            element={isAuth ? <Navigate to="/dashboard" replace /> : <LoginPage />}
                        />

                        <Route
                            path="/dashboard"
                            element={isAuth ? (
                                <div className="flex min-h-screen bg-background">
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
                            <Route path="admin/categories/articles" element={<CategoryArticlesPage />} />
                            <Route path="admin/articles" element={<ArticlesPage />} />
                            <Route path="admin/articles/:id/view" element={<ArticleViewPage />} />
                            <Route path="settings" element={<SettingsPage />} />
                        </Route>

                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </QueryClientProvider>
    );
};