import { z } from 'zod';
export const updateStaffSchema = z.object({
  full_name: z.string().min(4, 'Минимум 4 символа').max(100, 'Максимум 100 символов'),
  email: z.string().email('Некорректный email').max(255, 'Максимум 255 символов'),
  role: z.enum(['manager', 'admin', 'super_admin'], { required_error: 'Выберите роль' }),
  is_active: z.boolean(),
});
export type UpdateStaffFormData = z.infer<typeof updateStaffSchema>;
