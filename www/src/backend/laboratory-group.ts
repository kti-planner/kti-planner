import assert from 'node:assert';
import { db } from '@backend/db';
import type { Subject } from '@backend/subject';
import type { LaboratoryGroupData } from '@components/laboratory-groups/types';

interface DbLaboratoryGroup {
    id: string;
    name: string;
    subject_id: string;
}

export interface LaboratoryGroupCreateData {
    name: string;
    subject: Subject;
}

export interface LaboratoryGroupEditData {
    name?: string | undefined;
}

export class LaboratoryGroup {
    id: string;
    name: string;
    subjectId: string;

    constructor(data: DbLaboratoryGroup) {
        this.id = data.id;
        this.name = data.name;
        this.subjectId = data.subject_id;
    }

    static async fetch(id: string): Promise<LaboratoryGroup | null> {
        const data = (await db.query<DbLaboratoryGroup>('SELECT * FROM laboratory_groups WHERE id = $1', [id])).rows[0];

        return data ? new LaboratoryGroup(data) : null;
    }

    static async fetchAll(): Promise<LaboratoryGroup[]> {
        const records = (await db.query<DbLaboratoryGroup>('SELECT * FROM laboratory_groups ORDER BY subject_id, name'))
            .rows;

        return records.map(record => new LaboratoryGroup(record));
    }

    static async fetchAllFromSubject(subject: Subject): Promise<LaboratoryGroup[]> {
        const records = (
            await db.query<DbLaboratoryGroup>('SELECT * FROM laboratory_groups WHERE subject_id = $1 ORDER BY name', [
                subject.id,
            ])
        ).rows;

        return records.map(record => new LaboratoryGroup(record));
    }

    static async fetchAllFromSubjects(subjects: Subject[]): Promise<LaboratoryGroup[]> {
        const records = (
            await db.query<DbLaboratoryGroup>(
                'SELECT * FROM laboratory_groups WHERE subject_id = ANY ($1) ORDER BY name',
                [subjects.map(subject => subject.id)],
            )
        ).rows;

        return records.map(record => new LaboratoryGroup(record));
    }

    static async create(data: LaboratoryGroupCreateData): Promise<LaboratoryGroup> {
        const result = (
            await db.query<DbLaboratoryGroup>(
                'INSERT INTO laboratory_groups (id, name, subject_id) VALUES ($1, $2, $3) RETURNING *',
                [crypto.randomUUID(), data.name, data.subject.id],
            )
        ).rows[0];

        assert(result);

        return new LaboratoryGroup(result);
    }

    async edit(data: LaboratoryGroupEditData): Promise<void> {
        if (data.name !== undefined) {
            this.name = data.name;
        }

        await db.query('UPDATE laboratory_groups SET name = $2 WHERE id = $1', [this.id, this.name]);
    }
}

export function makeLaboratoryGroupData(group: LaboratoryGroup): LaboratoryGroupData {
    return {
        id: group.id,
        name: group.name,
    };
}
