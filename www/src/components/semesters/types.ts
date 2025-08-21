import z from 'zod';
import type { SemesterType } from '@backend/semester';

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
    startDate: z.iso.date().transform(str => {
        return new Date(`${str}T00:00:00`);
    }),
    endDate: z.iso.date().transform(str => {
        return new Date(`${str}T00:00:00`);
    }),
});

export type SemesterCreateApiData = z.input<typeof semesterCreateApiSchema>;

export const semesterEditApiSchema = z.object({
    id: z.uuid(),
    year: z.number().optional(),
    type: z.enum(['summer', 'winter']).optional(),
    startDate: z.iso
        .date()
        .transform(str => {
            return new Date(`${str}T00:00:00`);
        })
        .optional(),
    endDate: z.iso
        .date()
        .transform(str => {
            return new Date(`${str}T00:00:00`);
        })
        .optional(),
});

export type SemesterEditApiData = z.input<typeof semesterEditApiSchema>;
