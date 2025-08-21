import assert from 'node:assert';
import bcrypt from 'bcrypt';
import { db } from '@backend/db';
import type { UserData } from '@components/users/types';

export type RoleType = 'admin' | 'teacher';

interface DbUser {
    id: string;
    name: string;
    email: string;
    password_hash: string | null;
    role: RoleType;
}

export interface UserCreateData {
    name: string;
    email: string;
    password: string | null;
    role: RoleType;
}

export interface UserEditData {
    name?: string | undefined;
    email?: string | undefined;
    password?: string | null | undefined;
    role?: RoleType | undefined;
}

export class User {
    id: string;
    name: string;
    email: string;
    passwordHash: string | null;
    role: RoleType;

    constructor(data: DbUser) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.passwordHash = data.password_hash;
        this.role = data.role;
    }

    static async fetch(id: string): Promise<User | null> {
        const data = (await db.query<DbUser>('SELECT * FROM users WHERE id = $1', [id])).rows[0];

        return data ? new User(data) : null;
    }

    static async fetchByEmail(email: string): Promise<User | null> {
        const data = (await db.query<DbUser>('SELECT * FROM users WHERE email = $1', [email])).rows[0];

        return data ? new User(data) : null;
    }

    static async fetchAll(): Promise<User[]> {
        const records = (await db.query<DbUser>('SELECT * FROM users ORDER BY name')).rows;

        return records.map(record => new User(record));
    }

    static async fetchBulk(ids: string[]): Promise<(User | null)[]> {
        const users = await User.fetchAll();

        return ids.map(id => users.find(user => user.id === id) ?? null);
    }

    static async create(data: UserCreateData): Promise<User> {
        const passwordHash = data.password === null ? null : await User.hashPassword(data.password);

        const result = (
            await db.query<DbUser>(
                'INSERT INTO users (id, name, email, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [crypto.randomUUID(), data.name, data.email, passwordHash, data.role],
            )
        ).rows[0];

        assert(result);

        return new User(result);
    }

    async edit(data: UserEditData): Promise<void> {
        if (data.name !== undefined) {
            this.name = data.name;
        }

        if (data.email !== undefined) {
            this.email = data.email;
        }

        if (data.password !== undefined) {
            this.passwordHash = data.password === null ? null : await User.hashPassword(data.password);
        }

        if (data.role !== undefined) {
            this.role = data.role;
        }

        await db.query('UPDATE users SET name = $2, email = $3, password_hash = $4, role = $5 WHERE id = $1', [
            this.id,
            this.name,
            this.email,
            this.passwordHash,
            this.role,
        ]);
    }

    async checkPassword(password: string): Promise<boolean> {
        return this.passwordHash !== null && (await bcrypt.compare(password, this.passwordHash));
    }

    static async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }
}

export function makeUserData(user: User): UserData {
    return {
        id: user.id,
        name: user.name,
    };
}
