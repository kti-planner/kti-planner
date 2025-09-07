import assert from 'node:assert';
import { db } from '@backend/db';
import type { ScheduleChangeData, SemesterData } from '@components/semesters/types';
import { formatDateLocalYyyyMmDd } from '@components/utils';

export type SemesterType = 'winter' | 'summer';

export function isSemesterType(key: unknown): key is SemesterType {
    return key === 'winter' || key === 'summer';
}

export type ScheduleChangeType =
    | 'holiday'
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday';

interface DbSemester {
    id: string;
    year: number;
    type: SemesterType;
    start_date: Date;
    end_date: Date;
}

interface DbScheduleChange {
    date: Date;
    type: ScheduleChangeType;
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

export interface ScheduleChange {
    date: Date;
    type: ScheduleChangeType;
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

    get slug(): string {
        return `${this.year}-${this.type}`;
    }

    static async fetch(id: string): Promise<Semester | null> {
        const data = (await db.query<DbSemester>('SELECT * FROM semesters WHERE id = $1', [id])).rows[0];

        return data ? new Semester(data) : null;
    }

    static async fetchByYearAndType(year: number, type: SemesterType): Promise<Semester | null> {
        const data = (await db.query<DbSemester>('SELECT * FROM semesters WHERE year = $1 AND type = $2', [year, type]))
            .rows[0];

        return data ? new Semester(data) : null;
    }

    static async fetchBySlug(slug: string): Promise<Semester | null> {
        const [year, type, ...rest] = slug.split('-');

        if (!isSemesterType(type) || year === undefined || rest.length > 0) {
            return null;
        }

        return await Semester.fetchByYearAndType(parseInt(year), type);
    }

    static async fetchByDate(date: Date): Promise<Semester | null> {
        const data = (
            await db.query<DbSemester>('SELECT * FROM semesters WHERE $1 BETWEEN start_date AND end_date', [date])
        ).rows[0];

        return data ? new Semester(data) : null;
    }

    static async fetchAll(): Promise<Semester[]> {
        const records = (await db.query<DbSemester>('SELECT * FROM semesters ORDER BY year DESC, type DESC')).rows;

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

    static async getAllScheduleChanges(): Promise<ScheduleChange[]> {
        const data = await db.query<DbScheduleChange>('SELECT * FROM schedule_changes ORDER BY date');

        return data.rows;
    }

    async getScheduleChanges(): Promise<ScheduleChange[]> {
        const data = await db.query<DbScheduleChange>(
            'SELECT * FROM schedule_changes WHERE date BETWEEN $1 AND $2 ORDER BY date',
            [this.startDate, this.endDate],
        );

        return data.rows;
    }

    static async setScheduleChange(date: Date, type: ScheduleChangeType | null): Promise<void> {
        if (type) {
            await db.query<DbScheduleChange>(
                'INSERT INTO schedule_changes (date, type) VALUES ($1, $2) ON CONFLICT (date) DO UPDATE SET type = $2',
                [date, type],
            );
        } else {
            await db.query<DbScheduleChange>('DELETE FROM schedule_changes WHERE date = $1', [date]);
        }
    }
}

export function makeSemesterData(semester: Semester): SemesterData {
    return {
        id: semester.id,
        type: semester.type,
        year: semester.year,
        slug: semester.slug,
        startDate: formatDateLocalYyyyMmDd(semester.startDate),
        endDate: formatDateLocalYyyyMmDd(semester.endDate),
    };
}

export function makeScheduleChangeData(scheduleChange: ScheduleChange): ScheduleChangeData {
    return {
        date: formatDateLocalYyyyMmDd(scheduleChange.date),
        type: scheduleChange.type,
    };
}
