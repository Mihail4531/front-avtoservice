import { z } from 'zod';

const imageValueSchema = z.custom<File | string>(
    (val) => val instanceof File || (typeof val === 'string' && val.length > 0),
    { message: 'Изображение обязательно для загрузки' }
);

export const createCategoryArticleSchema = z.object({
    title: z.string().trim().min(3, 'Название должно содержать минимум 3 символа').max(100, 'Название не должно превышать 100 символов'),
    description: z.string().trim().min(3, 'Описание должно содержать минимум 3 символа').max(255, 'Описание не должно превышать 255 символов'),
    image_path: imageValueSchema,
});

export type CreateCategoryArticleSchema = z.infer<typeof createCategoryArticleSchema>;