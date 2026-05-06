import { z } from 'zod';

const imageValueSchema = z.custom<File | string>(
    (val) => val instanceof File || (typeof val === 'string' && val.length > 0),
    { message: 'Изображение обязательно' }
);

export const editCategoryArticleSchema = z.object({
    title: z.string().trim().min(3, 'От 3 до 100 символов').max(100),
    version: z.number().min(1, 'Версия должна быть больше 0'),
    description: z.string().trim().min(3, 'От 3 до 255 символов').max(255),
    image_path: imageValueSchema,
    is_active: z.boolean(),
});

export type EditCategoryArticleSchema = z.infer<typeof editCategoryArticleSchema>;
