import assert from 'node:assert';
import { env } from 'src/utils';
import { db } from '@backend/db';
import { Semester } from '@backend/semester';
import { makeUserPublicData, User } from '@backend/user';
import type { SubjectData } from '@components/subjects/types';
import { makeSubjectFullName, toHyphenatedLowercase } from '@components/utils';

assert(env.MOODLE_BASE_URL !== undefined);
const moodleBaseUrl = env.MOODLE_BASE_URL;

export type StudyModeType = 'full-time' | 'part-time';
export type StudyCycleType = 'first-cycle' | 'second-cycle';

interface DbSubject {
    id: string;
    name_pl: string;
    semester_id: string;
    teacher_ids: string[];
    description: string;
    moodle_course_id: string;
    duration_minutes: number | null;
    class_repeat_weeks: number;
    study_mode: StudyModeType;
    study_cycle: StudyCycleType;
    semester_number: number;
    color: string;
    name_en: string;
}

export interface SubjectCreateData {
    namePl: string;
    nameEn: string;
    semester: Semester;
    teachers: User[];
    description: string;
    moodleCourseId: string;
    durationMinutes: number | null;
    classRepeatWeeks: number;
    studyMode: StudyModeType;
    studyCycle: StudyCycleType;
    semesterNumber: number;
    color: string;
}

export interface SubjectEditData {
    namePl?: string | undefined;
    nameEn?: string | undefined;
    semester?: Semester | undefined;
    teachers?: User[] | undefined;
    description?: string | undefined;
    moodleCourseId?: string | undefined;
    durationMinutes?: number | null | undefined;
    classRepeatWeeks?: number | undefined;
    studyMode?: StudyModeType | undefined;
    studyCycle?: StudyCycleType | undefined;
    semesterNumber?: number | undefined;
    color?: string | undefined;
}

export class Subject {
    id: string;
    namePl: string;
    nameEn: string;
    semesterId: string;
    teacherIds: string[];
    description: string;
    moodleCourseId: string;
    durationMinutes: number | null;
    classRepeatWeeks: number;
    studyMode: StudyModeType;
    studyCycle: StudyCycleType;
    semesterNumber: number;
    color: string;

    constructor(data: DbSubject) {
        this.id = data.id;
        this.namePl = data.name_pl;
        this.nameEn = data.name_en;
        this.semesterId = data.semester_id;
        this.teacherIds = data.teacher_ids;
        this.description = data.description;
        this.moodleCourseId = data.moodle_course_id;
        this.durationMinutes = data.duration_minutes;
        this.classRepeatWeeks = data.class_repeat_weeks;
        this.studyMode = data.study_mode;
        this.studyCycle = data.study_cycle;
        this.semesterNumber = data.semester_number;
        this.color = data.color;
    }

    get slug(): string {
        return toHyphenatedLowercase(makeSubjectFullName(this));
    }

    async getTeachers(): Promise<User[]> {
        return User.sortUsers((await User.fetchBulk(this.teacherIds)).filter(user => user !== null));
    }

    static async fetch(id: string): Promise<Subject | null> {
        const data = (await db.query<DbSubject>('SELECT * FROM subjects WHERE id = $1', [id])).rows[0];

        return data ? new Subject(data) : null;
    }

    static async fetchAll(): Promise<Subject[]> {
        const records = (await db.query<DbSubject>('SELECT * FROM subjects ORDER BY name_pl, name_en')).rows;

        return records.map(record => new Subject(record));
    }

    static async fetchAllFromSemester(semester: Semester): Promise<Subject[]> {
        const records = (
            await db.query<DbSubject>('SELECT * FROM subjects WHERE semester_id = $1 ORDER BY name_pl, name_en', [
                semester.id,
            ])
        ).rows;

        return records.map(record => new Subject(record));
    }

    static async fetchBySlug(semester: Semester, slug: string): Promise<Subject | null> {
        const subjects = await Subject.fetchAllFromSemester(semester);

        return subjects.find(subject => subject.slug === slug) ?? null;
    }

    static async isDuplicateName({
        semester,
        namePl,
        nameEn,
        semesterNumber,
    }: {
        semester: Semester;
        namePl: string;
        nameEn: string;
        semesterNumber: number;
    }): Promise<boolean> {
        const subjects = await Subject.fetchAllFromSemester(semester);

        return subjects.some(s => {
            const equalNamePl = s.namePl !== '' && s.namePl === namePl;
            const equalNameEn = s.nameEn !== '' && s.nameEn === nameEn;

            return s.semesterNumber === semesterNumber && (equalNamePl || equalNameEn);
        });
    }

    static async create(data: SubjectCreateData): Promise<Subject> {
        if (await Subject.isDuplicateName(data)) {
            throw new Error('A subject with this name already exists');
        }

        const result = (
            await db.query<DbSubject>(
                'INSERT INTO subjects (id, name_pl, name_en, semester_id, teacher_ids, description, moodle_course_id, duration_minutes, class_repeat_weeks, study_mode, study_cycle, semester_number, color)' +
                    ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *',
                [
                    crypto.randomUUID(),
                    data.namePl,
                    data.nameEn,
                    data.semester.id,
                    data.teachers.map(user => user.id),
                    data.description,
                    data.moodleCourseId,
                    data.durationMinutes,
                    data.classRepeatWeeks,
                    data.studyMode,
                    data.studyCycle,
                    data.semesterNumber,
                    data.color,
                ],
            )
        ).rows[0];

        assert(result);

        return new Subject(result);
    }

    async edit(data: SubjectEditData): Promise<void> {
        const semester = await Semester.fetch(data.semester?.id ?? this.semesterId);
        assert(semester);

        if (
            await Subject.isDuplicateName({
                semester,
                namePl: data.namePl ?? this.namePl,
                nameEn: data.nameEn ?? this.nameEn,
                semesterNumber: data.semesterNumber ?? this.semesterNumber,
            })
        ) {
            throw new Error('A subject with this name already exists');
        }

        if (data.namePl !== undefined) {
            this.namePl = data.namePl;
        }

        if (data.nameEn !== undefined) {
            this.nameEn = data.nameEn;
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

        if (data.studyMode !== undefined) {
            this.studyMode = data.studyMode;
        }

        if (data.studyCycle !== undefined) {
            this.studyCycle = data.studyCycle;
        }

        if (data.semesterNumber !== undefined) {
            this.semesterNumber = data.semesterNumber;
        }

        if (data.color !== undefined) {
            this.color = data.color;
        }

        await db.query(
            'UPDATE subjects SET name_pl = $2, name_en = $3, semester_id = $4, teacher_ids = $5, description = $6, moodle_course_id = $7,' +
                ' duration_minutes = $8, class_repeat_weeks = $9, study_mode = $10, study_cycle = $11, semester_number = $12, color = $13 WHERE id = $1',
            [
                this.id,
                this.namePl,
                this.nameEn,
                this.semesterId,
                this.teacherIds,
                this.description,
                this.moodleCourseId,
                this.durationMinutes,
                this.classRepeatWeeks,
                this.studyMode,
                this.studyCycle,
                this.semesterNumber,
                this.color,
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
        namePl: subject.namePl,
        nameEn: subject.nameEn,
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
        color: subject.color,
    };
}
