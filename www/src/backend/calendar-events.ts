import assert from 'node:assert';
import { type Classroom, makeClassroomData } from '@backend/classroom';
import { db } from '@backend/db';
import { makeSemesterData, type Semester } from '@backend/semester';
import { makeUserPublicData, type User } from '@backend/user';
import type { CalendarEventData } from '@components/calendar-events/types';
import { formatDateLocalYyyyMmDdHhMm } from '@components/utils';

interface DbCalendarEvent {
    id: string;
    name: string;
    user_id: string | null;
    classroom_id: string | null;
    semester_id: string;
    start_date: Date;
    end_date: Date;
}

export interface CalendarEventCreateData {
    name: string;
    user: User | null;
    classroom: Classroom | null;
    semester: Semester;
    startDate: Date;
    endDate: Date;
}

export interface CalendarEventEditData {
    name?: string | undefined;
    classroom?: Classroom | null | undefined;
    startDate?: Date | undefined;
    endDate?: Date | undefined;
}

export class CalendarEvent {
    id: string;
    name: string;
    userId: string | null;
    classroomId: string | null;
    semesterId: string;
    startDate: Date;
    endDate: Date;

    constructor(data: DbCalendarEvent) {
        this.id = data.id;
        this.name = data.name;
        this.userId = data.user_id;
        this.classroomId = data.classroom_id;
        this.semesterId = data.semester_id;
        this.startDate = data.start_date;
        this.endDate = data.end_date;
    }

    static async fetch(id: string): Promise<CalendarEvent | null> {
        const data = (await db.query<DbCalendarEvent>('SELECT * FROM calendar_events WHERE id = $1', [id])).rows[0];

        return data ? new CalendarEvent(data) : null;
    }

    static async fetchAll(): Promise<CalendarEvent[]> {
        const records = (await db.query<DbCalendarEvent>('SELECT * FROM calendar_events ORDER BY start_date')).rows;

        return records.map(record => new CalendarEvent(record));
    }

    static async fetchAllFromSemester(semester: Semester): Promise<CalendarEvent[]> {
        const records = (
            await db.query<DbCalendarEvent>(
                'SELECT * FROM calendar_events WHERE semester_id = $1 ORDER BY start_date',
                [semester.id],
            )
        ).rows;

        return records.map(record => new CalendarEvent(record));
    }

    static async create(data: CalendarEventCreateData): Promise<CalendarEvent> {
        const result = (
            await db.query<DbCalendarEvent>(
                'INSERT INTO calendar_events (id, name, user_id, classroom_id, semester_id, start_date, end_date)' +
                    ' VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [
                    crypto.randomUUID(),
                    data.name,
                    data.user?.id ?? null,
                    data.classroom?.id ?? null,
                    data.semester.id,
                    data.startDate,
                    data.endDate,
                ],
            )
        ).rows[0];

        assert(result);

        return new CalendarEvent(result);
    }

    async edit(data: CalendarEventEditData): Promise<void> {
        if (data.name !== undefined) {
            this.name = data.name;
        }

        if (data.classroom !== undefined) {
            this.classroomId = data.classroom?.id ?? null;
        }

        if (data.startDate !== undefined) {
            this.startDate = data.startDate;
        }

        if (data.endDate !== undefined) {
            this.endDate = data.endDate;
        }

        await db.query(
            'UPDATE calendar_events SET name = $2, classroom_id = $3, start_date = $4, end_date = $5 WHERE id = $1',
            [this.id, this.name, this.classroomId, this.startDate, this.endDate],
        );
    }

    async delete(): Promise<void> {
        await db.query('DELETE FROM calendar_events WHERE id = $1', [this.id]);
    }
}

export function makeCalendarEventData(
    calendarEvent: CalendarEvent,
    user: User | null,
    classroom: Classroom | null,
    semester: Semester,
): CalendarEventData {
    return {
        id: calendarEvent.id,
        name: calendarEvent.name,
        user: user ? makeUserPublicData(user) : null,
        classroom: classroom ? makeClassroomData(classroom) : null,
        semester: makeSemesterData(semester),
        startDate: formatDateLocalYyyyMmDdHhMm(calendarEvent.startDate),
        endDate: formatDateLocalYyyyMmDdHhMm(calendarEvent.endDate),
    };
}
