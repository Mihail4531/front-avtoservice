import { z } from 'zod';
export const updateMeSchema = z.object({
  full_name: z.string().min(4, 'Минимум 4 символа').max(100, 'Максимум 100 символов'),
  email: z.string().email('Некорректный email').max(255, 'Максимум 255 символов'),
});
export type UpdateMeFormData = z.infer<typeof updateMeSchema>;
