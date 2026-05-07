import { z } from 'zod';

const imageValueSchema = z.custom<File | string>(
    (val) => val instanceof File || (typeof val === 'string' && val.length > 0),
    { message: 'Изображение обязательно для загрузки' }
);

export const createArticleSchema = z.object({
    category_id: z.number().min(1, 'Категория обязательна'),
    title: z.string().trim().min(3, 'Название должно содержать минимум 3 символа').max(150, 'Название не должно превышать 150 символов'),
    description: z.string().trim().min(3, 'Описание должно содержать минимум 3 символа').max(500, 'Описание не должно превышать 500 символов'),
    content: z.string().trim().min(10, 'Содержимое должно содержать минимум 10 символов'),
    image_path: imageValueSchema,
    is_popular: z.boolean().optional(),
});

export type CreateArticleSchema = z.infer<typeof createArticleSchema>;
