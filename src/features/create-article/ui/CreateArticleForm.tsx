'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createArticleSchema, type CreateArticleSchema } from '../model/schema';
import { useCreateArticle } from '@/entities/article/hooks/use-create';
import { Button } from '@/shared/ui/button';
import { Type, FileText, AlignLeft, Tag, Link2 } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { useState, useEffect } from 'react';
import { previewSlug, uploadFile } from '@/entities/article/api/api';
import { FileUpload } from '@/shared/ui/file-upload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { getCategoryArticlesList } from '@/entities/category-article/api/api';

interface Props {
    onSuccess?: () => void;
}

export const CreateArticleForm = ({ onSuccess }: Props) => {
    const { mutate: createArticle, isPending: isCreating, error } = useCreateArticle();
    const [previewSlugValue, setPreviewSlugValue] = useState<string>('');
    const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);

    const isPending = isCreating || isUploadingImage;

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        control,
    } = useForm<CreateArticleSchema>({
        resolver: zodResolver(createArticleSchema),
        defaultValues: {
            category_id: 0,
            title: '',
            description: '',
            content: '',
            image_path: undefined,
        },
    });

    const title = watch('title');

    useEffect(() => {
        getCategoryArticlesList({ limit: 100 })
            .then((data) => setCategories(data?.items || []))
            .catch((err) => console.error('Failed to load categories:', err));
    }, []);

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

    const onSubmit = async (data: CreateArticleSchema) => {
        let imagePath: string;

        if (data.image_path instanceof File) {
            setIsUploadingImage(true);
            try {
                const response = await uploadFile(data.image_path, 'articles');
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

        createArticle(
            {
                category_id: data.category_id,
                title: data.title,
                description: data.description,
                content: data.content,
                image_path: imagePath,
            },
            {
                onSuccess: () => onSuccess?.(),
            }
        );
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Категория + Название в одной строке */}
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-3">
                <Field label="Категория" error={errors.category_id?.message}>
                    <Controller
                        name="category_id"
                        control={control}
                        rules={{
                            required: 'Выберите категорию',
                            min: { value: 1, message: 'Выберите категорию' },
                        }}
                        render={({ field }) => (
                            <Select
                                onValueChange={(val) => field.onChange(Number(val))}
                                value={field.value ? String(field.value) : ''}
                            >
                                <SelectTrigger
                                    className={cn(
                                        'h-10 px-3 text-sm',
                                        errors.category_id && 'border-red-500'
                                    )}
                                >
                                    <Tag className="w-3.5 h-3.5 text-muted-foreground mr-2" />
                                    <SelectValue placeholder="Выберите" />
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
                </Field>

                <Field label="Название статьи" error={errors.title?.message}>
                    <div className="relative">
                        <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <input
                            {...register('title')}
                            placeholder="Как заменить масло в двигателе"
                            disabled={isPending}
                            className={cn(
                                'w-full h-10 pl-9 pr-3 text-sm bg-card border rounded-lg outline-none transition-all font-medium text-foreground',
                                errors.title
                                    ? 'border-red-500'
                                    : 'border-border focus:border-[var(--red)]'
                            )}
                        />
                    </div>
                </Field>
            </div>

            {/* Slug preview */}
            {(previewSlugValue || isGeneratingSlug) && (
                <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 border border-border rounded-lg">
                    <Link2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="text-xs text-muted-foreground font-mono truncate">
                        /articles/
                    </span>
                    <span
                        className={cn(
                            'text-xs font-mono font-semibold truncate',
                            isGeneratingSlug
                                ? 'text-muted-foreground'
                                : 'text-green-600 dark:text-green-400'
                        )}
                    >
                        {isGeneratingSlug ? 'генерация...' : previewSlugValue}
                    </span>
                </div>
            )}

            {/* Описание */}
            <Field label="Описание" error={errors.description?.message}>
                <div className="relative">
                    <FileText className="absolute left-3 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
                    <textarea
                        {...register('description')}
                        placeholder="Краткое описание статьи..."
                        rows={2}
                        disabled={isPending}
                        className={cn(
                            'w-full pl-9 pr-3 py-2 text-sm bg-card border rounded-lg outline-none transition-all font-medium text-foreground resize-none',
                            errors.description
                                ? 'border-red-500'
                                : 'border-border focus:border-[var(--red)]'
                        )}
                    />
                </div>
            </Field>

            {/* Содержимое */}
            <Field label="Содержимое" error={errors.content?.message}>
                <div className="relative">
                    <AlignLeft className="absolute left-3 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
                    <textarea
                        {...register('content')}
                        placeholder="Полное содержимое статьи..."
                        rows={6}
                        disabled={isPending}
                        className={cn(
                            'w-full pl-9 pr-3 py-2 text-sm bg-card border rounded-lg outline-none transition-all font-medium text-foreground resize-none',
                            errors.content
                                ? 'border-red-500'
                                : 'border-border focus:border-[var(--red)]'
                        )}
                    />
                </div>
            </Field>

            {/* Изображение */}
            <Field label="Изображение" error={errors.image_path?.message as string}>
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
            </Field>

            {/* Глобальная ошибка */}
            {error && (
                <div className="px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                        {(error as any)?.response?.data?.message || 'Произошла ошибка при создании'}
                    </p>
                </div>
            )}

            {/* Кнопка submit */}
            <Button
                type="submit"
                disabled={isPending}
                className="w-full h-11 mt-2 bg-[var(--red)] hover:bg-red-600 text-white font-semibold rounded-lg transition-all active:scale-[0.98]"
            >
                {isUploadingImage
                    ? 'Загружаем картинку...'
                    : isCreating
                        ? 'Создание...'
                        : 'Создать статью'}
            </Button>
        </form>
    );
};

// Универсальная обёртка поля с label и ошибкой
function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                {label}
            </label>
            {children}
            {error && (
                <p className="text-[11px] text-red-500 font-medium">{error}</p>
            )}
        </div>
    );
}