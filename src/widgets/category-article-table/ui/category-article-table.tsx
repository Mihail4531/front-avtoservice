'use client';

import { useCategoryArticleList } from '@/features/category-article-list/model/use-category-article-list';
import { Search, FilePlus, ChevronLeft, ChevronRight, Calendar, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { cn } from '@/shared/lib/cn';
import { useState } from 'react';
import { Modal } from '@/shared/ui/modal';
import { CreateCategoryArticleForm } from '@/features/create-category-article/ui/CreateCategoryArticleForm';
import { type CategoryArticle } from '@/entities/category-article/model/types';

export const CategoryArticleTable = () => {
    // Используем лимит 10 по умолчанию
    const [filters, setFilters] = useState({
        search: '',
        is_active: undefined as boolean | undefined,
        created_at_from: '',
        created_at_to: '',
        page: 0
    });

    const { data, isLoading, refresh } = useCategoryArticleList({
        initialLimit: 5,
        filters
    });

    // Состояние для модального окна создания
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Расчет общего количества страниц на основе данных из Go
    const totalPages = data ? Math.ceil(data.total / 5) : 0;

    const handleCreateSuccess = () => {
        setIsCreateModalOpen(false);
        refresh(); // Обновляем список после создания
    };

    const handleFilterChange = (newFilters: Partial<typeof filters>) => {
        setFilters(prev => ({ ...prev, ...newFilters, page: newFilters.page !== undefined ? newFilters.page : prev.page }));
    };

    return (
        <div className="space-y-6">
            {/* Панель управления: Поиск + Фильтры статуса + Добавление */}
            <div className="flex flex-col gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
                <div className="flex flex-col gap-4">
                    {/* Верхняя строка: Поиск + Кнопка Добавить */}
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        {/* Инпут поиска */}
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Поиск категорий..."
                                className="pl-10"
                                value={filters.search}
                                onChange={(e) => handleFilterChange({ search: e.target.value, page: 0 })}
                            />
                        </div>

                        <Button
                            className="gap-2 font-bold bg-[var(--red)] hover:bg-red-700 w-full md:w-auto"
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            <FilePlus className="w-4 h-4" />
                            Добавить
                        </Button>
                    </div>

                    {/* Нижняя строка: Фильтры */}
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Фильтрация по активности */}
                        <div className="flex bg-muted/50 p-1 rounded-lg border border-border">
                            {[
                                { label: 'Все', value: undefined },
                                { label: 'Активные', value: true },
                                { label: 'Неактивные', value: false },
                            ].map((tab) => (
                                <button
                                    key={tab.label}
                                    onClick={() => handleFilterChange({ is_active: tab.value, page: 0 })}
                                    className={cn(
                                        "px-3 py-1.5 text-xs font-bold rounded-md transition-all",
                                        filters.is_active === tab.value
                                            ? "bg-card text-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Фильтр по дате создания - ОТ */}
                        <div className="relative">
                            <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                            <input
                                type="date"
                                value={filters.created_at_from}
                                onChange={(e) => handleFilterChange({ created_at_from: e.target.value, page: 0 })}
                                className="pl-8 pr-3 py-1.5 text-xs font-medium text-foreground bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 hover:border-ring transition-colors"
                                placeholder="С даты"
                            />
                        </div>

                        {/* Фильтр по дате создания - ДО */}
                        <div className="relative">
                            <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                            <input
                                type="date"
                                value={filters.created_at_to}
                                onChange={(e) => handleFilterChange({ created_at_to: e.target.value, page: 0 })}
                                className="pl-8 pr-3 py-1.5 text-xs font-medium text-foreground bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 hover:border-ring transition-colors"
                                placeholder="По дату"
                            />
                        </div>

                        {/* Кнопка сброса фильтров */}
                        {(filters.search || filters.created_at_from || filters.created_at_to || filters.is_active !== undefined) && (
                            <button
                                onClick={() => setFilters({ search: '', is_active: undefined,  created_at_from: '', created_at_to: '', page: 0 })}
                                className="px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                                Сбросить
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-muted/50 border-b border-border">
                        <tr>
                            <th className="p-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Категория</th>
                            <th className="p-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Slug</th>
                            <th className="p-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Дата создания</th>
                            <th className="p-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Статус</th>
                            <th className="p-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-sm">
                        {isLoading ? (
                            [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                        ) : data?.items.map((category) => (
                            <tr key={category.id} className="hover:bg-muted/30 transition-colors group">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                                            {category.image_path ? (
                                                <img 
                                                    src={category.image_path} 
                                                    alt={category.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <FilePlus className="w-5 h-5 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground">{category.title}</p>
                                            <p className="text-xs text-muted-foreground line-clamp-1">{category.description}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <code className="text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                                        {category.slug}
                                    </code>
                                </td>
                                <td className="p-4 text-muted-foreground font-medium">
                                    {new Date(category.created_at).toLocaleDateString('ru-RU')}
                                </td>
                                <td className="p-4">
                                    <span className={cn(
                                        "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border",
                                        category.is_active
                                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                                            : "bg-muted text-muted-foreground border-border"
                                    )}>
                                        {category.is_active ? 'Активна' : 'Неактивна'}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-1">
                                        <button
                                            className="p-2 hover:bg-card rounded-lg border border-transparent hover:border-border transition-all"
                                            title="Редактировать категорию"
                                        >
                                            <Pencil className="w-4 h-4 text-muted-foreground hover:text-[var(--red)]" />
                                        </button>
                                        <button
                                            className="p-2 hover:bg-card rounded-lg border border-transparent hover:border-border transition-all"
                                            title={category.is_active ? 'Деактивировать' : 'Активировать'}
                                        >
                                            {category.is_active ? (
                                                <EyeOff className="w-4 h-4 text-muted-foreground hover:text-[var(--red)]" />
                                            ) : (
                                                <Eye className="w-4 h-4 text-muted-foreground hover:text-[var(--red)]" />
                                            )}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Footer с пагинацией */}
                <div className="flex items-center justify-between p-4 border-t border-border bg-muted/30">
                    <div className="text-xs font-bold text-muted-foreground uppercase">
                        Всего: {data?.total || 0}
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-xs text-muted-foreground font-medium">
                            Страница {(filters.page || 0) + 1} из {totalPages || 1}
                        </span>
                        <div className="flex gap-1">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={filters.page === 0}
                                onClick={() => handleFilterChange({ page: (filters.page || 0) - 1 })}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={(filters.page || 0) + 1 >= totalPages}
                                onClick={() => handleFilterChange({ page: (filters.page || 0) + 1 })}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Модальное окно создания категории */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Создать категорию статей"
                className="max-w-xl"
            >
                <CreateCategoryArticleForm onSuccess={handleCreateSuccess} />
            </Modal>
        </div>
    );
};

// Компонент скелетона для загрузки
const SkeletonRow = () => (
    <tr className="animate-pulse">
        <td className="p-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted"></div>
                <div className="space-y-2">
                    <div className="h-4 w-32 bg-muted rounded"></div>
                    <div className="h-3 w-48 bg-muted rounded"></div>
                </div>
            </div>
        </td>
        <td className="p-4">
            <div className="h-4 w-24 bg-muted rounded"></div>
        </td>
        <td className="p-4">
            <div className="h-4 w-20 bg-muted rounded"></div>
        </td>
        <td className="p-4">
            <div className="h-5 w-16 bg-muted rounded-full"></div>
        </td>
        <td className="p-4">
            <div className="h-8 w-8 bg-muted rounded"></div>
        </td>
    </tr>
);
