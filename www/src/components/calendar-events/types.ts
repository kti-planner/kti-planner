import z from 'zod';
import type { EventType } from '@backend/calendar-events';
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
    type: EventType;
}

const typeSchema = z.enum(['rector hours', 'class reservation']);

export const calendarEventCreateApiSchema = z.object({
    name: z.string(),
    userId: z.uuid(),
    classroomId: z.uuid().nullable(),
    durations: z
        .object({
            startDate: dateTimeStringSchema,
            endDate: dateTimeStringSchema,
        })
        .array(),
    type: typeSchema,
});

export type CalendarEventCreateApiData = z.input<typeof calendarEventCreateApiSchema>;

export const calendarEventEditApiSchema = z.object({
    id: z.uuid(),
    name: z.string().optional(),
    userId: z.uuid().optional(),
    classroomId: z.uuid().nullable().optional(),
    startDate: dateTimeStringSchema.optional(),
    endDate: dateTimeStringSchema.optional(),
    type: typeSchema.optional(),
});

export type CalendarEventEditApiData = z.input<typeof calendarEventEditApiSchema>;

export function formatEventType(type: EventType | undefined | null, langId: LangId): string {
    if (type === null || type === undefined) {
        return '';
    }

    const labels: Record<LangId, Record<EventType, string>> = {
        'en': {
            'rector hours': "Rector's hours",
            'class reservation': 'Class reservation',
        },
        'pl': {
            'rector hours': 'Godziny rektorskie',
            'class reservation': 'Rezerwacja sali',
        },
    };

    return labels[langId][type];
}
