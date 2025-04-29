import assert from 'node:assert';
import { db } from '@backend/db';

interface DbSemester {
    id: string;
    start_date: Date;
    end_date: Date;
}

export interface SemesterCreateData {
    startDate: Date;
    endDate: Date;
}

export interface SemesterEditData {
    startDate?: Date | undefined;
    endDate?: Date | undefined;
}

export class Semester {
    id: string;
    startDate: Date;
    endDate: Date;

    constructor(data: DbSemester) {
        this.id = data.id;
        this.startDate = data.start_date;
        this.endDate = data.end_date;
    }

    static async fetch(id: string): Promise<Semester | null> {
        const data = (await db.query<DbSemester>('SELECT * FROM semesters WHERE id = $1', [id])).rows[0];

        return data ? new Semester(data) : null;
    }

    static async fetchAll(): Promise<Semester[]> {
        const records = (await db.query<DbSemester>('SELECT * FROM semesters')).rows;

        return records.map(record => new Semester(record));
    }

    static async create(data: SemesterCreateData): Promise<Semester> {
        const result = (
            await db.query<DbSemester>(
                'INSERT INTO semesters (id, start_date, end_date) VALUES ($1, $2, $3) RETURNING *',
                [crypto.randomUUID(), data.startDate, data.endDate],
            )
        ).rows[0];

        assert(result);

        return new Semester(result);
    }

    async edit(data: SemesterEditData): Promise<void> {
        if (data.startDate !== undefined) {
            this.startDate = data.startDate;
        }

        if (data.endDate !== undefined) {
            this.endDate = data.endDate;
        }

        await db.query('UPDATE semesters SET start_date = $2, end_date = $3 WHERE id = $1', [
            this.id,
            this.startDate,
            this.endDate,
        ]);
    }
}
