import z from 'zod';
import type { ExerciseData } from '@components/exercises/types';
import type { LaboratoryGroupData } from '@components/laboratory-groups/types';
import type { UserData } from '@components/users/types';
import { dateTimeStringSchema } from '@components/utils';

export interface LaboratoryClassData {
    id: string;
    exercise: ExerciseData;
    laboratoryGroup: LaboratoryGroupData;
    startDate: string;
    endDate: string;
    teacher: UserData;
}

export const laboratoryClassCreateApiSchema = z
    .object({
        exerciseId: z.uuid(),
        laboratoryGroupId: z.uuid(),
        startDate: dateTimeStringSchema,
        endDate: dateTimeStringSchema,
    })
    .array();

export type LaboratoryClassCreateApiData = z.input<typeof laboratoryClassCreateApiSchema>;

export const laboratoryClassEditApiSchema = z.object({
    id: z.uuid(),
    startDate: dateTimeStringSchema.optional(),
    endDate: dateTimeStringSchema.optional(),
    teacherId: z.uuid().optional(),
});

export type LaboratoryClassEditApiData = z.input<typeof laboratoryClassEditApiSchema>;
