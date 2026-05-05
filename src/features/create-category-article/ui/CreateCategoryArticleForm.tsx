'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCategoryArticleSchema, type CreateCategoryArticleSchema } from '../model/schema';
import { useCreateCategoryArticle } from '@/entities/category-article/hooks/use-create';
import { Button } from '@/shared/ui/button';
import { Type, FileText } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { useState, useEffect } from 'react';
import { previewSlug, uploadFile } from '@/entities/category-article/api/api';
import { FileUpload } from '@/shared/ui/file-upload';

interface Props {
    onSuccess?: () => void;
}

export const CreateCategoryArticleForm = ({ onSuccess }: Props) => {
    const { mutate: createCategoryArticle, isPending: isCreating, error } = useCreateCategoryArticle();
    const [previewSlugValue, setPreviewSlugValue] = useState<string>('');
    const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    const isPending = isCreating || isUploadingImage;

    const { register, handleSubmit, formState: { errors }, watch, control } = useForm<CreateCategoryArticleSchema>({
        resolver: zodResolver(createCategoryArticleSchema),
        defaultValues: {
            title: '',
            description: '',
            image_path: undefined,
        },
    });

    const title = watch('title');

    useEffect(() => {
        if (!title || title.length < 3) {
            setPreviewSlugValue('');
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
    }, [title]);

    const onSubmit = async (data: CreateCategoryArticleSchema) => {
        let imagePath: string;

        // Если в image_path лежит File — загружаем на бэк
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
            // Уже существующий путь (для редактирования)
            imagePath = data.image_path;
        }

        createCategoryArticle(
            {
                title: data.title,
                description: data.description,
                image_path: imagePath,
            },
            {
                onSuccess: () => onSuccess?.(),
            }
        );
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-muted/50 border border-border rounded-xl p-4">
                <p className="text-xs text-muted-foreground font-medium">
                    <strong>Обратите внимание:</strong> Slug генерируется автоматически на основе названия категории. Изображение загружается при сохранении формы.
                </p>
            </div>

            <div className="space-y-5">
                {/* Поле Название */}
                <div className="space-y-2">
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
                                "w-full pl-10 pr-4 py-3 bg-card border rounded-xl outline-none transition-all font-semibold text-foreground",
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
                        <div className="mt-2 p-3 bg-gradient-to-r from-muted/30 to-muted/50 border border-border rounded-lg">
                            <div className="flex items-center gap-2 mb-1.5">
                                <div className={cn(
                                    "w-2 h-2 rounded-full",
                                    isGeneratingSlug ? "bg-yellow-500 animate-pulse" : "bg-green-500"
                                )} />
                                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                                    {isGeneratingSlug ? "Генерация URL..." : "Автоматически сгенерированный URL"}
                                </p>
                            </div>
                            <div className="flex items-center gap-1 bg-card/50 rounded-md p-2 font-mono text-xs border border-border/50 overflow-hidden">
                                <span className="text-muted-foreground select-none shrink-0">/dashboard/admin/categories/articles/</span>
                                <span className={cn(
                                    "font-bold truncate",
                                    isGeneratingSlug ? "text-muted-foreground" : "text-green-600 dark:text-green-400"
                                )}>
                                    {isGeneratingSlug ? 'обработка...' : previewSlugValue}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Описание */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                        Описание
                    </label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <textarea
                            {...register('description')}
                            placeholder="Краткое описание категории..."
                            rows={4}
                            disabled={isPending}
                            className={cn(
                                "w-full pl-10 pr-4 py-3 bg-card border rounded-xl outline-none transition-all font-medium text-foreground resize-y",
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
                <div className="space-y-2">
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
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                        {(error as any)?.response?.data?.message || 'Произошла ошибка при создании'}
                    </p>
                </div>
            )}

            <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-[var(--red)] hover:bg-red-600 text-white font-bold py-6 rounded-xl shadow-lg shadow-red-100 transition-all active:scale-[0.98]"
            >
                {isUploadingImage ? 'Загружаем картинку...' : isCreating ? 'Создание...' : 'Создать категорию'}
            </Button>
        </form>
    );
};