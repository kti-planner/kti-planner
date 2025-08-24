import assert from 'node:assert';
import type { Classroom } from '@backend/classroom';
import { db } from '@backend/db';
import { type Exercise, makeExerciseData } from '@backend/exercise';
import { type LaboratoryGroup, makeLaboratoryGroupData } from '@backend/laboratory-group';
import type { Subject } from '@backend/subject';
import { makeUserData, type User } from '@backend/user';
import type { LaboratoryClassData } from '@components/laboratory-classes/types';

interface DbLaboratoryClass {
    id: string;
    exercise_id: string;
    laboratory_group_id: string;
    start_date: Date;
    end_date: Date;
    teacher_id: string;
}

export interface LaboratoryClassCreateData {
    exercise: Exercise;
    laboratoryGroup: LaboratoryGroup;
    startDate: Date;
    endDate: Date;
    teacher: User;
}

export interface LaboratoryClassEditData {
    startDate?: Date | undefined;
    endDate?: Date | undefined;
    teacher?: User | undefined;
}

export class LaboratoryClass {
    id: string;
    exerciseId: string;
    laboratoryGroupId: string;
    startDate: Date;
    endDate: Date;
    teacherId: string;

    constructor(data: DbLaboratoryClass) {
        this.id = data.id;
        this.exerciseId = data.exercise_id;
        this.laboratoryGroupId = data.laboratory_group_id;
        this.startDate = data.start_date;
        this.endDate = data.end_date;
        this.teacherId = data.teacher_id;
    }

    static async fetch(id: string): Promise<LaboratoryClass | null> {
        const data = (await db.query<DbLaboratoryClass>('SELECT * FROM laboratory_classes WHERE id = $1', [id]))
            .rows[0];

        return data ? new LaboratoryClass(data) : null;
    }

    static async fetchAll(): Promise<LaboratoryClass[]> {
        const records = (await db.query<DbLaboratoryClass>('SELECT * FROM laboratory_classes ORDER BY start_date'))
            .rows;

        return records.map(record => new LaboratoryClass(record));
    }

    static async fetchAllFromSubject(subject: Subject): Promise<LaboratoryClass[]> {
        const records = (
            await db.query<DbLaboratoryClass>(
                'SELECT laboratory_classes.*' +
                    ' FROM laboratory_classes JOIN laboratory_groups ON laboratory_classes.laboratory_group_id = laboratory_groups.id' +
                    ' WHERE laboratory_groups.subject_id = $1' +
                    ' ORDER BY laboratory_classes.start_date',
                [subject.id],
            )
        ).rows;

        return records.map(record => new LaboratoryClass(record));
    }

    static async create(data: LaboratoryClassCreateData): Promise<LaboratoryClass> {
        const result = (
            await db.query<DbLaboratoryClass>(
                'INSERT INTO laboratory_classes (id, exercise_id, laboratory_group_id, start_date, end_date, teacher_id)' +
                    ' VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [
                    crypto.randomUUID(),
                    data.exercise.id,
                    data.laboratoryGroup.id,
                    data.startDate,
                    data.endDate,
                    data.teacher.id,
                ],
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

        if (data.teacher !== undefined) {
            this.teacherId = data.teacher.id;
        }

        await db.query('UPDATE laboratory_classes SET start_date = $2, end_date = $3, teacher_id = $4 WHERE id = $1', [
            this.id,
            this.startDate,
            this.endDate,
            this.teacherId,
        ]);
    }
}

export function makeLaboratoryClassData(
    laboratoryClass: LaboratoryClass,
    exercise: Exercise,
    exerciseClassroom: Classroom,
    exerciseTeacher: User,
    group: LaboratoryGroup,
    classTeacher: User,
): LaboratoryClassData {
    return {
        id: laboratoryClass.id,
        exercise: makeExerciseData(exercise, exerciseClassroom, exerciseTeacher),
        laboratoryGroup: makeLaboratoryGroupData(group),
        startDate: laboratoryClass.startDate.toISOString(),
        endDate: laboratoryClass.endDate.toISOString(),
        teacher: makeUserData(classTeacher),
    };
}
