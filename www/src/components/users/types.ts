import z from 'zod';
import type { UserRole } from '@backend/user';

export interface UserData {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

export const loginApiSchema = z.object({
    email: z.string(),
    password: z.string(),
});

export type LoginApiData = z.input<typeof loginApiSchema>;
