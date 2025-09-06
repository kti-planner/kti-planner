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

export const scheduleChangeDataSchema = z.object({
    date: dateStringSchema,
    type: z.enum(['holiday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
});

export type ScheduleChangeData = z.input<typeof scheduleChangeDataSchema>;

export const scheduleChangeTypeLabels: Record<LangId, Record<ScheduleChangeType, string>> = {
    'en': {
        'holiday': 'holiday',
        'monday': "monday's schedule",
        'tuesday': "tuesday's schedule",
        'wednesday': "wednesday's schedule",
        'thursday': "thursday's schedule",
        'friday': "friday's schedule",
        'saturday': "saturday's schedule",
        'sunday': "sunday's schedule",
    },
    'pl': {
        'holiday': 'dzień wolny',
        'monday': 'zajęcia wg planu z poniedziałku',
        'tuesday': 'zajęcia wg planu z wtorku',
        'wednesday': 'zajęcia wg planu z środy',
        'thursday': 'zajęcia wg planu z czwartku',
        'friday': 'zajęcia wg planu z piątku',
        'saturday': 'zajęcia wg planu z soboty',
        'sunday': 'zajęcia wg planu z niedzieli',
    },
};
