import assert from 'node:assert';
import { db } from '@backend/db';
import type { Subject } from '@backend/subject';

interface DbExercise {
    id: string;
    name: string;
    subject_id: string;
    exercise_number: number;
}

export interface ExerciseCreateData {
    name: string;
    subject: Subject;
    exerciseNumber: number;
}

export interface ExerciseEditData {
    name?: string | undefined;
    subject?: Subject | undefined;
    exerciseNumber?: number | undefined;
}

export class Exercise {
    id: string;
    name: string;
    subjectId: string;
    exerciseNumber: number;

    constructor(data: DbExercise) {
        this.id = data.id;
        this.name = data.name;
        this.subjectId = data.subject_id;
        this.exerciseNumber = data.exercise_number;
    }

    static async fetch(id: string): Promise<Exercise | null> {
        const data = (await db.query<DbExercise>('SELECT * FROM exercises WHERE id = $1', [id])).rows[0];

        return data ? new Exercise(data) : null;
    }

    static async fetchAll(): Promise<Exercise[]> {
        const records = (await db.query<DbExercise>('SELECT * FROM exercises ORDER BY subject_id, exercise_number'))
            .rows;

        return records.map(record => new Exercise(record));
    }

    static async fetchAllFromSubject(subject: Subject): Promise<Exercise[]> {
        const records = (
            await db.query<DbExercise>('SELECT * FROM exercises WHERE subject_id = $1 ORDER BY exercise_number', [
                subject.id,
            ])
        ).rows;

        return records.map(record => new Exercise(record));
    }

    static async fetchByNumber(subject: Subject, number: number): Promise<Exercise | null> {
        const data = (
            await db.query<DbExercise>('SELECT * FROM exercises WHERE subject_id = $1 AND exercise_number = $2', [
                subject.id,
                number,
            ])
        ).rows[0];

        return data ? new Exercise(data) : null;
    }

    static async create(data: ExerciseCreateData): Promise<Exercise> {
        const result = (
            await db.query<DbExercise>(
                'INSERT INTO exercises (id, name, subject_id, exercise_number) VALUES ($1, $2, $3, $4) RETURNING *',
                [crypto.randomUUID(), data.name, data.subject.id, data.exerciseNumber],
            )
        ).rows[0];

        assert(result);

        return new Exercise(result);
    }

    async edit(data: ExerciseEditData): Promise<void> {
        if (data.name !== undefined) {
            this.name = data.name;
        }

        if (data.subject !== undefined) {
            this.subjectId = data.subject.id;
        }

        if (data.exerciseNumber !== undefined) {
            this.exerciseNumber = data.exerciseNumber;
        }

        await db.query('UPDATE exercises SET name = $2, subject_id = $3, exercise_number = $4 WHERE id = $1', [
            this.id,
            this.name,
            this.subjectId,
            this.exerciseNumber,
        ]);
    }
}
