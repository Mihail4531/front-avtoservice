import { z } from 'zod';
export const changePasswordSchema = z.object({
  old_password: z.string().min(6, 'Минимум 6 символов').max(200, 'Максимум 200 символов'),
  password: z.string().min(6, 'Минимум 6 символов').max(200, 'Максимум 200 символов'),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, { message: 'Пароли не совпадают', path: ['confirm_password'] });
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
