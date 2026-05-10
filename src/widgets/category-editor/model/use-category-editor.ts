'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateCategoryArticle } from '@/entities/category-article/hooks/use-create';
import { useUpdateCategoryArticle } from '@/entities/category-article/hooks/use-update';
import { uploadFile } from '@/entities/category-article/api/api';
import type { CategoryArticle } from '@/entities/category-article/model/types';

/**
 * Схема валидации для категории статей
 * Соответствует CreateCategoryArticleRequest/UpdateCategoryArticleRequest и схеме БД:
 * - title: VARCHAR(100) NOT NULL CHECK (char_length(btrim(title)) BETWEEN 3 AND 100)
 * - description: VARCHAR(255) NOT NULL CHECK (char_length(btrim(description)) BETWEEN 3 AND 255)
 * - image_path: VARCHAR(255) NOT NULL CHECK (btrim(image_path) <> '')
 * - version: BIGINT NOT NULL DEFAULT 1 (только для обновления, не отправляется при создании)
 */
export const categoryEditorSchema = z.object({
    title: z.string().trim().min(3, 'Минимум 3 символа').max(100, 'Максимум 100 символов'),
    description: z.string().trim().min(3, 'Минимум 3 символа').max(255, 'Максимум 255 символов'),
    image_path: z.union([
        z.string().min(1, 'Загрузите обложку'), 
        z.instanceof(File)
    ]),
    is_active: z.boolean(),
    version: z.number().int().min(1, 'Версия должна быть больше 0').optional(), // только для редактирования
});

export type CategoryEditorSchema = z.infer<typeof categoryEditorSchema>;

/**
 * Утилита для извлечения относительного пути из URL
 */
export function extractRelativePath(url: string | undefined): string {
    if (!url) return '';
    if (url.startsWith('http')) {
        const match = url.match(/\/uploads\/(.+)$/);
        return match ? match[1] : '';
    }
    return url;
}

export const useCategoryEditor = (category?: CategoryArticle | null) => {
    const navigate = useNavigate();
    const isEdit = category !== undefined && category !== null;

    const { mutate: createCategory, isPending: isCreating, error: createError } = useCreateCategoryArticle();
    const { mutate: updateCategory, isPending: isUpdating, error: updateError } = useUpdateCategoryArticle();
    const [isUploading, setIsUploading] = useState(false);

    const isPending = isCreating || isUpdating || isUploading;
    const error = createError || updateError;

    const form = useForm<CategoryEditorSchema>({
        resolver: zodResolver(categoryEditorSchema),
        defaultValues: {
            title: category?.title ?? '',
            description: category?.description ?? '',
            image_path: category ? extractRelativePath(category.image_url) : '',
            is_active: category?.is_active ?? false,
            version: category?.version,
        },
        mode: 'onChange', // Валидация при изменении полей
    });

    // Синхронизация формы при загрузке данных
    useEffect(() => {
        if (category) {
            form.reset({
                title: category.title,
                description: category.description,
                image_path: extractRelativePath(category.image_url),
                is_active: category.is_active,
                version: category.version,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category]);

    const submit = async (values: CategoryEditorSchema) => {
        let imagePath: string;

        // Обработка загрузки файла, если выбрано новое изображение
        if (values.image_path instanceof File) {
            setIsUploading(true);
            try {
                const response = await uploadFile(values.image_path, 'categories/articles');
                imagePath = response.path;
            } catch (err) {
                console.error('Ошибка загрузки картинки:', err);
                setIsUploading(false);
                return;
            }
            setIsUploading(false);
        } else {
            imagePath = values.image_path;
        }

        if (isEdit && category) {
            // При обновлении отправляем version
            updateCategory(
                {
                    id: category.id,
                    data: {
                        title: values.title,
                        description: values.description,
                        image_path: imagePath,
                        is_active: values.is_active,
                        version: values.version!,
                    },
                },
                {
                    onSuccess: () => navigate('/dashboard/admin/categories/articles'),
                }
            );
        } else {
            // При создании НЕ отправляем version (бэкенд сам установит 1)
            createCategory(
                {
                    title: values.title,
                    description: values.description,
                    image_path: imagePath,
                },
                {
                    onSuccess: () => navigate('/dashboard/admin/categories/articles'),
                }
            );
        }
    };

    const onSubmit = form.handleSubmit((values) => {
        submit(values);
    });

    return {
        form,
        isEdit,
        isPending,
        error,
        onSubmit,
    };
};
