'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateArticle } from '@/entities/article/hooks/use-create';
import { useUpdateArticle } from '@/entities/article/hooks/use-update';
import { uploadFile } from '@/entities/article/api/api';
import type { Article } from '@/entities/article/model/types';

/**
 * Схема валидации для статьи
 * Соответствует CreateArticleRequest/UpdateArticleRequest и схеме БД:
 * - category_id: INTEGER NOT NULL REFERENCES categories_articles(id), min=1
 * - title: VARCHAR(150) NOT NULL CHECK (char_length(btrim(title)) BETWEEN 3 AND 150)
 * - description: VARCHAR(500) NOT NULL CHECK (char_length(btrim(description)) BETWEEN 3 AND 500)
 * - content: TEXT NOT NULL CHECK (char_length(btrim(content)) >= 10)
 * - image_path: VARCHAR(255) NOT NULL CHECK (btrim(image_path) <> '')
 * - version: BIGINT NOT NULL DEFAULT 1 (только для обновления, не отправляется при создании)
 */
export const articleEditorSchema = z.object({
    category_id: z.number().int().min(1, 'Выберите категорию'),
    title: z.string().trim().min(3, 'Минимум 3 символа').max(150, 'Максимум 150 символов'),
    description: z.string().trim().min(3, 'Минимум 3 символа').max(500, 'Максимум 500 символов'),
    content: z.string().trim().min(10, 'Минимум 10 символов'),
    image_path: z.union([
        z.string().min(1, 'Загрузите обложку'), 
        z.instanceof(File)
    ]),
    is_active: z.boolean(),
    version: z.number().int().min(1, 'Версия должна быть больше 0').optional(), // только для редактирования
});

export type ArticleEditorSchema = z.infer<typeof articleEditorSchema>;

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

export const useArticleEditor = (article?: Article | null) => {
    const navigate = useNavigate();
    const isEdit = article !== undefined && article !== null;

    const { mutate: createArticle, isPending: isCreating, error: createError } = useCreateArticle();
    const { mutate: updateArticle, isPending: isUpdating, error: updateError } = useUpdateArticle();
    const [isUploading, setIsUploading] = useState(false);

    const isPending = isCreating || isUpdating || isUploading;
    const error = createError || updateError;

    const form = useForm<ArticleEditorSchema>({
        resolver: zodResolver(articleEditorSchema),
        defaultValues: {
            category_id: article?.category?.id ?? 0,
            title: article?.title ?? '',
            description: article?.description ?? '',
            content: article?.content ?? '',
            image_path: article ? extractRelativePath(article.image_url) : '',
            is_active: article?.is_active ?? false,
            version: article?.version,
        },
        mode: 'onChange', // Валидация при изменении полей
    });

    // Синхронизация формы при загрузке данных
    useEffect(() => {
        if (article) {
            form.reset({
                category_id: article.category?.id ?? 0,
                title: article.title,
                description: article.description,
                content: article.content,
                image_path: extractRelativePath(article.image_url),
                is_active: article.is_active,
                version: article.version,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [article]);

    const submit = async (values: ArticleEditorSchema) => {
        let imagePath: string;

        // Загружаем картинку если File
        if (values.image_path instanceof File) {
            setIsUploading(true);
            try {
                const response = await uploadFile(values.image_path, 'articles');
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

        if (isEdit && article) {
            // При обновлении отправляем version
            updateArticle(
                {
                    id: article.id,
                    data: {
                        category_id: values.category_id,
                        title: values.title,
                        description: values.description,
                        content: values.content,
                        image_path: imagePath,
                        is_active: values.is_active,
                        version: values.version!,
                    },
                },
                {
                    onSuccess: () => navigate('/dashboard/admin/articles'),
                }
            );
        } else {
            // При создании НЕ отправляем version (бэкенд сам установит 1)
            createArticle(
                {
                    category_id: values.category_id,
                    title: values.title,
                    description: values.description,
                    content: values.content,
                    image_path: imagePath,
                },
                {
                    onSuccess: () => navigate('/dashboard/admin/articles'),
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
