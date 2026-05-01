import { z } from 'zod';
export const changeStaffPasswordSchema = z.object({
  password: z.string().min(6, 'Минимум 6 символов').max(200, 'Максимум 200 символов'),
});
export type ChangeStaffPasswordFormData = z.infer<typeof changeStaffPasswordSchema>;
