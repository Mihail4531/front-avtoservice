import { z } from 'zod';

export const createCategoryArticleSchema = z.object({
    title: z
        .string()
        .min(3, 'Название должно содержать минимум 3 символа')
        .max(100, 'Название слишком длинное'),
    description: z
        .string()
        .min(3, 'Описание должно содержать минимум 3 символа')
        .max(255, 'Описание слишком длинное'),
    image_path: z
        .string()
        .min(1, 'Изображение обязательно'),
});

export type CreateCategoryArticleSchema = z.infer<typeof createCategoryArticleSchema>;
