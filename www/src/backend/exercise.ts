import assert from 'node:assert';
import { type Classroom, makeClassroomData } from '@backend/classroom';
import { db } from '@backend/db';
import type { Subject } from '@backend/subject';
import { makeUserPublicData, User } from '@backend/user';
import type { ExerciseData } from '@components/exercises/types';

interface DbExercise {
    id: string;
    name: string;
    subject_id: string;
    exercise_number: number;
    classroom_id: string;
    teacher_id: string;
}

export interface ExerciseCreateData {
    name: string;
    subject: Subject;
    exerciseNumber: number;
    classroom: Classroom;
    teacher: User;
}

export interface ExerciseEditData {
    name?: string | undefined;
    exerciseNumber?: number | undefined;
    classroom?: Classroom | undefined;
    teacher?: User | undefined;
}

export class Exercise {
    id: string;
    name: string;
    subjectId: string;
    exerciseNumber: number;
    classroomId: string;
    teacherId: string;

    constructor(data: DbExercise) {
        this.id = data.id;
        this.name = data.name;
        this.subjectId = data.subject_id;
        this.exerciseNumber = data.exercise_number;
        this.classroomId = data.classroom_id;
        this.teacherId = data.teacher_id;
    }

    async getTeacher(): Promise<User> {
        const teacher = await User.fetch(this.teacherId);

        assert(teacher);

        return teacher;
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

    static async fetchAllFromSubjects(subjects: Subject[]): Promise<Exercise[]> {
        const records = (
            await db.query<DbExercise>(
                'SELECT * FROM exercises WHERE subject_id = ANY ($1) ORDER BY subject_id, exercise_number',
                [subjects.map(subject => subject.id)],
            )
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
                'INSERT INTO exercises (id, name, subject_id, exercise_number, classroom_id, teacher_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [
                    crypto.randomUUID(),
                    data.name,
                    data.subject.id,
                    data.exerciseNumber,
                    data.classroom.id,
                    data.teacher.id,
                ],
            )
        ).rows[0];

        assert(result);

        return new Exercise(result);
    }

    async edit(data: ExerciseEditData): Promise<void> {
        if (data.name !== undefined) {
            this.name = data.name;
        }

        if (data.exerciseNumber !== undefined) {
            this.exerciseNumber = data.exerciseNumber;
        }

        if (data.classroom !== undefined) {
            this.classroomId = data.classroom.id;
        }

        if (data.teacher !== undefined) {
            this.teacherId = data.teacher.id;
        }

        await db.query(
            'UPDATE exercises SET name = $2, subject_id = $3, exercise_number = $4, classroom_id = $5, teacher_id = $6 WHERE id = $1',
            [this.id, this.name, this.subjectId, this.exerciseNumber, this.classroomId, this.teacherId],
        );
    }
}

export function makeExerciseData(exercise: Exercise, classroom: Classroom, teacher: User): ExerciseData {
    return {
        id: exercise.id,
        name: exercise.name,
        subjectId: exercise.subjectId,
        exerciseNumber: exercise.exerciseNumber,
        classroom: makeClassroomData(classroom),
        teacher: makeUserPublicData(teacher),
    };
}
