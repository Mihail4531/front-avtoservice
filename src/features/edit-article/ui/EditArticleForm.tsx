'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { editArticleSchema, type EditArticleSchema } from '../model/schema';
import { useUpdateArticle } from '@/entities/article/hooks/use-update';
import { Button } from '@/shared/ui/button';
import { Type, FileText, Tag, Eye, EyeOff, Calendar, Clock } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { useState, useEffect } from 'react';
import { previewSlug, uploadFile } from '@/entities/article/api/api';
import { FileUpload } from '@/shared/ui/file-upload';
import type { Article, CategoryShortResponse } from '@/entities/article/model/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { useQuery } from '@tanstack/react-query';
import { getCategoryArticlesList } from '@/entities/category-article/api/api';

interface Props {
    articleId: number;
    article: Article;
    onSuccess?: () => void;
}

function extractRelativePath(url: string | undefined): string {
    if (!url) return '';
    if (url.startsWith('http')) {
        const match = url.match(/\/uploads\/(.+)$/);
        return match ? match[1] : '';
    }
    return url;
}

export const EditArticleForm = ({ articleId, article, onSuccess }: Props) => {
    const { mutate: updateArticle, isPending: isUpdating, error } = useUpdateArticle();
    const [previewSlugValue, setPreviewSlugValue] = useState<string>(article.slug);
    const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    const isPending = isUpdating || isUploadingImage;

    // Загрузка категорий для селекта
    const { data: categoriesData } = useQuery({
        queryKey: ['admin-category-articles-list'],
        queryFn: () => getCategoryArticlesList({ limit: 1000 }),
        enabled: true,
    });

    const categories = categoriesData?.items || [];

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        control,
        setValue,
    } = useForm<EditArticleSchema>({
        resolver: zodResolver(editArticleSchema),
        defaultValues: {
            category_id: article.category?.id || 0,
            title: article.title,
            version: article.version,
            description: article.description,
            content: article.content,
            image_path: extractRelativePath(article.image_url),
            is_active: article.is_active,
        },
    });

    const title = watch('title');
    const isActive = watch('is_active');

    // Регистрация скрытых полей для корректной работы watch/setValue
    useEffect(() => {
        register('is_active');

    }, [register]);

    // Превью slug с debounce
    useEffect(() => {
        if (!title || title.length < 3) {
            setPreviewSlugValue('');
            return;
        }
        if (title === article.title) {
            setPreviewSlugValue(article.slug);
            return;
        }
        setIsGeneratingSlug(true);
        const timeoutId = setTimeout(async () => {
            try {
                const response = await previewSlug(title);
                setPreviewSlugValue(response.slug);
            } catch (err) {
                console.error('Ошибка при генерации slug:', err);
                setPreviewSlugValue('');
            } finally {
                setIsGeneratingSlug(false);
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [title, article.title, article.slug]);

    const onSubmit = async (data: EditArticleSchema) => {
        let imagePath: string;

        if (data.image_path instanceof File) {
            setIsUploadingImage(true);
            try {
                const response = await uploadFile(data.image_path, 'articles');
                imagePath = response.path;
            } catch (err) {
                console.error('Ошибка загрузки картинки:', err);
                setIsUploadingImage(false);
                return;
            }
            setIsUploadingImage(false);
        } else {
            imagePath = data.image_path;
        }

        updateArticle(
            {
                id: articleId,
                data: {
                    category_id: data.category_id,
                    title: data.title,
                    version: data.version,
                    description: data.description,
                    content: data.content,
                    image_path: imagePath,
                    is_active: data.is_active,
                 
                },
            },
            {
                onSuccess: () => onSuccess?.(),
            }
        );
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 max-h-[80vh] overflow-y-auto pr-2"
        >
            {/* Категория - SELECT */}
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                    Категория
                </label>
                <Controller
                    name="category_id"
                    control={control}
                    rules={{ required: 'Выберите категорию', min: { value: 1, message: 'Выберите категорию' } }}
                    render={({ field }) => (
                        <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value ? String(field.value) : ''}>
                            <SelectTrigger className={cn(
                                "w-full",
                                errors.category_id ? 'border-red-500' : 'border-border focus:border-primary'
                            )}>
                                <SelectValue placeholder="Выберите категорию" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat: CategoryShortResponse) => (
                                    <SelectItem key={cat.id} value={String(cat.id)}>
                                        {cat.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.category_id && (
                    <p className="text-red-500 text-[10px] font-bold uppercase ml-1">
                        {errors.category_id.message}
                    </p>
                )}
            </div>

            {/* Название */}
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                    Название статьи
                </label>
                <div className="relative">
                    <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        {...register('title')}
                        placeholder="Название..."
                        disabled={isPending}
                        className={cn(
                            'w-full pl-10 pr-4 py-2.5 bg-card border rounded-xl outline-none transition-all font-semibold text-foreground',
                            errors.title ? 'border-red-500' : 'border-border focus:border-primary'
                        )}
                    />
                </div>
                {errors.title && (
                    <p className="text-red-500 text-[10px] font-bold uppercase ml-1">
                        {errors.title.message}
                    </p>
                )}

                {(previewSlugValue || isGeneratingSlug) && (
                    <div className="mt-1.5 p-2.5 bg-muted/30 border border-border rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                            <div className={cn(
                                'w-2 h-2 rounded-full',
                                isGeneratingSlug ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'
                            )} />
                            <p className="text-[9px] font-bold text-muted-foreground uppercase">
                                {isGeneratingSlug ? 'Генерация URL...' : 'Будущий URL'}
                            </p>
                        </div>
                        <div className="font-mono text-[11px] truncate text-muted-foreground">
                            /articles/{isGeneratingSlug ? '...' : previewSlugValue}
                        </div>
                    </div>
                )}
            </div>

            {/* Описание */}
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                    Описание
                </label>
                <div className="relative">
                    <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <textarea
                        {...register('description')}
                        placeholder="Краткое описание..."
                        rows={3}
                        disabled={isPending}
                        className={cn(
                            'w-full pl-10 pr-4 py-2.5 bg-card border rounded-xl outline-none transition-all font-medium resize-none',
                            errors.description ? 'border-red-500' : 'border-border focus:border-primary'
                        )}
                    />
                </div>
                {errors.description && (
                    <p className="text-red-500 text-[10px] font-bold uppercase ml-1">
                        {errors.description.message}
                    </p>
                )}
            </div>

            {/* Содержимое */}
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                    Содержимое
                </label>
                <div className="relative">
                    <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <textarea
                        {...register('content')}
                        placeholder="Полное содержимое статьи..."
                        rows={6}
                        disabled={isPending}
                        className={cn(
                            'w-full pl-10 pr-4 py-2.5 bg-card border rounded-xl outline-none transition-all font-medium resize-none',
                            errors.content ? 'border-red-500' : 'border-border focus:border-primary'
                        )}
                    />
                </div>
                {errors.content && (
                    <p className="text-red-500 text-[10px] font-bold uppercase ml-1">
                        {errors.content.message}
                    </p>
                )}
            </div>

            {/* Изображение */}
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                    Изображение
                </label>
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
            </div>

            {/* Статус активности */}
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                    Статус активности
                </label>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setValue('is_active', true, { shouldDirty: true })}
                        disabled={isPending}
                        className={cn(
                            'flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all font-bold text-xs flex-1 justify-center',
                            isActive
                                ? 'bg-green-50 border-green-200 text-green-600 dark:bg-green-900/20 dark:border-green-800'
                                : 'bg-card border-border text-muted-foreground'
                        )}
                    >
                        <Eye className="w-4 h-4" />
                        Активна
                    </button>
                    <button
                        type="button"
                        onClick={() => setValue('is_active', false, { shouldDirty: true })}
                        disabled={isPending}
                        className={cn(
                            'flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all font-bold text-xs flex-1 justify-center',
                            !isActive
                                ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800'
                                : 'bg-card border-border text-muted-foreground'
                        )}
                    >
                        <EyeOff className="w-4 h-4" />
                        Скрыта
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-xl p-3">
                    <p className="text-xs text-red-600 font-bold uppercase">
                        {(error as any)?.response?.data?.message || 'Ошибка обновления'}
                    </p>
                </div>
            )}

            <Button
                type="submit"
                disabled={isPending}
                className="w-full py-6 rounded-xl font-bold uppercase tracking-wider"
            >
                {isPending ? 'Загрузка...' : 'Сохранить изменения'}
            </Button>
        </form>
    );
};
