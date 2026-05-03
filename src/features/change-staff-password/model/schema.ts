import * as z from 'zod';

export const changeStaffPasswordSchema = z.object({
    password: z.string().min(6, 'Минимум 6 символов').max(200),
    confirm_password: z.string()
}).refine((data) => data.password === data.confirm_password, {
    message: "Пароли не совпадают",
    path: ["confirm_password"],
});

export type ChangeStaffPasswordFormValues = z.infer<typeof changeStaffPasswordSchema>;
