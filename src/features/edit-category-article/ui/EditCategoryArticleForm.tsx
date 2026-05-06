'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { editCategoryArticleSchema, type EditCategoryArticleSchema } from '../model/schema';
import { useUpdateCategoryArticle } from '@/entities/category-article/hooks/use-update';
import { Button } from '@/shared/ui/button';
import { Type, FileText, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { useState, useEffect } from 'react';
import { previewSlug, uploadFile } from '@/entities/category-article/api/api';
import { FileUpload } from '@/shared/ui/file-upload';
import type { CategoryArticle } from '@/entities/category-article/model/types';

interface Props {
    category: CategoryArticle;
    onSuccess?: () => void;
}

// Извлекаем относительный путь из полного URL
function extractRelativePath(url: string | undefined): string {
    if (!url) return '';
    if (url.startsWith('http')) {
        const match = url.match(/\/uploads\/(.+)$/);
        return match ? match[1] : '';
    }
    return url;
}

export const EditCategoryArticleForm = ({ category, onSuccess }: Props) => {
    const { mutate: updateCategoryArticle, isPending: isUpdating, error } = useUpdateCategoryArticle();
    const [previewSlugValue, setPreviewSlugValue] = useState<string>(category.slug);
    const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    const isPending = isUpdating || isUploadingImage;

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        control,
        setValue,
    } = useForm<EditCategoryArticleSchema>({
        resolver: zodResolver(editCategoryArticleSchema),
        defaultValues: {
            title: category.title,
            version: category.version,
            description: category.description,
            image_path: extractRelativePath(category.image_url),
            is_active: category.is_active,
        },
    });

    const title = watch('title');
    const isActive = watch('is_active');

    // Превью slug с debounce
    useEffect(() => {
        if (!title || title.length < 3) {
            setPreviewSlugValue('');
            return;
        }
        if (title === category.title) {
            setPreviewSlugValue(category.slug);
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
    }, [title, category.title, category.slug]);

    const onSubmit = async (data: EditCategoryArticleSchema) => {
        let imagePath: string;

        if (data.image_path instanceof File) {
            setIsUploadingImage(true);
            try {
                const response = await uploadFile(data.image_path, 'categories/articles');
                imagePath = response.path;
            } catch (err) {
                console.error('Ошибка загрузки картинки:', err);
                alert('Не удалось загрузить картинку');
                setIsUploadingImage(false);
                return;
            }
            setIsUploadingImage(false);
        } else {
            imagePath = data.image_path;
        }

        updateCategoryArticle(
            {
                id: category.id,
                data: {
                    title: data.title,
                    version: data.version,
                    description: data.description,
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
            onSubmit={handleSubmit(onSubmit, (errs) => console.log('Validation errors:', errs))}
            className="flex flex-col gap-5 max-h-[80vh] overflow-y-auto pr-2"
        >
            <div className="bg-muted/50 border border-border rounded-xl p-3">
                <p className="text-xs text-muted-foreground font-medium">
                    <strong>Обратите внимание:</strong> Slug генерируется автоматически. Версия используется для защиты от race condition.
                </p>
            </div>

            {/* Название */}
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                    Название категории
                </label>
                <div className="relative">
                    <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        {...register('title')}
                        placeholder="Например: Техническое обслуживание"
                        disabled={isPending}
                        className={cn(
                            'w-full pl-10 pr-4 py-2.5 bg-card border rounded-xl outline-none transition-all font-semibold text-foreground',
                            errors.title ? 'border-red-500' : 'border-border focus:border-[var(--red)]'
                        )}
                    />
                </div>
                {errors.title && (
                    <p className="text-red-500 text-[10px] font-bold uppercase ml-1">
                        {errors.title.message}
                    </p>
                )}

                {(previewSlugValue || isGeneratingSlug) && (
                    <div className="mt-1.5 p-2.5 bg-gradient-to-r from-muted/30 to-muted/50 border border-border rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                            <div
                                className={cn(
                                    'w-2 h-2 rounded-full',
                                    isGeneratingSlug ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'
                                )}
                            />
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                                {isGeneratingSlug ? 'Генерация URL...' : 'Автоматически сгенерированный URL'}
                            </p>
                        </div>
                        <div className="flex items-center gap-1 bg-card/50 rounded-md p-1.5 font-mono text-xs border border-border/50 overflow-hidden">
                            <span className="text-muted-foreground select-none shrink-0 truncate">
                                /categories/articles/
                            </span>
                            <span
                                className={cn(
                                    'font-bold truncate',
                                    isGeneratingSlug ? 'text-muted-foreground' : 'text-green-600 dark:text-green-400'
                                )}
                            >
                                {isGeneratingSlug ? '...' : previewSlugValue}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Скрытое поле версии */}
            <input type="hidden" {...register('version', { valueAsNumber: true })} />

            {/* Описание */}
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                    Описание
                </label>
                <div className="relative">
                    <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <textarea
                        {...register('description')}
                        placeholder="Краткое описание категории..."
                        rows={3}
                        disabled={isPending}
                        className={cn(
                            'w-full pl-10 pr-4 py-2.5 bg-card border rounded-xl outline-none transition-all font-medium text-foreground resize-none',
                            errors.description ? 'border-red-500' : 'border-border focus:border-[var(--red)]'
                        )}
                    />
                </div>
                {errors.description && (
                    <p className="text-red-500 text-[10px] font-bold uppercase ml-1">
                        {errors.description.message}
                    </p>
                )}
            </div>

            {/* Изображение */}
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                    Изображение категории
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
                {errors.image_path && (
                    <p className="text-red-500 text-[10px] font-bold uppercase ml-1">
                        {errors.image_path.message as string}
                    </p>
                )}
            </div>

            {/* Активность */}
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                    Статус активности
                </label>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setValue('is_active', true, { shouldDirty: true, shouldValidate: true })}
                        disabled={isPending}
                        className={cn(
                            'flex items-center gap-2 px-3 py-2 rounded-xl border transition-all font-bold text-sm flex-1 justify-center',
                            isActive === true
                                ? 'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-400'
                                : 'bg-card border-border text-muted-foreground hover:bg-muted/50'
                        )}
                    >
                        <Eye className="w-4 h-4" />
                        Активна
                    </button>
                    <button
                        type="button"
                        onClick={() => setValue('is_active', false, { shouldDirty: true, shouldValidate: true })}
                        disabled={isPending}
                        className={cn(
                            'flex items-center gap-2 px-3 py-2 rounded-xl border transition-all font-bold text-sm flex-1 justify-center',
                            isActive === false
                                ? 'bg-muted border-border text-muted-foreground'
                                : 'bg-card border-border text-muted-foreground hover:bg-muted/50'
                        )}
                    >
                        <EyeOff className="w-4 h-4" />
                        Неактивна
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                        {(error as any)?.response?.data?.message || 'Произошла ошибка при обновлении'}
                    </p>
                </div>
            )}

            <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-[var(--red)] hover:bg-red-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-100 transition-all active:scale-[0.98]"
            >
                {isUploadingImage
                    ? 'Загружаем картинку...'
                    : isUpdating
                        ? 'Сохранение изменений...'
                        : 'Сохранить изменения'}
            </Button>
        </form>
    );
};