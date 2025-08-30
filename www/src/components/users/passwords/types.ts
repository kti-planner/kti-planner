import z from 'zod';

export const passwordChangeApiSchema = z.object({
    currentPassword: z.string().nonempty(),
    newPassword: z.string().nonempty(),
    newPasswordRepeated: z.string().nonempty(),
});

export type PasswordChangeApiData = z.input<typeof passwordChangeApiSchema>;

export const passwordResetApiSchema = z.object({
    id: z.uuid(),
    password: z.string().nonempty(),
});

export type PasswordResetApiData = z.input<typeof passwordResetApiSchema>;
