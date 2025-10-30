import z from 'zod';
import type { ClassroomData } from '@components/classrooms/types';
import type { SemesterData } from '@components/semesters/types';
import type { UserPublicData } from '@components/users/types';
import { dateTimeStringSchema } from '@components/utils';

export interface CalendarEventData {
    id: string;
    name: string;
    user: UserPublicData | null;
    classroom: ClassroomData | null;
    semester: SemesterData;
    startDate: string;
    endDate: string;
}

export const calendarEventCreateApiSchema = z.object({
    name: z.string(),
    classroomId: z.uuid().nullable(),
    durations: z
        .object({
            startDate: dateTimeStringSchema,
            endDate: dateTimeStringSchema,
        })
        .array(),
});

export type CalendarEventCreateApiData = z.input<typeof calendarEventCreateApiSchema>;

export const calendarEventEditApiSchema = z.object({
    id: z.uuid(),
    name: z.string().optional(),
    classroomId: z.uuid().nullable().optional(),
    startDate: dateTimeStringSchema.optional(),
    endDate: dateTimeStringSchema.optional(),
});

export type CalendarEventEditApiData = z.input<typeof calendarEventEditApiSchema>;
