import * as z from 'zod';

export const changePasswordSchema = z.object({
    old_password: z.string().min(6, 'Минимум 6 символов').max(200),
    password: z.string().min(6, 'Минимум 6 символов').max(200),
    confirm_password: z.string()
}).refine((data) => data.password === data.confirm_password, {
    message: "Пароли не совпадают",
    path: ["confirm_password"],
});

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;