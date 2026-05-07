import { NavLink } from 'react-router-dom';
import {
    LayoutGrid, ClipboardList, Car, UserCog,
    DollarSign, CalendarDays, Warehouse, Settings, ChevronRight,
    BookOpen
} from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { useSessionStore } from '@/entities/session/model/store';
import { LogoutButton } from '@/features/auth/logout/ui/LogoutButton';

const menuItems = [
    {
        group: 'ОСНОВНОЕ', items: [
            { name: 'Дашборд', icon: LayoutGrid, path: '/dashboard' },
            { name: 'Заказы', icon: ClipboardList, path: '/dashboard/orders', badge: 2 },
            { name: 'Автомобили', icon: Car, path: '/dashboard/cars' },
            { name: 'Сотрудники', icon: UserCog, path: '/dashboard/admin/staff' },
        ]
    },

    {
        group: 'СЕРВИСЫ', items: [
            { name: 'Финансы', icon: DollarSign, path: '/dashboard/finance' },
            { name: 'Запись', icon: CalendarDays, path: '/dashboard/appointments' },
            { name: 'Склад', icon: Warehouse, path: '/dashboard/inventory' },
        ]
    },

    {
        group: 'СТАТЬИ', items: [
            { name: 'Категории статей', icon: BookOpen, path: '/dashboard/admin/categories/articles' },
            { name: 'Все статьи', icon: BookOpen, path: '/dashboard/admin/articles' },
        ]
    }
];

export const Sidebar = () => {
    const { user } = useSessionStore();

    return (
        <aside className="w-72 h-screen border-r border-border bg-background flex flex-col">
            {/* Логотип */}
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--red)] rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
                    <Car className="text-white w-6 h-6" />
                </div>
                <div>
                    <h1 className="font-bold text-lg leading-none text-foreground">АвтоСервис</h1>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">УПРАВЛЕНИЕ</span>
                </div>
            </div>

            {/* Навигация */}
            <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
                {menuItems.map((group) => (
                    <div key={group.group}>
                        <p className="px-2 mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            {group.group}
                        </p>
                        <div className="space-y-1">
                            {group.items.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.path === '/dashboard'}
                                    className={({ isActive }) => cn(
                                        "flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 group",
                                        isActive
                                            ? "bg-red-50 text-[var(--red)]"
                                            : "text-foreground hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className="w-5 h-5" />
                                        <span className="text-sm font-semibold">{item.name}</span>
                                    </div>
                                    {item.badge && (
                                        <span className="bg-[var(--red)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                            {item.badge}
                                        </span>
                                    )}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Футер сайдбара */}
            <div className="p-4 border-t border-border space-y-2">
                <NavLink
                    to="/dashboard/settings"
                    className="flex items-center gap-3 px-3 py-2 text-foreground hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <Settings className="w-5 h-5" />
                    <span className="text-sm font-semibold">Настройки</span>
                </NavLink>

                <NavLink to="/dashboard/profile" className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors group">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--red)] flex items-center justify-center text-white font-bold text-xs">
                            {user?.full_name?.split(' ').map(n => n[0]).join('') || 'АД'}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-foreground leading-none truncate w-32">
                                {user?.full_name || 'Загрузка...'}
                            </span>
                            <span className="text-[11px] text-muted-foreground capitalize mt-1">
                                {user?.role || 'Сотрудник'}
                            </span>
                        </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </NavLink>
              
                    {/* Кнопка выхода */}
                    <LogoutButton className="w-full justify-start px-3 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50" />

          
            </div>
        </aside>
    );
};