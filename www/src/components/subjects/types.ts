import z from 'zod';
import type { UserData } from '@components/users/types';

export interface SubjectData {
    id: string;
    name: string;
    semesterId: string;
    slug: string;
    teachers: UserData[];
}

export const subjectCreateApiSchema = z.object({
    name: z.string().trim().nonempty(),
    semesterId: z.uuid(),
    teacherIds: z.uuid().array(),
});

export type SubjectCreateApiData = z.input<typeof subjectCreateApiSchema>;

export const subjectEditApiSchema = z.object({
    id: z.uuid(),
    name: z.string().optional(),
    teacherIds: z.uuid().array().optional(),
});

export type SubjectEditApiData = z.input<typeof subjectEditApiSchema>;
