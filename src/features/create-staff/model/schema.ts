import { z } from 'zod';
export const createStaffSchema = z.object({
  full_name: z.string().min(4, 'Минимум 4 символа').max(100, 'Максимум 100 символов'),
  email: z.string().email('Некорректный email').max(255, 'Максимум 255 символов'),
  password: z.string().min(6, 'Минимум 6 символов').max(200, 'Максимум 200 символов'),
  role: z.enum(['manager', 'admin'], { required_error: 'Выберите роль' }),
});
export type CreateStaffFormData = z.infer<typeof createStaffSchema>;
