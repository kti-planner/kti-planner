import z from 'zod';
import type { UserPublicData } from '@components/users/types';

export interface SubjectData {
    id: string;
    name: string;
    semesterId: string;
    slug: string;
    teachers: UserPublicData[];
    description: string;
    moodleCourseId: string;
    moodleCourseUrl: string;
    duration: number | null;
}

export const subjectCreateApiSchema = z.object({
    name: z.string().trim().nonempty(),
    semesterId: z.uuid(),
    teacherIds: z.uuid().array(),
    description: z.string(),
    moodleCourseId: z.string(),
    duration: z.int().nonnegative().nullable(),
});

export type SubjectCreateApiData = z.input<typeof subjectCreateApiSchema>;

export const subjectEditApiSchema = z.object({
    id: z.uuid(),
    name: z.string().optional(),
    teacherIds: z.uuid().array().optional(),
    description: z.string().optional(),
    moodleCourseId: z.string().optional(),
    duration: z.int().nonnegative().nullable().optional(),
});

export type SubjectEditApiData = z.input<typeof subjectEditApiSchema>;

export const subjectCopyFromPreviousSemesterApiSchema = z.object({
    semesterId: z.uuid(),
    subjectId: z.uuid(),
});

export type SubjectCopyFromPreviousSemesterApiData = z.input<typeof subjectCopyFromPreviousSemesterApiSchema>;
