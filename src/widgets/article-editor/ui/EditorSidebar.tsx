'use client';

import { Controller, type UseFormReturn } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit3 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/cn';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { FileUpload } from '@/shared/ui/file-upload';
import { getCategoryArticlesList } from '@/entities/category-article/api/api';
import type { ArticleEditorSchema } from '../model/use-article-editor';

interface Props {
    form: UseFormReturn<ArticleEditorSchema>;
    isEdit: boolean;
    isPending: boolean;
    error: any;
    onSubmit: () => void;
}

export const EditorSidebar = ({
    form,
    isEdit,
    isPending,
    error,
    onSubmit,
}: Props) => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<any[]>([]);
    const { control, watch, formState: { errors } } = form;

    const isActive = watch('is_active');

    useEffect(() => {
        getCategoryArticlesList({ limit: 100 })
            .then((data) => setCategories(data?.items || []))
            .catch((err) => console.error('Failed to load categories:', err));
    }, []);

    return (
        <div className="space-y-4">
            {/* Публикация */}
            <Card title="Публикация">
                <div className="flex items-center justify-between gap-3 mb-4">
                    <div>
                        <p className="text-sm font-bold text-foreground">
                            {isActive ? 'Опубликовано' : 'Черновик'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {isActive ? 'Видна посетителям' : 'Не видна посетителям'}
                        </p>
                    </div>
                    <Controller
                        name="is_active"
                        control={control}
                        render={({ field }) => (
                            <Toggle checked={field.value} onChange={field.onChange} />
                        )}
                    />
                </div>

                <Button
                    onClick={onSubmit}
                    disabled={isPending}
                    className="w-full bg-[var(--red)] hover:bg-red-700 mb-2"
                >
                    <Edit3 className="w-4 h-4 mr-2" />
                    {isPending
                        ? 'Сохранение...'
                        : isEdit
                            ? 'Сохранить'
                            : isActive
                                ? 'Опубликовать'
                                : 'Создать черновик'}
                </Button>
                <Button
                    variant="outline"
                    onClick={() => navigate('/dashboard/admin/articles')}
                    disabled={isPending}
                    className="w-full"
                >
                    × Отмена
                </Button>

                {error && (
                    <div className="mt-3 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg">
                        <p className="text-xs text-red-600 font-medium">
                            {(error as any)?.response?.data?.message || 'Ошибка сохранения'}
                        </p>
                    </div>
                )}
            </Card>

            {/* Категория */}
            <Card title="Категория" required error={errors.category_id?.message}>
                <Controller
                    name="category_id"
                    control={control}
                    render={({ field }) => (
                        <Select
                            onValueChange={(val) => field.onChange(Number(val))}
                            value={field.value ? String(field.value) : ''}
                        >
                            <SelectTrigger className={cn('w-full', errors.category_id && 'border-red-500')}>
                                <SelectValue placeholder="— выберите —" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={String(cat.id)}>
                                        {cat.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            </Card>

            {/* Обложка */}
            <Card title="Обложка" required error={errors.image_path?.message as string}>
                <Controller
                    name="image_path"
                    control={control}
                    render={({ field }) => (
                        <FileUpload
                            value={field.value}
                            onChange={field.onChange}
                            error={!!errors.image_path}
                            disabled={isPending}
                        />
                    )}
                />
            </Card>
        </div>
    );
};

function Card({
    title,
    required,
    error,
    children,
}: {
    title: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                {title} {required && <span className="text-[var(--red)]">*</span>}
            </div>
            {children}
            {error && <p className="text-xs text-red-500 font-medium mt-2">{error}</p>}
        </div>
    );
}

function Toggle({
    checked,
    onChange,
}: {
    checked: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={cn(
                'relative w-11 h-6 rounded-full transition-colors',
                checked ? 'bg-[var(--red)]' : 'bg-muted'
            )}
        >
            <div
                className={cn(
                    'absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform',
                    checked ? 'left-[22px]' : 'left-0.5'
                )}
            />
        </button>
    );
}