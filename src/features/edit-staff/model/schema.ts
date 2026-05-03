import { z } from 'zod';
import { STAFF_ROLES } from '@/entities/staff/model/types';

export const editStaffSchema = z.object({
    full_name: z
        .string()
        .min(4, 'Имя должно содержать минимум 4 символа')
        .max(100, 'Имя слишком длинное'),
    email: z
        .string()
        .email('Введите корректный email адрес')
        .max(255, 'Email слишком длинный'),
    role: z.enum(STAFF_ROLES),
    is_active: z.boolean(),
});

export type EditStaffSchema = z.infer<typeof editStaffSchema>;
