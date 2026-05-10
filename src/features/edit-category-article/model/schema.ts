import { z } from 'zod';

/**
 * Схема валидации для редактирования категории статей
 * Соответствует UpdateCategoryArticleRequest и схеме БД:
 * - title: VARCHAR(100) NOT NULL CHECK (char_length(btrim(title)) BETWEEN 3 AND 100)
 * - description: VARCHAR(255) NOT NULL CHECK (char_length(btrim(description)) BETWEEN 3 AND 255)
 * - image_path: VARCHAR(255) NOT NULL CHECK (btrim(image_path) <> '')
 * - version: BIGINT NOT NULL DEFAULT 1, min=1
 */
export const editCategoryArticleSchema = z.object({
    title: z.string().trim().min(3, 'Название должно содержать минимум 3 символа').max(100, 'Название не должно превышать 100 символов'),
    version: z.number().min(1, 'Версия должна быть больше 0'),
    description: z.string().trim().min(3, 'Описание должно содержать минимум 3 символа').max(255, 'Описание не должно превышать 255 символов'),
    image_path: z.union([
        z.instanceof(File),
        z.string().min(1, 'Изображение обязательно для загрузки')
    ]),
    is_active: z.boolean(),
});

export type EditCategoryArticleSchema = z.infer<typeof editCategoryArticleSchema>;
