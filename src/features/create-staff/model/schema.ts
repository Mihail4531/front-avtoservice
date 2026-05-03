import { z } from 'zod';

export const createStaffSchema = z.object({
    full_name: z
        .string()
        .min(4, 'Имя должно содержать минимум 4 символа')
        .max(100, 'Имя слишком длинное'),
    email: z
        .string()
        .email('Введите корректный email адрес')
        .max(255, 'Email слишком длинный'),
    password: z
        .string()
        .min(6, 'Пароль должен содержать минимум 6 символов')
        .max(200, 'Пароль слишком длинный'),
    role: z.enum(['manager', 'admin']),
});

export type CreateStaffSchema = z.infer<typeof createStaffSchema>;
