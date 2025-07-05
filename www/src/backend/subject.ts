import assert from 'node:assert';
import { db } from '@backend/db';
import type { Semester } from '@backend/semester';

interface DbSubject {
    id: string;
    name: string;
    semester_id: string;
}

export interface SubjectCreateData {
    name: string;
    semester: Semester;
}

export interface SubjectEditData {
    name?: string | undefined;
    semester?: Semester | undefined;
}

export class Subject {
    id: string;
    name: string;
    semesterId: string;

    constructor(data: DbSubject) {
        this.id = data.id;
        this.name = data.name;
        this.semesterId = data.semester_id;
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

    static async create(data: SubjectCreateData): Promise<Subject> {
        const result = (
            await db.query<DbSubject>('INSERT INTO subjects (id, name, semester_id) VALUES ($1, $2, $3) RETURNING *', [
                crypto.randomUUID(),
                data.name,
                data.semester.id,
            ])
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

        await db.query('UPDATE subjects SET name = $2, semester_id = $3 WHERE id = $1', [
            this.id,
            this.name,
            this.semesterId,
        ]);
    }
}
