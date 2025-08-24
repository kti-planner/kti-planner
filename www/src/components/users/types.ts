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

export const userCreateApiSchema = z.object({
    name: z.string().trim().nonempty(),
    email: z.string().trim().nonempty(),
    password: z.string().nonempty(),
    role: z.enum(['teacher', 'admin']),
});

export type UserCreateApiData = z.input<typeof userCreateApiSchema>;

export const userEditApiSchema = z.object({
    id: z.uuid(),
    name: z.string().trim().optional(),
    email: z.string().trim().optional(),
});

export type UserEditApiData = z.input<typeof userEditApiSchema>;

export const userEditRoleApiSchema = z.object({
    id: z.uuid(),
    role: z.enum(['teacher', 'admin']),
});

export type UserEditRoleApiData = z.input<typeof userEditRoleApiSchema>;
