import { z } from 'zod';

export const updateProfileSchema = z.object({
    full_name: z
        .string()
        .min(4, 'Имя должно содержать минимум 4 символа')
        .max(100, 'Имя слишком длинное'),
    email: z
        .string()
        .email('Введите корректный email адрес')
        .max(255, 'Email слишком длинный'),
    version: z.number().min(1, 'Версия должна быть больше 0'),
});

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;