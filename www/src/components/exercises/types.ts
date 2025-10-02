import z from 'zod';
import type { ClassroomData } from '@components/classrooms/types';
import type { UserData } from '@components/users/types';

export interface ExerciseData {
    id: string;
    name: string;
    subjectId: string;
    exerciseNumber: number;
    classroom: ClassroomData;
    teacher: UserData;
    moodleUrl: string;
}

export const exerciseCreateApiSchema = z.object({
    name: z.string().trim().nonempty(),
    exerciseNumber: z.number().int().min(0),
    subjectId: z.uuid(),
    classroomId: z.uuid(),
    teacherId: z.uuid(),
    moodleUrl: z.string(),
});

export type ExerciseCreateApiData = z.input<typeof exerciseCreateApiSchema>;

export const exerciseEditApiSchema = z.object({
    id: z.uuid(),
    name: z.string().optional(),
    exerciseNumber: z.number().optional(),
    classroomId: z.uuid().optional(),
    teacherId: z.uuid().optional(),
    moodleUrl: z.string().optional(),
});

export type ExerciseEditApiData = z.input<typeof exerciseEditApiSchema>;
