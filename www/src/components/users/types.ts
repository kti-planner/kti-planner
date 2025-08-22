import z from 'zod';

export interface UserData {
    id: string;
    name: string;
}

export const loginApiSchema = z.object({
    email: z.string(),
    password: z.string(),
});

export type LoginApiData = z.input<typeof loginApiSchema>;
