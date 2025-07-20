import assert from 'node:assert';
import { db } from '@backend/db';
import type { Exercise } from '@backend/exercise';
import type { LaboratoryGroup } from '@backend/laboratory-group';
import type { Subject } from '@backend/subject';

interface DbLaboratoryClass {
    id: string;
    exercise_id: string;
    laboratory_group_id: string;
    start_date: Date;
    end_date: Date;
}

export interface LaboratoryClassCreateData {
    exercise: Exercise;
    laboratoryGroup: LaboratoryGroup;
    startDate: Date;
    endDate: Date;
}

export interface LaboratoryClassEditData {
    startDate?: Date | undefined;
    endDate?: Date | undefined;
}

export class LaboratoryClass {
    id: string;
    exerciseId: string;
    laboratoryGroupId: string;
    startDate: Date;
    endDate: Date;

    constructor(data: DbLaboratoryClass) {
        this.id = data.id;
        this.exerciseId = data.exercise_id;
        this.laboratoryGroupId = data.laboratory_group_id;
        this.startDate = data.start_date;
        this.endDate = data.end_date;
    }

    static async fetch(id: string): Promise<LaboratoryClass | null> {
        const data = (await db.query<DbLaboratoryClass>('SELECT * FROM laboratory_classes WHERE id = $1', [id]))
            .rows[0];

        return data ? new LaboratoryClass(data) : null;
    }

    static async fetchAll(): Promise<LaboratoryClass[]> {
        const records = (await db.query<DbLaboratoryClass>('SELECT * FROM laboratory_classes ORDER BY id')).rows;

        return records.map(record => new LaboratoryClass(record));
    }

    static async fetchAllFromSubject(subject: Subject): Promise<LaboratoryClass[]> {
        const records = (
            await db.query<DbLaboratoryClass>(
                'SELECT *' +
                    ' FROM laboratory_classes JOIN laboratory_groups ON laboratory_classes.laboratory_group_id = laboratory_groups.id' +
                    ' WHERE laboratory_groups.subject_id = $1' +
                    ' ORDER BY laboratory_classes.id',
                [subject.id],
            )
        ).rows;

        return records.map(record => new LaboratoryClass(record));
    }

    static async create(data: LaboratoryClassCreateData): Promise<LaboratoryClass> {
        const result = (
            await db.query<DbLaboratoryClass>(
                'INSERT INTO laboratory_classes (id, exercise_id, laboratory_group_id, start_date, end_date)' +
                    ' VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [crypto.randomUUID(), data.exercise.id, data.laboratoryGroup.id, data.startDate, data.endDate],
            )
        ).rows[0];

        assert(result);

        return new LaboratoryClass(result);
    }

    async edit(data: LaboratoryClassEditData): Promise<void> {
        if (data.startDate !== undefined) {
            this.startDate = data.startDate;
        }

        if (data.endDate !== undefined) {
            this.endDate = data.endDate;
        }

        await db.query('UPDATE laboratory_classes SET start_date = $2, end_date = $3 WHERE id = $1', [
            this.id,
            this.startDate,
            this.endDate,
        ]);
    }
}
