import assert from 'node:assert';
import { env } from 'src/utils';
import { db } from '@backend/db';
import type { Semester } from '@backend/semester';
import { makeUserPublicData, User } from '@backend/user';
import type { SubjectData } from '@components/subjects/types';
import { numberToRoman, toHyphenatedLowercase } from '@components/utils';

assert(env.MOODLE_BASE_URL !== undefined);
const moodleBaseUrl = env.MOODLE_BASE_URL;

export type StudyModeType = 'full-time' | 'part-time';
export type StudyCycleType = 'first-cycle' | 'second-cycle';

interface DbSubject {
    id: string;
    name: string;
    semester_id: string;
    teacher_ids: string[];
    description: string;
    moodle_course_id: string;
    duration_minutes: number | null;
    class_repeat_weeks: number;
    semester_number: number;
    study_mode: StudyModeType;
    study_cycle: StudyCycleType;
}

export interface SubjectCreateData {
    name: string;
    semester: Semester;
    teachers: User[];
    description: string;
    moodleCourseId: string;
    durationMinutes: number | null;
    classRepeatWeeks: number;
    semesterNumber: number;
    studyMode: StudyModeType;
    studyCycle: StudyCycleType;
}

export interface SubjectEditData {
    name?: string | undefined;
    semester?: Semester | undefined;
    teachers?: User[] | undefined;
    description?: string | undefined;
    moodleCourseId?: string | undefined;
    durationMinutes?: number | null | undefined;
    classRepeatWeeks?: number | undefined;
    semesterNumber?: number | undefined;
    studyMode?: StudyModeType | undefined;
    studyCycle?: StudyCycleType | undefined;
}

export class Subject {
    id: string;
    name: string;
    semesterId: string;
    teacherIds: string[];
    description: string;
    moodleCourseId: string;
    durationMinutes: number | null;
    classRepeatWeeks: number;
    semesterNumber: number;
    studyMode: StudyModeType;
    studyCycle: StudyCycleType;

    constructor(data: DbSubject) {
        this.id = data.id;
        this.name = data.name;
        this.semesterId = data.semester_id;
        this.teacherIds = data.teacher_ids;
        this.description = data.description;
        this.moodleCourseId = data.moodle_course_id;
        this.durationMinutes = data.duration_minutes;
        this.classRepeatWeeks = data.class_repeat_weeks;
        this.semesterNumber = data.semester_number;
        this.studyMode = data.study_mode;
        this.studyCycle = data.study_cycle;
    }

    get slug(): string {
        return toHyphenatedLowercase(this.fullName);
    }

    get fullName(): string {
        return `${this.name} sem. ${numberToRoman(this.semesterNumber)}`;
    }

    async getTeachers(): Promise<User[]> {
        return (await User.fetchBulk(this.teacherIds)).filter(user => user !== null);
    }

    static async fetch(id: string): Promise<Subject | null> {
        const data = (await db.query<DbSubject>('SELECT * FROM subjects WHERE id = $1', [id])).rows[0];

        return data ? new Subject(data) : null;
    }

    static async fetchAll(): Promise<Subject[]> {
        const records = (await db.query<DbSubject>('SELECT * FROM subjects ORDER BY name')).rows;

        return records.map(record => new Subject(record));
    }

    static async fetchAllFromSemester(semester: Semester): Promise<Subject[]> {
        const records = (
            await db.query<DbSubject>('SELECT * FROM subjects WHERE semester_id = $1 ORDER BY name', [semester.id])
        ).rows;

        return records.map(record => new Subject(record));
    }

    static async fetchBySlug(semester: Semester, slug: string): Promise<Subject | null> {
        const subjects = await Subject.fetchAllFromSemester(semester);

        return subjects.find(subject => subject.slug === slug) ?? null;
    }

    static async create(data: SubjectCreateData): Promise<Subject> {
        if (
            await Subject.fetchBySlug(
                data.semester,
                toHyphenatedLowercase(`${data.name} sem. ${numberToRoman(data.semesterNumber)}`),
            )
        ) {
            throw new Error('Subject with this slug already exists');
        }

        const result = (
            await db.query<DbSubject>(
                'INSERT INTO subjects (id, name, semester_id, teacher_ids, description, moodle_course_id, duration_minutes, class_repeat_weeks, semester_number, study_mode, study_cycle) ' +
                    'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
                [
                    crypto.randomUUID(),
                    data.name,
                    data.semester.id,
                    data.teachers.map(user => user.id),
                    data.description,
                    data.moodleCourseId,
                    data.durationMinutes,
                    data.classRepeatWeeks,
                    data.semesterNumber,
                    data.studyMode,
                    data.studyCycle,
                ],
            )
        ).rows[0];

        assert(result);

        return new Subject(result);
    }

    async edit(data: SubjectEditData): Promise<void> {
        if (data.name !== undefined) {
            this.name = data.name;
        }

        if (data.semester !== undefined) {
            this.semesterId = data.semester.id;
        }

        if (data.teachers !== undefined) {
            this.teacherIds = data.teachers.map(user => user.id);
        }

        if (data.description !== undefined) {
            this.description = data.description;
        }

        if (data.moodleCourseId !== undefined) {
            this.moodleCourseId = data.moodleCourseId;
        }

        if (data.durationMinutes !== undefined) {
            this.durationMinutes = data.durationMinutes;
        }

        if (data.classRepeatWeeks !== undefined) {
            this.classRepeatWeeks = data.classRepeatWeeks;
        }

        if (data.semesterNumber !== undefined) {
            this.semesterNumber = data.semesterNumber;
        }

        if (data.studyMode !== undefined) {
            this.studyMode = data.studyMode;
        }

        if (data.studyCycle !== undefined) {
            this.studyCycle = data.studyCycle;
        }

        await db.query(
            'UPDATE subjects SET name = $2, semester_id = $3, teacher_ids = $4, description = $5, moodle_course_id = $6,' +
                ' duration_minutes = $7, class_repeat_weeks = $8, semester_number = $9, study_mode = $10, study_cycle = $11 WHERE id = $1',
            [
                this.id,
                this.name,
                this.semesterId,
                this.teacherIds,
                this.description,
                this.moodleCourseId,
                this.durationMinutes,
                this.classRepeatWeeks,
                this.semesterNumber,
                this.studyMode,
                this.studyCycle,
            ],
        );
    }

    async delete(): Promise<void> {
        await db.query('DELETE FROM subjects WHERE id = $1', [this.id]);
    }
}

export function makeSubjectData(subject: Subject, allUsers: User[]): SubjectData {
    const teachers = allUsers.filter(user => subject.teacherIds.includes(user.id));

    return {
        id: subject.id,
        name: subject.name,
        semesterId: subject.semesterId,
        slug: subject.slug,
        teachers: teachers.map(makeUserPublicData),
        description: subject.description,
        moodleCourseId: subject.moodleCourseId,
        moodleCourseUrl: subject.moodleCourseId !== '' ? moodleBaseUrl + subject.moodleCourseId : '',
        durationMinutes: subject.durationMinutes,
        classRepeatWeeks: subject.classRepeatWeeks,
        studyMode: subject.studyMode,
        studyCycle: subject.studyCycle,
        semesterNumber: subject.semesterNumber,
    };
}
