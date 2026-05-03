import { z } from 'zod';

export const loginSchema= z.object({
    email: z.string().trim().email('Некорректный email'),
    password: z.string().trim().min(6, 'Минимум 6 символов'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;