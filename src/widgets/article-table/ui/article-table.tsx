'use client';

import { useArticleList } from '@/features/article-list/model/use-article-list';
import { Search, FilePlus, ChevronLeft, ChevronRight, Calendar, Pencil, Eye, Trash2, Tag } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { cn } from '@/shared/lib/cn';
import { useState, useEffect } from 'react';
import { Modal } from '@/shared/ui/modal';
import { CreateArticleForm } from '@/features/create-article/ui/CreateArticleForm';
import { EditArticleForm } from '@/features/edit-article/ui/EditArticleForm';
import { useDeleteArticle } from '@/entities/article/hooks/use-delete';
import { useArticleById } from '@/entities/article/hooks/use-get-by-id';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { useQuery } from '@tanstack/react-query';
import { getCategoryArticlesList } from '@/entities/category-article/api/api';

export const ArticleTable = () => {
    // Загрузка категорий через useEffect
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        getCategoryArticlesList({ limit: 100 })
            .then((data) => setCategories(data?.items || []))
            .catch((err) => console.error('Failed to load categories:', err));
    }, []);

    // Используем лимит 5 по умолчанию
    const [filters, setFilters] = useState({
        search: '',
        is_active: undefined as boolean | undefined,
        created_at_from: '',
        created_at_to: '',
        category_id: undefined as number | undefined,
        page: 0,
    });

    const { data, isLoading, refresh } = useArticleList({
        initialLimit: 5,
        filters,
    });

    // Состояние для модального окна создания
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    // Состояние для модального окна подтверждения удаления
    const [deleteArticleId, setDeleteArticleId] = useState<number | null>(null);
    // Состояние для модального окна просмотра статьи
    const [viewArticleId, setViewArticleId] = useState<number | null>(null);
    // Состояние для модального окна редактирования статьи
    const [editArticleId, setEditArticleId] = useState<number | null>(null);

    // Хук для удаления статьи
    const { mutate: deleteArticle, isPending: isDeleting } = useDeleteArticle();

    // Хук для получения данных о статье (используется только для просмотра)
    const { data: viewArticleData, isLoading: isLoadingViewArticle } = useArticleById(viewArticleId);
    // Хук для получения данных о статье (используется только для редактирования)
    const { data: editArticleData, isLoading: isLoadingEditArticle } = useArticleById(editArticleId);

    // Расчет общего количества страниц на основе данных из Go
    const totalPages = data ? Math.ceil(data.total / 5) : 0;

    const handleCreateSuccess = () => {
        setIsCreateModalOpen(false);
        refresh(); // Обновляем список после создания
    };

    const handleFilterChange = (newFilters: Partial<typeof filters>) => {
        setFilters(prev => ({ ...prev, ...newFilters, page: newFilters.page !== undefined ? newFilters.page : prev.page }));
    };

    const handleDeleteClick = (id: number) => {
        setDeleteArticleId(id);
    };

    const handleDeleteConfirm = () => {
        if (deleteArticleId !== null) {
            deleteArticle(deleteArticleId, {
                onSuccess: () => {
                    setDeleteArticleId(null);
                    refresh();
                }
            });
        }
    };

    const handleDeleteCancel = () => {
        setDeleteArticleId(null);
    };

    const handleViewClick = (id: number) => {
        setViewArticleId(id);
    };

    const handleViewClose = () => {
        setViewArticleId(null);
    };

    const handleEditClick = (id: number) => {
        setEditArticleId(id);
    };

    const handleEditClose = () => {
        setEditArticleId(null);
    };

    const handleEditSuccess = () => {
        setEditArticleId(null);
        refresh();
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
                                placeholder="Поиск статей..."
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
                            Добавить статью
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

                        {/* Фильтр по категории - ВЫПАДАЮЩИЙ СПИСОК */}
                        <div className="relative min-w-[200px]">
                            <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground z-10" />
                            <Select
                                value={filters.category_id ? String(filters.category_id) : ''}
                                onValueChange={(val) =>
                                    handleFilterChange({
                                        category_id: val ? Number(val) : undefined,
                                        page: 0,
                                    })
                                }
                            >
                                <SelectTrigger className="pl-8 pr-3 py-1.5 text-xs font-medium text-foreground bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 hover:border-ring transition-colors w-full min-w-[200px]">
                                    <SelectValue placeholder="Все категории" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={String(cat.id)}>
                                            {cat.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                        {(filters.search || filters.created_at_from || filters.created_at_to || filters.is_active !== undefined || filters.category_id) && (
                            <button
                                onClick={() => setFilters({ search: '', is_active: undefined, created_at_from: '', created_at_to: '', category_id: undefined, page: 0 })}
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
                            <th className="p-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Статья</th>
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
                        ) : data?.items.map((article) => (
                            <tr key={article.id} className="hover:bg-muted/30 transition-colors group">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                                            {article.image_url ? (
                                                <img
                                                    src={article.image_url}
                                                    alt={article.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <FilePlus className="w-5 h-5 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground">{article.title}</p>
                                            <p className="text-xs text-muted-foreground line-clamp-1">{article.description}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <Tag className="w-3 h-3 text-muted-foreground" />
                                        <span className="text-sm font-medium text-foreground">
                                            {article.category?.title || '—'}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <code className="text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                                        {article.slug}
                                    </code>
                                </td>
                                <td className="p-4 text-muted-foreground font-medium">
                                    {new Date(article.created_at).toLocaleDateString('ru-RU')}
                                </td>
                                <td className="p-4">
                                    <span className={cn(
                                        "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border",
                                        article.is_active
                                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                                            : "bg-muted text-muted-foreground border-border"
                                    )}>
                                        {article.is_active ? 'Активна' : 'Неактивна'}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-1">
                                        <button
                                            className="p-2 hover:bg-card rounded-lg border border-transparent hover:border-border transition-all"
                                            title="Просмотр статьи"
                                            onClick={() => handleViewClick(article.id)}
                                        >
                                            <Eye className="w-4 h-4 text-muted-foreground hover:text-[var(--red)]" />
                                        </button>

                                        <button
                                            className="p-2 hover:bg-card rounded-lg border border-transparent hover:border-border transition-all"
                                            title="Удалить статью"
                                            onClick={() => handleDeleteClick(article.id)}
                                        >
                                            <Trash2 className="w-4 h-4 text-muted-foreground hover:text-red-600" />
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
                                disabled={filters.page >= totalPages - 1}
                                onClick={() => handleFilterChange({ page: (filters.page || 0) + 1 })}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Модальное окно создания статьи */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Добавить статью"
                className="max-w-3xl"
            >
                <div className="max-h-[70vh] overflow-y-auto pr-2">
                    <CreateArticleForm onSuccess={handleCreateSuccess} />
                </div>
            </Modal>

            {/* Модальное окно подтверждения удаления */}
            <Modal
                isOpen={deleteArticleId !== null}
                onClose={handleDeleteCancel}
                title="Подтверждение удаления"
            >
                <div className="space-y-4">
                    <p className="text-sm text-foreground">
                        Вы уверены, что хотите удалить эту статью? Это действие нельзя отменить.
                    </p>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={handleDeleteCancel}
                            disabled={isDeleting}
                            className="flex-1"
                        >
                            Отмена
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteConfirm}
                            disabled={isDeleting}
                            className="flex-1 bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? 'Удаление...' : 'Удалить'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Модальное окно просмотра статьи */}
            <Modal
                isOpen={viewArticleId !== null}
                onClose={handleViewClose}
                title="Просмотр статьи"
                className="max-w-3xl"
            >
                {isLoadingViewArticle ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--red)]"></div>
                    </div>
                ) : viewArticleData ? (
                    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                        <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                            {viewArticleData.image_url ? (
                                <img
                                    src={viewArticleData.image_url}
                                    alt={viewArticleData.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <FilePlus className="w-12 h-12 text-muted-foreground" />
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-foreground mb-1">{viewArticleData.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{viewArticleData.description}</p>
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="text-sm text-foreground whitespace-pre-wrap">{viewArticleData.content}</p>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    handleViewClose();
                                    handleEditClick(viewArticleData.id);
                                }}
                                className="flex-1"
                            >
                                <Pencil className="w-4 h-4 mr-2" />
                                Редактировать
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    handleViewClose();
                                    handleDeleteClick(viewArticleData.id);
                                }}
                                className="flex-1 bg-red-600 hover:bg-red-700"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Удалить
                            </Button>
                        </div>
                    </div>
                ) : null}
            </Modal>

            {/* Модальное окно редактирования статьи */}
            <Modal
                isOpen={editArticleId !== null}
                onClose={handleEditClose}
                title="Редактировать статью"
                className="max-w-3xl"
            >
                {isLoadingEditArticle ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--red)]"></div>
                    </div>
                ) : editArticleData ? (
                    <EditArticleForm article={editArticleData} articleId={editArticleId!} onSuccess={handleEditSuccess} />
                ) : null}
            </Modal>


        </div>
    );
};

const SkeletonRow = () => (
    <tr className="animate-pulse">
        <td className="p-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted" />
                <div className="space-y-2">
                    <div className="h-4 w-32 bg-muted rounded" />
                    <div className="h-3 w-24 bg-muted rounded" />
                </div>
            </div>
        </td>
        <td className="p-4">
            <div className="h-4 w-20 bg-muted rounded" />
        </td>
        <td className="p-4">
            <div className="h-4 w-24 bg-muted rounded" />
        </td>
        <td className="p-4">
            <div className="h-4 w-16 bg-muted rounded" />
        </td>
        <td className="p-4">
            <div className="h-6 w-16 bg-muted rounded-full" />
        </td>
        <td className="p-4">
            <div className="flex gap-1">
                <div className="w-8 h-8 bg-muted rounded-lg" />
                <div className="w-8 h-8 bg-muted rounded-lg" />
                <div className="w-8 h-8 bg-muted rounded-lg" />
            </div>
        </td>
    </tr>
);
