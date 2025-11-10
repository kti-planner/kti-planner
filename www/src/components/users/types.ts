import z from 'zod';
import type { UserRole } from '@backend/user';

export interface UserPublicData {
    id: string;
    name: string;
    role: UserRole;
}

export interface UserDetailsData {
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

const userRoleSchema = z.enum(['teacher', 'admin']);

export const userCreateApiSchema = z.object({
    name: z.string().trim().nonempty(),
    email: z.string().trim().nonempty(),
    password: z.string().nonempty(),
    role: userRoleSchema,
});

export type UserCreateApiData = z.input<typeof userCreateApiSchema>;

export const userEditApiSchema = z.object({
    name: z.string().trim().optional(),
    email: z.string().trim().optional(),
    role: userRoleSchema.optional(),
});

export type UserEditApiData = z.input<typeof userEditApiSchema>;
