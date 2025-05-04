import assert from 'node:assert';
import { db } from '@backend/db';

export type SemesterType = 'summer' | 'winter';

interface DbSemester {
    id: string;
    year: number;
    type: SemesterType;
    start_date: Date;
    end_date: Date;
}

export interface SemesterCreateData {
    year: number;
    type: SemesterType;
    startDate: Date;
    endDate: Date;
}

export interface SemesterEditData {
    year?: number | undefined;
    type?: SemesterType | undefined;
    startDate?: Date | undefined;
    endDate?: Date | undefined;
}

export class Semester {
    id: string;
    year: number;
    type: SemesterType;
    startDate: Date;
    endDate: Date;

    constructor(data: DbSemester) {
        this.id = data.id;
        this.year = data.year;
        this.type = data.type;
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
                'INSERT INTO semesters (id, year, type, start_date, end_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [crypto.randomUUID(), data.year, data.type, data.startDate, data.endDate],
            )
        ).rows[0];

        assert(result);

        return new Semester(result);
    }

    async edit(data: SemesterEditData): Promise<void> {
        if (data.year !== undefined) {
            this.year = data.year;
        }

        if (data.type !== undefined) {
            this.type = data.type;
        }
        if (data.startDate !== undefined) {
            this.startDate = data.startDate;
        }

        if (data.endDate !== undefined) {
            this.endDate = data.endDate;
        }

        await db.query('UPDATE semesters SET year = $2, type = $3, start_date = $4, end_date = $5 WHERE id = $1', [
            this.id,
            this.year,
            this.type,
            this.startDate,
            this.endDate,
        ]);
    }
}
