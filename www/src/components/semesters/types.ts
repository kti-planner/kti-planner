import z from 'zod';
import type { ScheduleChangeType, SemesterType } from '@backend/semester';
import { dateStringSchema } from '@components/utils';

export interface SemesterData {
    id: string;
    type: SemesterType;
    year: number;
    slug: string;
    startDate: string;
    endDate: string;
}

export const semesterCreateApiSchema = z.object({
    year: z.number(),
    type: z.enum(['summer', 'winter']),
    startDate: dateStringSchema,
    endDate: dateStringSchema,
});

export type SemesterCreateApiData = z.input<typeof semesterCreateApiSchema>;

export const semesterEditApiSchema = z.object({
    id: z.uuid(),
    year: z.number().optional(),
    type: z.enum(['summer', 'winter']).optional(),
    startDate: dateStringSchema.optional(),
    endDate: dateStringSchema.optional(),
});

export type SemesterEditApiData = z.input<typeof semesterEditApiSchema>;

export interface ScheduleChangeData {
    date: string;
    type: ScheduleChangeType;
}
