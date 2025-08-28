import assert from 'node:assert';
import { db } from '@backend/db';
import type { ClassroomData } from '@components/classrooms/types';

interface DbClassroom {
    id: string;
    name: string;
}

export interface ClassroomCreateData {
    name: string;
}

export interface ClassroomEditData {
    name?: string | undefined;
}

export class Classroom {
    id: string;
    name: string;

    constructor(data: DbClassroom) {
        this.id = data.id;
        this.name = data.name;
    }

    static async fetch(id: string): Promise<Classroom | null> {
        const data = (await db.query<DbClassroom>('SELECT * FROM classrooms WHERE id = $1', [id])).rows[0];

        return data ? new Classroom(data) : null;
    }

    static async fetchAll(): Promise<Classroom[]> {
        const records = (await db.query<DbClassroom>('SELECT * FROM classrooms ORDER BY name')).rows;

        return records.map(record => new Classroom(record));
    }

    static async create(data: ClassroomCreateData): Promise<Classroom> {
        const result = (
            await db.query<DbClassroom>('INSERT INTO classrooms (id, name) VALUES ($1, $2) RETURNING *', [
                crypto.randomUUID(),
                data.name,
            ])
        ).rows[0];

        assert(result);

        return new Classroom(result);
    }

    async edit(data: ClassroomEditData): Promise<void> {
        if (data.name !== undefined) {
            this.name = data.name;
        }

        await db.query('UPDATE classrooms SET name = $2 WHERE id = $1', [this.id, this.name]);
    }
}

export function makeClassroomData(classroom: Classroom): ClassroomData {
    return {
        id: classroom.id,
        name: classroom.name,
    };
}
