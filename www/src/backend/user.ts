import assert from 'node:assert';
import bcrypt from 'bcrypt';
import { db } from '@backend/db';

interface DbUser {
    id: string;
    name: string;
    email: string;
    password_hash: string | null;
}

interface UserCreateData {
    name: string;
    email: string;
    password: string | null;
}

interface UserEditData {
    name?: string | undefined;
    email?: string | undefined;
    password?: string | null | undefined;
}

export class User {
    id: string;
    name: string;
    email: string;
    passwordHash: string | null;

    constructor(data: DbUser) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.passwordHash = data.password_hash;
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
        const records = (await db.query<DbUser>('SELECT * FROM users')).rows;

        return records.map(record => new User(record));
    }

    static async create(data: UserCreateData): Promise<User> {
        const passwordHash = data.password === null ? null : await User.hashPassword(data.password);

        const result = (
            await db.query<DbUser>(
                'INSERT INTO users (id, name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *',
                [crypto.randomUUID(), data.name, data.email, passwordHash],
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

        await db.query('UPDATE users SET name = $2, email = $3, password_hash = $4 WHERE id = $1', [
            this.id,
            this.name,
            this.email,
            this.passwordHash,
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
