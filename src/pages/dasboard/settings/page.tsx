'use client';

import { useThemeStore } from '@/entities/theme';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

export const SettingsPage = () => {
    const { theme, setTheme } = useThemeStore();

    const themes = [
        { id: 'light', label: 'Светлая', icon: Sun, description: 'Классический светлый интерфейс' },
        { id: 'dark', label: 'Тёмная', icon: Moon, description: 'Мягкая тёмная тема для комфортной работы' },
    ] as const;

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="bg-background rounded-2xl border border-border p-8 shadow-sm">
                <h1 className="text-2xl font-bold text-foreground mb-2">Настройки</h1>
                <p className="text-muted-foreground text-sm">Управление предпочтениями интерфейса</p>
            </div>

            {/* Theme Section */}
            <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border bg-slate-50/50 dark:bg-slate-800/50">
                    <h2 className="text-lg font-bold text-foreground">Внешний вид</h2>
                    <p className="text-sm text-muted-foreground mt-1">Выберите тему оформления интерфейса</p>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {themes.map((t) => {
                            const Icon = t.icon;
                            const isActive = theme === t.id;

                            return (
                                <button
                                    key={t.id}
                                    onClick={() => setTheme(t.id)}
                                    className={cn(
                                        "flex items-start gap-4 p-5 rounded-xl border-2 transition-all duration-200 text-left",
                                        isActive
                                            ? "border-[var(--red)] bg-red-50/50 dark:bg-red-900/10"
                                            : "border-border hover:border-slate-300 dark:hover:border-slate-600 bg-card"
                                    )}
                                >
                                    <div className={cn(
                                        "p-3 rounded-lg",
                                        isActive ? "bg-[var(--red)] text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                                    )}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "font-bold",
                                                isActive ? "text-[var(--red)]" : "text-foreground"
                                            )}>
                                                {t.label}
                                            </span>
                                            {isActive && (
                                                <span className="px-2 py-0.5 bg-[var(--red)] text-white text-[10px] font-bold uppercase rounded-full">
                                                    Активно
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">{t.description}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
