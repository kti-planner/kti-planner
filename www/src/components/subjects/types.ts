import z from 'zod';
import type { StudyCycleType, StudyModeType } from '@backend/subject';
import type { UserPublicData } from '@components/users/types';

export interface SubjectData {
    id: string;
    name: string;
    fullName: string;
    semesterId: string;
    slug: string;
    teachers: UserPublicData[];
    description: string;
    moodleCourseId: string;
    moodleCourseUrl: string;
    durationMinutes: number | null;
    classRepeatWeeks: number;
    semesterNumber: number;
    studyMode: StudyModeType;
    studyCycle: StudyCycleType;
    color: string;
}

export function makeSubjectStudyDetails(subject: SubjectData, lang: LangId): string {
    if (subject.studyMode === 'full-time' && subject.studyCycle === 'first-cycle') {
        return lang === 'pl' ? 'Studia stacjonarne I stopnia (Inżynierskie)' : 'Full-time first-cycle studies';
    } else if (subject.studyMode === 'full-time' && subject.studyCycle === 'second-cycle') {
        return lang === 'pl' ? 'Studia stacjonarne II stopnia (Magisterskie)' : 'Full-time second-cycle studies';
    } else if (subject.studyMode === 'part-time' && subject.studyCycle === 'first-cycle') {
        return lang === 'pl' ? 'Studia niestacjonarne I stopnia (Inżynierskie)' : 'Part-time first-cycle studies';
    } else if (subject.studyMode === 'part-time' && subject.studyCycle === 'second-cycle') {
        return lang === 'pl' ? 'Studia niestacjonarne II stopnia (MSU)' : 'Part-time second-cycle studies';
    } else {
        return '';
    }
}

const studyModeSchema = z.enum(['full-time', 'part-time']);

const studyCycleSchema = z.enum(['first-cycle', 'second-cycle']);

export const subjectCreateApiSchema = z.object({
    name: z.string().trim().nonempty(),
    semesterId: z.uuid(),
    teacherIds: z.uuid().array(),
    description: z.string(),
    moodleCourseId: z.string(),
    durationMinutes: z.int().nonnegative().nullable(),
    classRepeatWeeks: z.int().nonnegative(),
    studyMode: studyModeSchema,
    studyCycle: studyCycleSchema,
    semesterNumber: z.int().min(1).max(7),
});

export type SubjectCreateApiData = z.input<typeof subjectCreateApiSchema>;

export const subjectEditApiSchema = z.object({
    id: z.uuid(),
    name: z.string().optional(),
    teacherIds: z.uuid().array().optional(),
    description: z.string().optional(),
    moodleCourseId: z.string().optional(),
    durationMinutes: z.int().nonnegative().nullable().optional(),
    classRepeatWeeks: z.int().nonnegative().optional(),
    studyMode: studyModeSchema.optional(),
    studyCycle: studyCycleSchema.optional(),
    semesterNumber: z.int().min(1).max(7).optional(),
});

export type SubjectEditApiData = z.input<typeof subjectEditApiSchema>;

export const subjectCopyFromPreviousSemesterApiSchema = z.object({
    semesterId: z.uuid(),
    subjectId: z.uuid(),
});

export type SubjectCopyFromPreviousSemesterApiData = z.input<typeof subjectCopyFromPreviousSemesterApiSchema>;
