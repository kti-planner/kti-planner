import z from 'zod';
import type { ClassroomData } from '@components/classrooms/types';
import { dateTimeStringSchema } from '@components/utils';

export interface EventConflictData {
    classroom: ClassroomData | null;
    startDate: string;
    endDate: string;
}

export const eventConflictsApiSchema = z
    .object({
        start: dateTimeStringSchema,
        end: dateTimeStringSchema,
        classroomId: z.uuid(),
    })
    .array();
