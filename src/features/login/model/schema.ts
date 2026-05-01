import { z } from 'zod';
export const loginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Минимум 6 символов').max(200, 'Максимум 200 символов'),
});
export type LoginFormData = z.infer<typeof loginSchema>;
