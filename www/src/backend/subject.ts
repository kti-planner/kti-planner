import assert from 'node:assert';
import { db } from '@backend/db';
import type { Semester } from '@backend/semester';
import { makeUserPublicData, User } from '@backend/user';
import type { SubjectData } from '@components/subjects/types';
import { toHyphenatedLowercase } from '@components/utils';

interface DbSubject {
    id: string;
    name: string;
    semester_id: string;
    teacher_ids: string[];
    description: string;
    moodle_course_id: string;
}

export interface SubjectCreateData {
    name: string;
    semester: Semester;
    teachers: User[];
    description: string;
    moodleCourseId: string;
}

export interface SubjectEditData {
    name?: string | undefined;
    semester?: Semester | undefined;
    teachers?: User[] | undefined;
    description?: string | undefined;
    moodleCourseId?: string | undefined;
}

export class Subject {
    id: string;
    name: string;
    semesterId: string;
    teacherIds: string[];
    description: string;
    moodleCourseId: string;

    constructor(data: DbSubject) {
        this.id = data.id;
        this.name = data.name;
        this.semesterId = data.semester_id;
        this.teacherIds = data.teacher_ids;
        this.description = data.description;
        this.moodleCourseId = data.moodle_course_id;
    }

    get slug(): string {
        return toHyphenatedLowercase(this.name);
    }

    async getTeachers(): Promise<User[]> {
        const teachers = await User.fetchBulk(this.teacherIds);

        assert(teachers.every(teacher => teacher !== null));

        return teachers;
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
        if (await Subject.fetchBySlug(data.semester, toHyphenatedLowercase(data.name))) {
            throw new Error('Subject with this slug already exists');
        }

        const result = (
            await db.query<DbSubject>(
                'INSERT INTO subjects (id, name, semester_id, teacher_ids, description, moodle_course_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [
                    crypto.randomUUID(),
                    data.name,
                    data.semester.id,
                    data.teachers.map(user => user.id),
                    data.description,
                    data.moodleCourseId,
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

        await db.query(
            'UPDATE subjects SET name = $2, semester_id = $3, teacher_ids = $4, description = $5, moodle_course_id = $6 WHERE id = $1',
            [this.id, this.name, this.semesterId, this.teacherIds, this.description, this.moodleCourseId],
        );
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
    };
}
