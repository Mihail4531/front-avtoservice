'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCategoryArticleSchema, type CreateCategoryArticleSchema } from '../model/schema';
import { useCreateCategoryArticle } from '@/entities/category-article/hooks/use-create';
import { Button } from '@/shared/ui/button';
import { Image as ImageIcon, Type, FileText } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { useState } from 'react';
import { api } from '@/shared/api/api';

interface Props {
    onSuccess?: () => void;
}

export const CreateCategoryArticleForm = ({ onSuccess }: Props) => {
    const { mutate: createCategoryArticle, isPending, error } = useCreateCategoryArticle();
    const [previewSlug, setPreviewSlug] = useState<string>('');
    const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);

    const { register, handleSubmit, formState: { errors }, watch } = useForm<CreateCategoryArticleSchema>({
        resolver: zodResolver(createCategoryArticleSchema),
        defaultValues: {
            title: '',
            description: '',
            image_path: '',
        },
    });

    const title = watch('title');

    // Функция для предпросмотра slug
    const handleGenerateSlugPreview = async () => {
        if (!title || title.length < 3) return;
        
        setIsGeneratingSlug(true);
        try {
            const response = await api.get('/dashboard/admin/categories/articles/slug-preview', {
                params: { title }
            });
            setPreviewSlug(response.data.slug);
        } catch (err) {
            console.error('Ошибка при генерации slug:', err);
        } finally {
            setIsGeneratingSlug(false);
        }
    };

    const onSubmit = (data: CreateCategoryArticleSchema) => {
        createCategoryArticle(data, {
            onSuccess: () => onSuccess?.(),
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Информация о бизнес-ограничениях */}
            <div className="bg-muted/50 border border-border rounded-xl p-4">
                <p className="text-xs text-muted-foreground font-medium">
                    <strong>Обратите внимание:</strong> Slug генерируется автоматически на основе названия категории.
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
                            className={cn(
                                "w-full pl-10 pr-4 py-3 bg-card border rounded-xl outline-none transition-all font-semibold text-foreground",
                                errors.title ? 'border-red-500' : 'border-border focus:border-[var(--red)]'
                            )}
                            onBlur={handleGenerateSlugPreview}
                        />
                    </div>
                    {errors.title && (
                        <p className="text-red-500 text-[10px] font-bold uppercase ml-1">
                            {errors.title.message}
                        </p>
                    )}
                    
                    {/* Предпросмотр slug */}
                    {(previewSlug || isGeneratingSlug) && (
                        <div className="mt-2 p-3 bg-muted/30 border border-border rounded-lg">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Предпросмотр URL:</p>
                            <p className="text-sm font-mono text-foreground">
                                {isGeneratingSlug ? (
                                    <span className="text-muted-foreground">Генерация...</span>
                                ) : (
                                    <span className="text-green-600 dark:text-green-400">/dashboard/admin/categories/articles/{previewSlug}</span>
                                )}
                            </p>
                        </div>
                    )}
                </div>

                {/* Поле Описание */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                        Описание
                    </label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <textarea
                            {...register('description')}
                            placeholder="Краткое описание категории..."
                            rows={3}
                            className={cn(
                                "w-full pl-10 pr-4 py-3 bg-card border rounded-xl outline-none transition-all font-semibold text-foreground resize-none",
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

                {/* Поле Изображение (URL) */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                        Путь к изображению
                    </label>
                    <div className="relative">
                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            {...register('image_path')}
                            placeholder="/images/category-example.png"
                            className={cn(
                                "w-full pl-10 pr-4 py-3 bg-card border rounded-xl outline-none transition-all font-semibold text-foreground",
                                errors.image_path ? 'border-red-500' : 'border-border focus:border-[var(--red)]'
                            )}
                        />
                    </div>
                    {errors.image_path && (
                        <p className="text-red-500 text-[10px] font-bold uppercase ml-1">
                            {errors.image_path.message}
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
                {isPending ? 'Создание...' : 'Создать категорию'}
            </Button>
        </form>
    );
};
